# Bilal Motors — DevOps Project

A full-stack vehicle management system built with a **Node.js/Express backend**
and a **React/Vite frontend**. The application uses **MongoDB Atlas** for data storage
and **Cloudinary** for image hosting. The entire system is containerized with **Docker**
and deployed on **Kubernetes using Helm charts**, following DevOps and GitOps best practices.

---

## Architecture

Frontend (React / Vite)
→ Backend API (Node.js / Express)
→ MongoDB Atlas

Image uploads are handled via Cloudinary.

The application is deployed on Kubernetes and managed using Helm.
GitOps workflows are supported using Argo CD.
Monitoring resources are prepared using Prometheus.

---

## Tech Stack

**Frontend**
- React
- Vite

**Backend**
- Node.js
- Express

**Database**
- MongoDB Atlas

**Media Storage**
- Cloudinary

**DevOps / Infrastructure**
- Docker
- Kubernetes
- Helm
- Argo CD
- Prometheus

---

## Repository Structure

- `frontend/` – React + Vite frontend application  
- `backend/` – Node.js + Express backend API  
- `charts/` – Helm charts for Kubernetes deployment  
- `argocd/` – Argo CD GitOps application manifests  
- `prometheus/` – Monitoring configuration and manifests  
- `Completed.txt` – Progress tracking notes  
- `Project structure.txt` – Project planning notes  

---

## Local Development

### Prerequisites
- Node.js (LTS recommended)
- npm
- MongoDB Atlas account
- Cloudinary account

### Run Frontend
```bash
cd frontend
npm install
npm run dev
```

### Run Backend
```bash
cd backend
npm install
nodemon index.js
```

Make sure environment variables are configured before running.

---

## Kubernetes Deployment (Helm)

### Prerequisites
- Kubernetes cluster (Minikube / k3s / Docker Desktop)
- kubectl
- helm

### Example Deployment
```bash
helm upgrade --install backend-release ./charts/backend-chart
helm upgrade --install frontend-release ./charts/frontend
```

### Port Forwarding
```bash
kubectl -n default port-forward svc/backend-release-backend-chart 8000:8000
kubectl -n default port-forward svc/frontend-release-frontend 3000:80
```

### Access URLs
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

---

## GitOps (Argo CD)

Argo CD manifests are located in the `argocd/` directory.

Typical workflow:
1. Install Argo CD in the cluster
2. Apply Application manifests from `argocd/`
3. Argo CD automatically syncs Helm charts from this repository

---

## Monitoring (Prometheus)

Monitoring configuration is stored under the `prometheus/` directory.
Prometheus can be used to scrape backend metrics and visualize them
using Grafana dashboards.

---

## Configuration

### Backend Environment Variables
- `MONGODB_URI`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `PORT`

### Frontend Environment Variables
- `VITE_API_URL`

**Important:**  
Never commit real secrets to Git.
Use `.env` files locally and Kubernetes Secrets in production.

---

## Troubleshooting

**Frontend loads but API fails**
- Check `VITE_API_URL`
- Verify backend service is reachable

**Pods not ready**
- `kubectl describe pod <pod-name>`
- `kubectl logs <pod-name>`

**MongoDB connection errors**
- Check Atlas IP allowlist
- Verify connection string

---

## Roadmap

Planned DevOps Improvements:
- Kubernetes Deployments and ReplicaSets
- Horizontal Pod Autoscaler (HPA)
- ConfigMaps and Secrets
- Kubernetes CronJobs
- Liveness and Readiness Probes

---

## License

License not yet defined.
Add a LICENSE file (MIT / Apache-2.0 recommended).
