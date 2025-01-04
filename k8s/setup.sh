#!/bin/sh

# Create the configmaps
kubectl create configmap frontend-env --from-env-file=frontend.env
kubectl create configmap backend-env --from-env-file=backend.env
kubectl create configmap db-env --from-env-file=db.env

kubectl apply -f 01-db-stateful.yaml
kubectl apply -f 02-db-job.yaml
kubectl apply -f 03-db-service.yaml

kubectl wait --for=condition=complete --timeout=3600s job/db-job

kubectl apply -f 04-backend-deployment.yaml
kubectl apply -f 05-backend-service.yaml

kubectl apply -f 06-frontend-deployment.yaml
kubectl apply -f 07-frontend-service.yaml

kubectl apply -f 08-ingress.yaml

kubectl apply -f 09-cronjob.yaml
