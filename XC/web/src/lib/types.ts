export type Seed = {
  url: string;
  category: string;
};

export type ScraperConfig = {
  chroma_url: string;
  collection: string;
  chunk_size: number;
  workers: number;
  request_timeout_sec: number;
  max_page_bytes: number;
  user_agent: string;
  default_rate_delay_ms: number;
  seeds: Seed[];
};

export type ArchiveDocument = {
  id: string;
  url: string;
  content: string;
  crawledAt: string;
  category: string;
  title: string;
};

export type ArchiveStatus = {
  totalChunks: number;
  collection: string;
  chromaUrl: string;
  lastSyncAt: string | null;
  reachable: boolean;
  error?: string;
};

export type ScrapeRuntime = {
  running: boolean;
  pid: number | null;
  startedAt: string | null;
  lastExitCode: number | null;
  lastLog: string;
};
