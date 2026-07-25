package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"sync/atomic"
	"syscall"

	"ethioburg/internal/chroma"
	"ethioburg/internal/config"
	"ethioburg/internal/crawl"
	"ethioburg/internal/extract"
	"ethioburg/internal/filter"
)

func main() {
	configPath := "configs/seeds.yaml"
	if len(os.Args) > 1 {
		configPath = os.Args[1]
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	log.Println("Initializing EthioBurg scraping subsystem...")
	cfg, err := config.Load(configPath)
	if err != nil {
		log.Fatalf("config load failed: %v", err)
	}

	writer, err := chroma.NewWriter(ctx, cfg)
	if err != nil {
		log.Fatalf("chroma writer: %v", err)
	}
	defer writer.Close()

	var syncedPages atomic.Int64
	var syncedChunks atomic.Int64

	crawl.RunWorkerPool(ctx, cfg, func(page crawl.JobResult) {
		if page.Err != nil {
			log.Printf("skipping [%s]: %v", page.URL, page.Err)
			return
		}
		if ctx.Err() != nil {
			return
		}

		doc := extract.FromHTML(page.RawHTML)
		body := filter.CleanText(doc.Body)
		if body == "" {
			log.Printf("no extractable body for %s", page.URL)
			return
		}

		chunks := filter.FragmentText(body, doc.Title, page.URL, page.Category, cfg.ChunkSize)
		if len(chunks) == 0 {
			return
		}

		if err := writer.Upsert(ctx, chunks); err != nil {
			log.Printf("chroma upsert failed for %s: %v", page.URL, err)
			return
		}

		pages := syncedPages.Add(1)
		total := syncedChunks.Add(int64(len(chunks)))
		log.Printf("synced %d chunks from %s (pages=%d total_chunks=%d)", len(chunks), page.URL, pages, total)
	})

	if ctx.Err() != nil {
		fmt.Printf("Scrape stopped early. Partial archive kept in Chroma (%d pages, %d chunks).\n",
			syncedPages.Load(), syncedChunks.Load())
		return
	}

	if syncedChunks.Load() == 0 {
		fmt.Println("Pipeline finished with zero knowledge chunks.")
		return
	}

	fmt.Printf("Scrape complete. Synced %d pages / %d chunks into %q.\n",
		syncedPages.Load(), syncedChunks.Load(), cfg.Collection)
}
