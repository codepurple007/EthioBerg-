package crawl

import (
	"bufio"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"
)

type RobotsTxt struct {
	CrawlDelay time.Duration
	Disallowed []string
}

type RobotsCache struct {
	mu    sync.RWMutex
	cache map[string]*RobotsTxt
}

func NewRobotsCache() *RobotsCache {
	return &RobotsCache{
		cache: make(map[string]*RobotsTxt),
	}
}

func (r *RobotsCache) GetOrFetch(pageURL string, userAgent string) (*RobotsTxt, error) {
	u, err := url.Parse(pageURL)
	if err != nil {
		return nil, err
	}
	host := u.Scheme + "://" + u.Host

	r.mu.RLock()
	if txt, ok := r.cache[host]; ok {
		r.mu.RUnlock()
		return txt, nil
	}
	r.mu.RUnlock()

	r.mu.Lock()
	defer r.mu.Unlock()

	if txt, ok := r.cache[host]; ok {
		return txt, nil
	}

	txt := fetchRobots(host, userAgent)
	r.cache[host] = txt
	return txt, nil
}

func fetchRobots(host, userAgent string) *RobotsTxt {
	txt := &RobotsTxt{
		CrawlDelay: 0, // only apply when robots.txt sets Crawl-delay explicitly
	}

	client := &http.Client{Timeout: 5 * time.Second}
	req, err := http.NewRequest(http.MethodGet, host+"/robots.txt", nil)
	if err != nil {
		return txt
	}
	if userAgent != "" {
		req.Header.Set("User-Agent", userAgent)
	}

	resp, err := client.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		if resp != nil {
			resp.Body.Close()
		}
		return txt
	}
	defer resp.Body.Close()

	scanner := bufio.NewScanner(resp.Body)
	inRelevantAgent := false

	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}

		lower := strings.ToLower(line)
		if strings.HasPrefix(lower, "user-agent:") {
			agent := strings.TrimSpace(line[len("user-agent:"):])
			inRelevantAgent = agent == "*"
			continue
		}

		if !inRelevantAgent {
			continue
		}

		if strings.HasPrefix(lower, "disallow:") {
			path := strings.TrimSpace(line[len("disallow:"):])
			if path != "" {
				txt.Disallowed = append(txt.Disallowed, path)
			}
		} else if strings.HasPrefix(lower, "crawl-delay:") {
			var delaySecs int
			if _, err := fmt.Sscanf(strings.TrimSpace(line[len("crawl-delay:"):]), "%d", &delaySecs); err == nil && delaySecs > 0 {
				txt.CrawlDelay = time.Duration(delaySecs) * time.Second
			}
		}
	}
	return txt
}

func (txt *RobotsTxt) IsAllowed(targetURL string) bool {
	u, err := url.Parse(targetURL)
	if err != nil {
		return false
	}
	path := u.Path
	if path == "" {
		path = "/"
	}
	for _, d := range txt.Disallowed {
		if d == "/" {
			return false
		}
		if strings.HasPrefix(path, d) {
			return false
		}
	}
	return true
}
