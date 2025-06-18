#!/bin/bash
set -e

echo "[INFO] cert-manager pod 상태:"
kubectl get pods -n cert-manager

echo "[INFO] ClusterIssuer 상태:"
kubectl get clusterissuer

echo "[INFO] 전체 인증서 상태:"
kubectl get certificate -A