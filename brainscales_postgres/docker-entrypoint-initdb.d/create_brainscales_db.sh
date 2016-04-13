#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER brainscales WITH PASSWORD 'pwd_brainscales_5f6f3d';
    CREATE ROLE root SUPERUSER;
    CREATE ROLE brainscales SUPERUSER;
    GRANT ROOT TO brainscales;
    ALTER ROLE brainscales WITH LOGIN;

    CREATE DATABASE brainscales_db;
    GRANT ALL PRIVILEGES ON DATABASE brainscales_db TO root;
    GRANT ALL PRIVILEGES ON DATABASE brainscales_db TO brainscales;
EOSQL
