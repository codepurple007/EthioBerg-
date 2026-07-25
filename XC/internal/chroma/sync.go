package chroma

import (
	"context"
	"fmt"

	chromav2 "github.com/amikos-tech/chroma-go/pkg/api/v2"

	"ethioburg/internal/config"
	"ethioburg/internal/filter"
)

const batchSize = 100

// Writer keeps a live Chroma connection for incremental upserts during a scrape.
type Writer struct {
	client     chromav2.Client
	collection chromav2.Collection
	name       string
}

func NewWriter(ctx context.Context, cfg *config.Config) (*Writer, error) {
	client, err := chromav2.NewHTTPClient(chromav2.WithBaseURL(cfg.ChromaURL))
	if err != nil {
		return nil, fmt.Errorf("chroma client: %w", err)
	}

	collection, err := client.GetOrCreateCollection(ctx, cfg.Collection)
	if err != nil {
		_ = client.Close()
		return nil, fmt.Errorf("get or create collection %q: %w", cfg.Collection, err)
	}

	return &Writer{client: client, collection: collection, name: cfg.Collection}, nil
}

func (w *Writer) Close() error {
	if w == nil || w.client == nil {
		return nil
	}
	return w.client.Close()
}

func (w *Writer) Upsert(ctx context.Context, chunks []filter.ProcessedChunk) error {
	if w == nil || len(chunks) == 0 {
		return nil
	}

	for start := 0; start < len(chunks); start += batchSize {
		end := start + batchSize
		if end > len(chunks) {
			end = len(chunks)
		}
		batch := chunks[start:end]

		ids := make([]chromav2.DocumentID, 0, len(batch))
		texts := make([]string, 0, len(batch))
		metas := make([]chromav2.DocumentMetadata, 0, len(batch))

		for _, chunk := range batch {
			meta, err := chromav2.NewDocumentMetadataFromMap(chunk.Metadata)
			if err != nil {
				return fmt.Errorf("metadata for id %s: %w", chunk.ID, err)
			}
			ids = append(ids, chromav2.DocumentID(chunk.ID))
			texts = append(texts, chunk.Content)
			metas = append(metas, meta)
		}

		if err := w.collection.Upsert(ctx,
			chromav2.WithIDs(ids...),
			chromav2.WithTexts(texts...),
			chromav2.WithMetadatas(metas...),
		); err != nil {
			return fmt.Errorf("upsert batch [%d:%d]: %w", start, end, err)
		}
	}

	return nil
}

// SyncToVectorSpace opens a short-lived writer and upserts all chunks (compat helper).
func SyncToVectorSpace(ctx context.Context, cfg *config.Config, chunks []filter.ProcessedChunk) error {
	writer, err := NewWriter(ctx, cfg)
	if err != nil {
		return err
	}
	defer writer.Close()

	if err := writer.Upsert(ctx, chunks); err != nil {
		return err
	}
	fmt.Printf("Synced %d records into collection %q\n", len(chunks), cfg.Collection)
	return nil
}
