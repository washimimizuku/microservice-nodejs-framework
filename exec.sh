#!/usr/bin/env bash
docker build -t queen-logs .
docker run --env-file .env -it queen-logs
