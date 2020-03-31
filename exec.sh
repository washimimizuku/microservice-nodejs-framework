#!/usr/bin/env bash
docker build -t microservice-nodejs-module .
docker run --env-file .env -it microservice-nodejs-module
