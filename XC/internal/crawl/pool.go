package crawl

import (
	"context"
	"log"
	"net/url"
	"sync"
	"time"

	"ethioburg/internal/config"
)

type JobResult struct {
	URL      string
	Category string
	RawHTML  string
	Err      error
}

type HostLimiter struct {
	mu           sync.Mutex
	last         map[string]time.Time
	defaultDelay time.Duration
	robots       *RobotsCache
	userAgent    string
}

func NewHostLimiter(robots *RobotsCache, defaultDelayMs int, userAgent string) *HostLimiter {
	return &HostLimiter{
		last:         make(map[string]time.Time),
		defaultDelay: time.Duration(defaultDelayMs) * time.Millisecond,
		robots:       robots,
		userAgent:    userAgent,
	}
}

// Wait enforces per-host pacing. Sleep is interruptible via ctx.
func (h *HostLimiter) Wait(ctx context.Context, hostURL string) error {
	txt, err := h.robots.GetOrFetch(hostURL, h.userAgent)
	delay := h.defaultDelay
	if err == nil && txt.CrawlDelay > delay {
		delay = txt.CrawlDelay
	}

	h.mu.Lock()
	var wait time.Duration
	if t, ok := h.last[hostURL]; ok {
		if remaining := delay - time.Since(t); remaining > 0 {
			wait = remaining
		}
	}
	h.mu.Unlock()

	if wait > 0 {
		timer := time.NewTimer(wait)
		defer timer.Stop()
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-timer.C:
		}
	}

	h.mu.Lock()
	h.last[hostURL] = time.Now()
	h.mu.Unlock()
	return nil
}

// RunWorkerPool fetches seeds concurrently and invokes onResult as each job finishes.
func RunWorkerPool(ctx context.Context, cfg *config.Config, onResult func(JobResult)) {
	jobs := make(chan config.Seed, len(cfg.Seeds))
	results := make(chan JobResult, len(cfg.Seeds))

	robots := NewRobotsCache()
	limiter := NewHostLimiter(robots, cfg.DefaultRateDelayMs, cfg.UserAgent)

	var wg sync.WaitGroup
	workers := cfg.Workers
	if workers > len(cfg.Seeds) && len(cfg.Seeds) > 0 {
		workers = len(cfg.Seeds)
	}

	for w := 0; w < workers; w++ {
		wg.Add(1)
		go func(workerID int) {
			defer wg.Done()
			for seed := range jobs {
				if ctx.Err() != nil {
					results <- JobResult{URL: seed.URL, Category: seed.Category, Err: ctx.Err()}
					continue
				}

				u, err := url.Parse(seed.URL)
				if err != nil {
					results <- JobResult{URL: seed.URL, Category: seed.Category, Err: err}
					continue
				}
				hostURL := u.Scheme + "://" + u.Host

				txt, err := robots.GetOrFetch(seed.URL, cfg.UserAgent)
				if err != nil {
					results <- JobResult{URL: seed.URL, Category: seed.Category, Err: err}
					continue
				}
				if !txt.IsAllowed(seed.URL) {
					log.Printf("[worker %d] skipped by robots.txt: %s", workerID, seed.URL)
					results <- JobResult{URL: seed.URL, Category: seed.Category, Err: fmtRobotsDenied(seed.URL)}
					continue
				}

				if err := limiter.Wait(ctx, hostURL); err != nil {
					results <- JobResult{URL: seed.URL, Category: seed.Category, Err: err}
					continue
				}

				log.Printf("[worker %d] fetching: %s", workerID, seed.URL)
				html, err := FetchHTML(ctx, cfg, seed.URL)
				results <- JobResult{
					URL:      seed.URL,
					Category: seed.Category,
					RawHTML:  html,
					Err:      err,
				}
			}
		}(w)
	}

	go func() {
		defer close(results)
		defer func() {
			close(jobs)
			wg.Wait()
		}()

		for _, seed := range cfg.Seeds {
			if ctx.Err() != nil {
				return
			}
			select {
			case <-ctx.Done():
				return
			case jobs <- seed:
			}
		}
	}()

	for res := range results {
		if onResult != nil {
			onResult(res)
		}
	}
}

type robotsDeniedError struct {
	url string
}

func (e *robotsDeniedError) Error() string {
	return "disallowed by robots.txt: " + e.url
}

func fmtRobotsDenied(u string) error {
	return &robotsDeniedError{url: u}
}
