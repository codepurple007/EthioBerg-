# EthioBerg Python API

FastAPI backend for deterministic listing rules, SQLite persistence, and REST endpoints consumed by the Next.js frontend.

## Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Health check: http://localhost:8000/health

API docs: http://localhost:8000/docs

## Tests

```bash
pytest
```

Rule boundary tests live in `tests/unit/test_rule_engine.py`.

## Key endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/sources` | List regulatory sources |
| POST | `/api/v1/readiness/evaluate` | Run deterministic rule engine |
| GET | `/api/v1/rules` | List YAML-backed rules |
| PATCH | `/api/v1/rules/{id}/approve` | Approve draft rule |
| GET | `/api/v1/companies` | ESX issuer registry |

Mutating admin routes require headers:

- `X-Actor-Id`
- `X-Actor-Name`

## Rule definitions

Versioned YAML files in `config/rules/`:

- `main_market.yaml`
- `growth_market.yaml`

Evaluated by `src/services/rule_engine.py` — no LLM arithmetic.
