import type { ArchiveDocument, ArchiveStatus } from "./types";

type ChromaCollection = {
  id: string;
  name: string;
};

type GetResponse = {
  ids?: string[];
  documents?: (string | null)[];
  metadatas?: (Record<string, unknown> | null)[];
  embeddings?: (number[] | null)[];
};

function basePaths(chromaUrl: string) {
  const base = chromaUrl.replace(/\/$/, "");
  const tenant = "default_tenant";
  const database = "default_database";
  return {
    base,
    collections: `${base}/api/v2/tenants/${tenant}/databases/${database}/collections`,
    collection: (collectionId: string) =>
      `${base}/api/v2/tenants/${tenant}/databases/${database}/collections/${collectionId}`,
    get: (collectionId: string) =>
      `${base}/api/v2/tenants/${tenant}/databases/${database}/collections/${collectionId}/get`,
    delete: (collectionId: string) =>
      `${base}/api/v2/tenants/${tenant}/databases/${database}/collections/${collectionId}/delete`,
    count: (collectionId: string) =>
      `${base}/api/v2/tenants/${tenant}/databases/${database}/collections/${collectionId}/count`,
    heartbeat: `${base}/api/v2/heartbeat`,
  };
}

async function resolveCollection(
  chromaUrl: string,
  collectionName: string,
): Promise<ChromaCollection> {
  const paths = basePaths(chromaUrl);
  const res = await fetch(paths.collections, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Chroma list collections failed (${res.status})`);
  }
  const collections = (await res.json()) as ChromaCollection[];
  const match = collections.find((c) => c.name === collectionName);
  if (!match) {
    throw new Error(`Collection "${collectionName}" not found`);
  }
  return match;
}

function mapDocs(payload: GetResponse): ArchiveDocument[] {
  const ids = payload.ids ?? [];
  const documents = payload.documents ?? [];
  const metadatas = payload.metadatas ?? [];

  return ids.map((id, i) => {
    const meta = metadatas[i] ?? {};
    const url =
      stringMeta(meta, "source_url") ||
      stringMeta(meta, "url") ||
      stringMeta(meta, "source") ||
      "";
    const crawledAt =
      stringMeta(meta, "scraped_at") ||
      stringMeta(meta, "crawledAt") ||
      stringMeta(meta, "crawled_at") ||
      "";
    return {
      id,
      url,
      content: documents[i] ?? "",
      crawledAt,
      category: stringMeta(meta, "category") || "",
      title: stringMeta(meta, "title") || "",
    };
  });
}

function stringMeta(meta: Record<string, unknown>, key: string): string {
  const v = meta[key];
  return typeof v === "string" ? v : "";
}

export async function fetchArchiveStatus(
  chromaUrl: string,
  collectionName: string,
): Promise<ArchiveStatus> {
  const paths = basePaths(chromaUrl);
  try {
    const hb = await fetch(paths.heartbeat, { cache: "no-store" });
    if (!hb.ok) {
      return {
        totalChunks: 0,
        collection: collectionName,
        chromaUrl,
        lastSyncAt: null,
        reachable: false,
        error: `Heartbeat failed (${hb.status})`,
      };
    }

    let collection: ChromaCollection;
    try {
      collection = await resolveCollection(chromaUrl, collectionName);
    } catch {
      // Empty archive after clear (collection not recreated yet)
      return {
        totalChunks: 0,
        collection: collectionName,
        chromaUrl,
        lastSyncAt: null,
        reachable: true,
      };
    }
    const countRes = await fetch(paths.count(collection.id), {
      method: "GET",
      cache: "no-store",
    });

    let totalChunks = 0;
    if (countRes.ok) {
      const countJson = await countRes.json();
      totalChunks =
        typeof countJson === "number"
          ? countJson
          : typeof countJson?.count === "number"
            ? countJson.count
            : 0;
    }

    // Infer last sync from newest scraped_at among a small sample
    const sample = await fetchDocuments(chromaUrl, collectionName, 0, 50);
    const lastSyncAt =
      sample
        .map((d) => d.crawledAt)
        .filter(Boolean)
        .sort()
        .at(-1) ?? null;

    return {
      totalChunks,
      collection: collectionName,
      chromaUrl,
      lastSyncAt,
      reachable: true,
    };
  } catch (err) {
    return {
      totalChunks: 0,
      collection: collectionName,
      chromaUrl,
      lastSyncAt: null,
      reachable: false,
      error: err instanceof Error ? err.message : "Chroma unreachable",
    };
  }
}

export async function fetchDocuments(
  chromaUrl: string,
  collectionName: string,
  offset = 0,
  limit = 25,
  includeEmbeddings = false,
): Promise<ArchiveDocument[]> {
  const paths = basePaths(chromaUrl);
  let collection: ChromaCollection;
  try {
    collection = await resolveCollection(chromaUrl, collectionName);
  } catch {
    return [];
  }

  const include = ["documents", "metadatas"];
  if (includeEmbeddings) include.push("embeddings");

  const res = await fetch(paths.get(collection.id), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ limit, offset, include }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Chroma get failed (${res.status}): ${body}`);
  }

  const payload = (await res.json()) as GetResponse;
  return mapDocs(payload);
}

