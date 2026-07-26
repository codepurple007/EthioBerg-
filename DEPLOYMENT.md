# Deploying EthioBerg to Render

`render.yaml` at the repo root defines both services, so Render can create them in one step.

| Service | Type | Root directory | URL |
|---|---|---|---|
| `ethioberg-api` | Docker web service | `EthioBerg/backend` | `https://ethioberg-api.onrender.com` |
| `ethioberg-web` | Node web service | `EthioBerg` | `https://ethioberg-web.onrender.com` |

The backend builds from `EthioBerg/backend/Dockerfile` rather than using Render's native
Python runtime, because OCR needs the Tesseract system binary and the native runtime has no
root access to install system packages. The Dockerfile pins Python and installs Tesseract
with English and Amharic language data, so there is no build or start command to configure.

## First deploy

1. Push `main` to GitHub. Render deploys from the repo, not from your working copy.
2. In the Render dashboard choose **New → Blueprint** and pick the `EthioBerg-` repo.
3. Render reads `render.yaml` and shows both services. It prompts for `PINECONE_API_KEY`;
   leave it blank unless you want the hosted vector index (see below).
4. Apply. The backend builds first because the frontend reads its hostname.

Both services are on the `starter` plan. The backend needs a paid instance because it has
a persistent disk attached; free instances cannot mount one.

## Why the backend has a disk

All backend state is on the filesystem: the SQLite database, uploaded issuer documents,
and stored source files. Render's filesystem is otherwise wiped on every deploy, which
would reset the source library, ingestion setting versions, evaluation history, and the
audit log.

The disk mounts at `/var/data` and `ETHIOBERG_DATA_DIR` points the application there. A
service with a disk runs a single instance and does not get zero-downtime deploys — both
expected, since SQLite allows only one writer.

## Environment variables

Backend (`ethioberg-api`):

| Variable | Value | Purpose |
|---|---|---|
| `ETHIOBERG_DATA_DIR` | `/var/data` | Puts the database and uploads on the disk |
| `CORS_ALLOW_ORIGIN_REGEX` | matches `ethioberg-web*.onrender.com` | Lets the browser call the API |
| `PINECONE_API_KEY` | *(prompted, optional)* | Only for the hosted vector index |
| `PINECONE_INDEX_NAME` | `ethioberg-regulatory` | |
| `PINECONE_NAMESPACE` | `regulatory` | |

Frontend (`ethioberg-web`):

| Variable | Value | Purpose |
|---|---|---|
| `NODE_VERSION` | `22.22.0` | Matches the version the build is tested against |
| `API_EXTERNAL_HOSTNAME` | from `ethioberg-api` | Public hostname of the API |

`NEXT_PUBLIC_API_URL` is not set as a variable. Next.js inlines `NEXT_PUBLIC_*` values into
the browser bundle at build time, so the build command composes it from
`API_EXTERNAL_HOSTNAME`. Render's `fromService` `property: host` is deliberately not used:
it returns the *private* hostname, which a browser cannot reach.

## If you rename a service

Two places assume the names above:

- `CORS_ALLOW_ORIGIN_REGEX` must match the frontend's real hostname, or every API call
  fails CORS in the browser.
- The frontend's `API_EXTERNAL_HOSTNAME` reference must name the backend service.

Render appends a suffix when a name is taken (`ethioberg-web-a1b2.onrender.com`); the
regex already allows for that.

## Retrieval backend

Retrieval defaults to `auto`, which picks a backend based on whether Pinecone is
configured:

- *`PINECONE_API_KEY` set* — the hosted Pinecone index serves queries. It covers far more
  content (~1,100 indexed chunks), but each query takes several seconds, and because it
  scores unrelated questions nearly as highly as valid ones, the pipeline abstains less
  reliably on out-of-scope questions.
- *`PINECONE_API_KEY` blank* — the in-process hybrid retriever serves queries (BM25 +
  TF-IDF with reciprocal rank fusion). It answers in milliseconds and refuses out-of-scope
  questions correctly, but only sees the 13 chunks committed in
  `backend/config/corpus/regulatory_chunks.yaml`.

An administrator can override this per environment under **Admin → Retrieval Operations**
by choosing `hybrid` or `pinecone` explicitly. That choice is stored in the database, so it
persists across deploys and takes precedence over the default above.

Because the setting is stored, an environment that has been changed once will not pick up a
change to the default. Check the current value on the Retrieval Operations page rather than
inferring it from the code.

## OCR

Scanned PDFs carry no text layer, so ingestion falls back to OCR for any page yielding
fewer characters than the threshold set under **Admin → Ingestion**. This requires the
Tesseract binary, which only the Docker image provides — running the backend from a plain
`pip install` leaves OCR unavailable.

The application never pretends otherwise. `GET /api/v1/ingestion/stats` reports whether
Tesseract is present along with its installed languages, the Ingestion page shows a warning
when it is not, and an upload that needed OCR but could not run says so in its extraction
warnings rather than reporting empty text as success.

To add a language, install its `tesseract-ocr-<code>` package in the Dockerfile. Selecting a
language in the UI that is not installed is reported as an error rather than silently
ignored, because passing an uninstalled code makes Tesseract fail the whole page.

For local OCR, install the binary directly (`sudo apt install tesseract-ocr
tesseract-ocr-amh`). Without it the app still runs; OCR simply reports itself unavailable.

## Cold starts

Starter instances sleep after inactivity and take roughly a minute to wake. Load the site
before a demo so the first request is not the slow one.
