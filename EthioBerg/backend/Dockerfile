# The backend runs on Docker rather than Render's native Python runtime because
# OCR needs the Tesseract system binary, and the native runtime has no root access
# to install system packages.
FROM python:3.13-slim

# tesseract-ocr provides the engine; the -eng and -amh packages provide the
# trained language data for English and Amharic, matching the ingestion defaults.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        tesseract-ocr \
        tesseract-ocr-eng \
        tesseract-ocr-amh \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copied first so dependency layers stay cached when only source changes.
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY . .

# Render assigns the port at runtime, so the shell form is needed to expand $PORT.
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
