#! /bin/bash

sops -d --input-type dotenv --output-type dotenv skaffold/${ENVIRONMENT}/.env.secrets > .env.dec

set -a

source .env.dec

set +a

envsubst < .env.local.dist  > .env