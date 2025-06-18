#!/bin/bash
set -e

# cert-manager 설치
kubectl create namespace cert-manager || true
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --version v1.14.2 \
  --set installCRDs=true || true

# ClusterIssuer 생성
echo "[INFO] letsencrypt-prod.yaml 적용"
kubectl apply -f "$(cd "$(dirname "$0")/.." && pwd)/letsencrypt-prod.yaml"
#kubectl apply -f ./letsencrypt-prod.yaml

# 상태 점검
echo "[INFO] cert-manager pod 상태:"
kubectl get pods -n cert-manager

echo "[INFO] ClusterIssuer 상태:"
kubectl get clusterissuer