export async function fetchAllDocuments(
  chromaUrl: string,
  collectionName: string,
  includeEmbeddings = false,
): Promise<ArchiveDocument[]> {
  const pageSize = 200;
  let offset = 0;
  const all: ArchiveDocument[] = [];

  for (;;) {
    const page = await fetchDocuments(
      chromaUrl,
      collectionName,
      offset,
      pageSize,
      includeEmbeddings,
    );
    all.push(...page);
    if (page.length < pageSize) break;
    offset += pageSize;
  }

  return all;
}

export type ExportRecord = ArchiveDocument & {
  embeddings?: number[] | null;
};

export async function fetchExportRecords(
  chromaUrl: string,
  collectionName: string,
  withEmbeddings: boolean,
): Promise<ExportRecord[]> {
  const paths = basePaths(chromaUrl);
  const collection = await resolveCollection(chromaUrl, collectionName);
  const pageSize = 200;
  let offset = 0;
  const all: ExportRecord[] = [];

  for (;;) {
    const include = ["documents", "metadatas"];
    if (withEmbeddings) include.push("embeddings");

    const res = await fetch(paths.get(collection.id), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ limit: pageSize, offset, include }),
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Chroma export get failed (${res.status})`);
    }
    const payload = (await res.json()) as GetResponse;
    const docs = mapDocs(payload);
    for (let i = 0; i < docs.length; i++) {
      all.push({
        ...docs[i],
        embeddings: withEmbeddings ? (payload.embeddings?.[i] ?? null) : undefined,
      });
    }
    if (docs.length < pageSize) break;
    offset += pageSize;
  }

  return all;
}

/**
 * Wipes previously scraped vectors by deleting all records (or dropping the collection).
 * The next scrape recreates data via GetOrCreateCollection.
 */
export async function clearArchive(
  chromaUrl: string,
  collectionName: string,
): Promise<{ deletedCollection: boolean; deletedRecords: number }> {
  const paths = basePaths(chromaUrl);

  let collection: ChromaCollection;
  try {
    collection = await resolveCollection(chromaUrl, collectionName);
  } catch {
    return { deletedCollection: false, deletedRecords: 0 };
  }

  let deletedRecords = 0;
  try {
    const countRes = await fetch(paths.count(collection.id), { cache: "no-store" });
    if (countRes.ok) {
      const countJson = await countRes.json();
      deletedRecords =
        typeof countJson === "number"
          ? countJson
          : typeof countJson?.count === "number"
            ? countJson.count
            : 0;
    }
  } catch {
    // ignore
  }

  try {
    const ids: string[] = [];
    let offset = 0;
    const pageSize = 500;
    for (;;) {
      const res = await fetch(paths.get(collection.id), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: pageSize, offset, include: [] }),
        cache: "no-store",
      });
      if (!res.ok) break;
      const payload = (await res.json()) as GetResponse;
      const pageIds = payload.ids ?? [];
      ids.push(...pageIds);
      if (pageIds.length < pageSize) break;
      offset += pageSize;
    }

    if (ids.length > 0) {
      for (let i = 0; i < ids.length; i += 200) {
        const batch = ids.slice(i, i + 200);
        const del = await fetch(paths.delete(collection.id), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: batch }),
          cache: "no-store",
        });
        if (!del.ok) {
          const body = await del.text();
          throw new Error(`Chroma delete records failed (${del.status}): ${body}`);
        }
      }
      return {
        deletedCollection: false,
        deletedRecords: ids.length || deletedRecords,
      };
    }
  } catch {
    // Fall through to full collection delete
  }

  const drop = await fetch(paths.collection(collection.id), {
    method: "DELETE",
    cache: "no-store",
  });
  if (!drop.ok && drop.status !== 404) {
    const body = await drop.text();
    throw new Error(`Chroma delete collection failed (${drop.status}): ${body}`);
  }

  return { deletedCollection: true, deletedRecords };
}
