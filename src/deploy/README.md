# Oracle Cloud Deployment Guide

This repo runs on Oracle Cloud with the existing `docker compose + nginx + jeju-spring` container path.

The current operator flow is:

- build the app container from `jeju-spring/Dockerfile`
- expose traffic through `nginx`
- keep shared runtime config on the host at `/opt/jejugroup/.env`
- keep uploads on the host at `/uploads`
- keep MySQL data in the Docker named volume `jejugroup_mysql_data`

Do not put secrets in the repo. Host-only values stay on the VM.

## Host Prerequisites

- Oracle Cloud Compute instance
- Ubuntu or another Linux distribution with Docker support
- Docker Engine
- Docker Compose v2
- inbound TCP 80 allowed
- SSH access to the host

## Directory Layout

Use this layout on the VM:

```text
/opt/jejugroup/
  .env
  docker-src/
/uploads/
```

- `/opt/jejugroup/docker-src` is the repository checkout.
- Run `docker compose` commands from `/opt/jejugroup/docker-src`.
- `/opt/jejugroup/.env` holds host-only runtime config.
- `/uploads` holds persistent uploaded files.

## Environment File

Keep two env layers separate:

### Remote runtime env

Create `/opt/jejugroup/.env` on the host. Do not commit it. This file is for app/mysql runtime only.

```env
JEJU_SHARED_ENV_PATH=/opt/jejugroup/.env
DB_URL=jdbc:mysql://mysql:3306/jejugroup_db?characterEncoding=UTF-8&serverTimezone=Asia/Seoul&useSSL=false&allowPublicKeyRetrieval=true
DB_USER=jejugroup
DB_PASSWORD=change-me
MYSQL_DATABASE=jejugroup_db
MYSQL_USER=jejugroup
MYSQL_PASSWORD=change-me
MYSQL_ROOT_PASSWORD=change-me-too
```

### Local deploy env

Use a separate local file or shell env for `pnpm run deploy` and `node scripts/pipelines/deploy-oci.js`.

- `OCI_PUBLIC_HEALTH_URL`
- `OCI_SSH_HOST`
- `OCI_SSH_USER`
- `OCI_SSH_KEY_PATH` or `OCI_SSH_PASSWORD`

See `deploy/.env.oci.example` for a minimal local example.

Rules:

- keep secrets out of git
- keep `/opt/jejugroup/.env` on the host only
- use only one SSH credential method: key path or password
- keep `JEJU_SHARED_ENV_PATH` pointed at `/opt/jejugroup/.env`
- keep upload paths rooted at `/uploads`

## First Startup

1. Check out the repo into `/opt/jejugroup/docker-src`.
2. Create `/opt/jejugroup/.env`.
3. Create `/uploads`.
4. From the repo root, start the stack:

```bash
docker compose up -d --build
```

The compose file brings services up in this order:

- `mysql`
- `app` after MySQL health is ready
- `nginx` after `app` is started

## Health Check

After startup, verify the stack with:

```bash
docker compose ps
curl -fsS http://127.0.0.1/actuator/health
```

If the VM has a public IP exposed, the same endpoint should also work on the public address:

```bash
curl -fsS http://<public-ip>/actuator/health
```

Healthy responses should report `UP`.

## Restart and Update Flow

### App code changed

Rebuild the app image and restart the app plus nginx:

```bash
docker compose build app
docker compose up -d --no-deps app nginx
```

### nginx config changed

Restart nginx only:

```bash
docker compose restart nginx
```

### Environment file changed

Update `/opt/jejugroup/.env`, then restart the services that consume it:

```bash
docker compose up -d mysql
docker compose up -d --no-deps app nginx
```

### Full redeploy

Pull the latest repo state and rebuild:

```bash
git pull --ff-only
docker compose up -d --build
```

## Rollback Notes

- For an app or nginx regression, roll the repo back to the previous known-good commit and run `docker compose up -d --build` again.
- For a database regression, restore the last known-good dump before bringing the app back online.
- `docker compose down` does not remove the named volume `jejugroup_mysql_data`.
- `/uploads` survives container recreation, so app-only rollbacks usually keep uploaded files intact.

## Security Notes

- Do not commit secrets, tokens, keys, or passwords.
- Keep `.env` on the host and only use example values in the repo.
- Do not publish private key material in operator docs.
- Expose only the nginx and app-backed runtime paths needed for the site.
