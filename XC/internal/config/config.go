package config

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

type Seed struct {
	URL      string `yaml:"url"`
	Category string `yaml:"category"`
}

type Config struct {
	ChromaURL          string `yaml:"chroma_url"`
	Collection         string `yaml:"collection"`
	ChunkSize          int    `yaml:"chunk_size"`
	Workers            int    `yaml:"workers"`
	RequestTimeoutSec  int    `yaml:"request_timeout_sec"`
	MaxPageBytes       int64  `yaml:"max_page_bytes"`
	UserAgent          string `yaml:"user_agent"`
	DefaultRateDelayMs int    `yaml:"default_rate_delay_ms"`
	Seeds              []Seed `yaml:"seeds"`
}

func Load(path string) (*Config, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var cfg Config
	if err := yaml.NewDecoder(file).Decode(&cfg); err != nil {
		return nil, err
	}
	if err := cfg.validate(); err != nil {
		return nil, err
	}
	return &cfg, nil
}

func (c *Config) validate() error {
	if len(c.Seeds) == 0 {
		return fmt.Errorf("config: at least one seed URL is required")
	}
	if c.ChromaURL == "" {
		c.ChromaURL = "http://localhost:8000"
	}
	if c.Collection == "" {
		c.Collection = "local_archives"
	}
	if c.ChunkSize <= 0 {
		c.ChunkSize = 500
	}
	if c.Workers <= 0 {
		c.Workers = 4
	}
	if c.Workers > 100 {
		c.Workers = 100
	}
	if c.RequestTimeoutSec <= 0 {
		c.RequestTimeoutSec = 10
	}
	if c.MaxPageBytes <= 0 {
		c.MaxPageBytes = 30 * 1024 * 1024
	}
	if c.UserAgent == "" {
		c.UserAgent = "SovereignAI-ArchiveScraper/2.0 (Local Research Application)"
	}
	if c.DefaultRateDelayMs < 0 {
		c.DefaultRateDelayMs = 0
	}
	for i, seed := range c.Seeds {
		if seed.URL == "" {
			return fmt.Errorf("config: seed[%d] missing url", i)
		}
		if seed.Category == "" {
			c.Seeds[i].Category = "historical_web_scrape"
		}
	}
	return nil
}
