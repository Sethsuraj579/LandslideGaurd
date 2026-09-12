# LandslideGuard AI

LandslideGuard AI is an AI-assisted landslide risk monitoring and early-warning platform for the North Eastern Region of India. It combines terrain susceptibility, rainfall and soil conditions, risk trend detection, exposure analysis, route safety, explainability, alerts, and scenario simulation.

Project concept: **AI-Based Early Warning and Landslide Risk Monitoring System in NER**  
Smart India Hackathon problem ID: **SIH26001**

The project is local-first and intentionally does not require Docker.

## What The System Does

- Calculates static landslide susceptibility from terrain, geology, landcover, soil, and rainfall features.
- Fuses static susceptibility with dynamic conditions into a risk score from 0 to 100.
- Classifies risk as `LOW`, `WATCH`, `WARNING`, or `CRITICAL`.
- Tracks risk velocity and changing conditions.
- Shows risk areas, environmental triggers, active warnings, and model drivers.
- Supports exposure and route-risk analysis.
- Runs deterministic synthetic demo data when real datasets are unavailable.
- Provides a Random Forest training, prediction, and evaluation pipeline.

## Prerequisites

Required for local development:

- Python 3.12
- [uv](https://docs.astral.sh/uv/)
- Node.js 20 or newer
- npm

Required for production-style geospatial operation:

- PostgreSQL with PostGIS
- GDAL/GEOS native libraries for GeoDjango
- Redis for Channels and Celery
- Real terrain, rainfall, landslide, road, and infrastructure datasets

PostgreSQL, PostGIS, GDAL, and Redis are not required for the local demo configuration. Local development defaults to SQLite and JSON geometry when `USE_GIS=False`.

## Setup

### 1. Enter the project

```powershell
cd C:\Users\seths\OneDrive\Desktop\landslideguard
```

### 2. Configure environment variables

```powershell
Copy-Item .env.example .env
```

For the local demo, use:

```env
DEBUG=True
USE_GIS=False
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_WS_BASE_URL=ws://127.0.0.1:8000
```

For a PostGIS deployment, set `USE_GIS=True` and provide a real `DATABASE_URL`.

### 3. Install backend dependencies

The backend is managed by its own `pyproject.toml`.

```powershell
cd backend
$env:UV_LINK_MODE="copy"
uv sync
uv run python manage.py check
```

`UV_LINK_MODE=copy` is recommended when the project is stored inside OneDrive because package hardlinks can fail there.

### 4. Initialize the local database

```powershell
uv run python manage.py migrate
uv run python manage.py seed_demo
```

The seed command creates deterministic synthetic regions, slope units, observations, risk snapshots, and alerts. Synthetic data is clearly marked and must not be treated as real-world observations.

### 5. Start the backend

```powershell
uv run python manage.py runserver 127.0.0.1:8000
```

Backend URLs:

- Health: `http://127.0.0.1:8000/api/v1/health/`
- OpenAPI schema: `http://127.0.0.1:8000/api/schema/`
- Swagger UI: `http://127.0.0.1:8000/api/schema/swagger-ui/`

### 6. Install and start the frontend

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend URLs:

- Landing page: `http://127.0.0.1:5173/`
- About page: `http://127.0.0.1:5173/about`
- Command console: `http://127.0.0.1:5173/dashboard/console`
- Risk map: `http://127.0.0.1:5173/dashboard/map`

## ML Pipeline

The current implemented model is a scikit-learn **Random Forest Classifier**.

Run the deterministic ML smoke test from the project root:

```powershell
cd C:\Users\seths\OneDrive\Desktop\landslideguard
$env:UV_LINK_MODE="copy"
uv run python src/models/train.py --demo
uv run python src/models/predict.py --demo
uv run python src/models/evaluate.py --demo
```

Real training requires labelled rows in `data/processed/training_dataset.csv` with these columns:

```text
location_id,date,label,elevation,slope,aspect,soil_type,geology,landcover,rainfall_mm
```

The trained artifact is saved to `models/random_forest.pkl`. Prediction output is saved to `data/predictions/current_risk.csv`.

XGBoost and LightGBM are part of the concept roadmap but are not currently used by the implemented training script.

## Project Structure

```text
landslideguard/
├── backend/                 # Django API, domain models, services, tasks
│   ├── config/              # settings, URLs, ASGI, Celery, Channels
│   ├── apps/                # geo, monitoring, risk, exposure, routing,
│   │                         # alerts, explain, simulation, ml
│   ├── management/          # seed_demo command
│   ├── migrations/          # generated app migrations
│   └── tests/               # backend tests
├── frontend/                # React + TypeScript + Vite application
│   └── src/
│       ├── app/             # routes, About page, Dashboard page
│       ├── hero/            # landing hero and live risk ticker
│       ├── lib/             # API and WebSocket clients
│       └── styles/          # landing, console, About, and token styles
├── src/                     # data and ML pipeline
│   ├── data/                # download, clean, and merge scripts
│   ├── features/            # terrain, rainfall, feature engineering
│   ├── models/              # train, predict, evaluate
│   └── utils/               # shared paths and configuration
├── data/                    # raw, processed, and prediction CSV files
├── models/                  # generated ML artifacts
├── notebooks/               # exploration and modelling notebooks
├── config/                  # shared YAML configuration
├── dashboard/               # reserved standalone dashboard entry point
├── pyproject.toml           # root ML/data dependencies
├── .env.example             # environment variable template
└── README.md
```

## API Surface

Implemented API groups include:

- `/api/v1/health/`
- `/api/v1/geo/regions/`
- `/api/v1/geo/slope-units/`
- `/api/v1/geo/historical-landslides/`
- `/api/v1/monitoring/observations/`
- `/api/v1/monitoring/forecast/`
- `/api/v1/risk/summary/`
- `/api/v1/risk/history/`
- `/api/v1/alerts/`
- `/api/v1/exposure/`
- `/api/v1/routes/`
- `/api/v1/simulations/`
- `/api/v1/explain/`

The WebSocket endpoint is `/ws/risk/`. Channels and Celery configuration are present; Redis is required to operate those services fully.

## Work Completed

- [x] Python 3.12 and uv project configuration
- [x] Separate frontend, backend, and ML/data pipeline structure
- [x] Django settings split into base, development, and production
- [x] Local SQLite/JSON fallback for development
- [x] PostGIS configuration path for production
- [x] CORS, REST Framework, JWT, OpenAPI, Channels, and Celery configuration
- [x] Domain models for geography, monitoring, risk, exposure, routing, alerts, simulation, and ML versions
- [x] Generated and applied Django migrations
- [x] Deterministic `seed_demo` management command
- [x] Risk fusion and risk velocity services
- [x] NetworkX route-risk service
- [x] Exposure summary service
- [x] REST API route groups
- [x] WebSocket consumer and Celery task skeletons
- [x] Random Forest ML training pipeline
- [x] ML prediction and evaluation scripts
- [x] React/Vite landing experience
- [x] About page describing SIH26001 and the NER problem
- [x] Command console with live summary polling, risk map, trends, alerts, explainability, simulation, route, and impact summaries
- [x] Responsive command console sections
- [x] Frontend production build verified
- [x] Backend checks, migrations, demo seed, health endpoint, and tests verified

## Remaining Work

- [ ] Replace synthetic demo data with validated real datasets
- [ ] Build data download, cleaning, and merge pipelines for each provider
- [ ] Install and validate PostgreSQL/PostGIS/GDAL in the target deployment environment
- [ ] Connect real geometry layers and map tiles to the frontend
- [ ] Connect live rainfall, soil moisture, forecast, and sensor providers
- [ ] Implement persisted route and exposure APIs with real road and asset geometries
- [ ] Complete model registry integration between Django and generated ML artifacts
- [ ] Add SHAP explanations from compatible trained model artifacts
- [ ] Add XGBoost/LightGBM model comparison and calibration if required
- [ ] Add protected JWT login and role-based permissions for operational users
- [ ] Complete Celery scheduled risk recalculation and alert generation
- [ ] Configure Redis-backed WebSocket broadcasts for production-style updates
- [ ] Expand API, integration, and frontend interaction tests
- [ ] Add deployment, monitoring, backups, and production secrets management

## Validation Commands

Backend:

```powershell
cd backend
$env:UV_LINK_MODE="copy"
uv run python manage.py check
uv run python manage.py migrate
uv run pytest
```

Frontend:

```powershell
cd frontend
npm run build
```

ML:

```powershell
cd ..
$env:UV_LINK_MODE="copy"
uv run python src/models/train.py --demo
uv run python src/models/predict.py --demo
uv run python src/models/evaluate.py --demo
```

## No Docker Requirement

Docker and Docker Compose are intentionally not part of this project. Use native Python, uv, Node.js, PostgreSQL/PostGIS, GDAL, and Redis installations where those services are required.
