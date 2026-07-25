package crawl

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"time"

	"ethioburg/internal/config"
)

func FetchHTML(ctx context.Context, cfg *config.Config, targetURL string) (string, error) {
	reqCtx, cancel := context.WithTimeout(ctx, time.Duration(cfg.RequestTimeoutSec)*time.Second)
	defer cancel()

	req, err := http.NewRequestWithContext(reqCtx, http.MethodGet, targetURL, nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("User-Agent", cfg.UserAgent)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("non-200 status: %d", resp.StatusCode)
	}

	// Read max+1 bytes so oversized pages are rejected instead of silently truncated.
	limited := io.LimitReader(resp.Body, cfg.MaxPageBytes+1)
	body, err := io.ReadAll(limited)
	if err != nil {
		return "", err
	}
	if int64(len(body)) > cfg.MaxPageBytes {
		return "", fmt.Errorf("page exceeds %d byte limit", cfg.MaxPageBytes)
	}

	return string(body), nil
}
