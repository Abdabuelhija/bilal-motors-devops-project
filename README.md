# Bilal Motors — Full DevOps Project

A full-stack **car lot / vehicle management** system with a **Node.js/Express backend** and a **React (Vite) frontend**.
The project is production-oriented: **Dockerized**, deployable on **Kubernetes via Helm**, GitOps-ready with **Argo CD**, and observable with **Prometheus + Grafana**.

---

## Architecture

- **Frontend** (React + Vite) → serves UI via NGINX
- **Backend API** (Node.js + Express) → REST API + `/metrics` for Prometheus
- **Database** (MongoDB) → local MongoDB for development or MongoDB Atlas in production

---

## Tech Stack

- **Frontend:** React, Vite, NGINX
- **Backend:** Node.js, Express
- **DB:** MongoDB (local or Atlas)
- **DevOps:** Docker, Kubernetes, Helm, Argo CD
- **Observability:** Prometheus, Grafana
- **CI:** GitHub Actions

---

## Repository Structure

- `frontend/` – React + Vite frontend
- `backend/` – Node.js + Express backend
- `charts/` – Helm charts (`backend-chart`, `frontend-chart`)
- `argocd/` – Argo CD Application manifests
- `prometheus/` – ServiceMonitors (Prometheus Operator)
- `grafana/` – Dashboards + Kubernetes ConfigMaps for provisioning

---

## Quick Start (Local with Docker Compose)

> This is the fastest way to run the project end-to-end.

### Prerequisites
- Docker + Docker Compose

### Run
```bash
# from repo root
 docker compose up --build
```

### URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Backend metrics: http://localhost:8000/metrics

---

## Local Development (without Docker)

### Prerequisites
- Node.js (LTS recommended)
- npm
- MongoDB (local) **or** MongoDB Atlas

### Backend
1. Copy env template:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Edit `backend/.env` and set **either** `MONGODB_URI` (recommended) **or** Atlas parts.
3. Run:
   ```bash
   cd backend
   npm install
   node index.js
   ```

### Frontend
1. Copy env template:
   ```bash
   cp frontend/.env.example frontend/.env
   ```
2. Run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## Kubernetes Deployment (Helm)

### Prerequisites
- A Kubernetes cluster (Minikube / k3s / Docker Desktop)
- `kubectl`
- `helm`

### Deploy Backend + Frontend
```bash
helm upgrade --install backend ./charts/backend-chart
helm upgrade --install frontend ./charts/frontend-chart
```

### Access (port-forward)
```bash
kubectl port-forward svc/backend-backend-chart 8000:8000
kubectl port-forward svc/frontend-frontend 3000:80
```

Then open:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

---

## Monitoring (Prometheus + Grafana)

### 1) Install kube-prometheus-stack
Example (Helm release name **monitoring** in namespace **monitoring**):
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
kubectl create namespace monitoring || true
helm upgrade --install monitoring prometheus-community/kube-prometheus-stack -n monitoring
```

### 2) Scrape backend metrics
Apply the ServiceMonitor:
```bash
kubectl apply -f prometheus/backend-servicemonitor.yaml
```

> ⚠️ The ServiceMonitor selector expects the backend Service label `app: backend-backend-chart`.
> If you install the backend with a different Helm release name, adjust the selector in `prometheus/backend-servicemonitor.yaml`.

### 3) Provision Grafana datasource + dashboards (auto-import)
```bash
kubectl apply -f grafana/k8s/grafana-datasource.yaml
kubectl apply -f grafana/k8s/grafana-dashboards.yaml
```

### 4) Open Grafana
```bash
kubectl -n monitoring port-forward svc/monitoring-grafana 3001:80
```
- Grafana: http://localhost:3001

Get admin password (kube-prometheus-stack default secret):
```bash
kubectl -n monitoring get secret monitoring-grafana -o jsonpath='{.data.admin-password}' | base64 -d && echo
```

---

## GitOps (Argo CD)

Argo CD manifests are in `argocd/`.
Typical flow:
1. Install Argo CD in your cluster
2. Apply the `argocd/*.yaml` Applications
3. Argo CD syncs Helm charts from this repo

---

## CI (GitHub Actions)

Workflow location:
- `.github/workflows/ci.yml`

What it does:
- Installs dependencies for frontend/backend
- Runs `npm test --if-present` / `npm run build --if-present`
- Builds Docker images
- Lints & templates Helm charts

---
