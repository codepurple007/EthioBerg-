package filter

import (
	"crypto/sha256"
	"fmt"
	"strings"
	"time"
)

type ProcessedChunk struct {
	ID       string
	Content  string
	Metadata map[string]any
}

func FragmentText(text, title, sourceURL, category string, chunkSize int) []ProcessedChunk {
	words := strings.Fields(text)
	if len(words) == 0 {
		return nil
	}
	if chunkSize <= 0 {
		chunkSize = 500
	}

	scrapedAt := time.Now().UTC().Format("2006-01-02")
	var chunks []ProcessedChunk
	var currentWords []string
	currentLen := 0

	emit := func() {
		if len(currentWords) == 0 {
			return
		}
		joined := strings.Join(currentWords, " ")
		hash := sha256.Sum256([]byte(joined))
		chunks = append(chunks, ProcessedChunk{
			ID:      fmt.Sprintf("scrp_%x", hash[:16]),
			Content: joined,
			Metadata: map[string]any{
				"source_url": sourceURL,
				"scraped_at": scrapedAt,
				"category":   category,
				"title":      title,
			},
		})
	}

	for _, word := range words {
		currentWords = append(currentWords, word)
		currentLen += len(word) + 1
		if currentLen >= chunkSize {
			emit()
			currentWords = nil
			currentLen = 0
		}
	}
	emit()

	return chunks
}
