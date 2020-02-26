#!/usr/bin/env bash
docker build -t queen-service-nodejs-module .
docker run --env-file .env -it queen-service-nodejs-module
