# Quillium Omni Relay

Native WebSocket relay server for Quillium Omni real-time collaboration. It uses Yjs for sync, keeps active rooms in memory, authenticates document access through Supabase, and persists Yjs updates/snapshots back to Supabase.

## Current Constraints

- Run this as a long-lived process. It is not a Vercel Function/SvelteKit route.
- Run one instance for now. Live rooms are process-local, and guest access depends on the owner being connected to that same process.
- Scale-out needs a new room routing/presence design, such as Redis-backed presence, sticky room routing, or a Durable Object-style room coordinator.

## Local Development

```sh
bun install
cp .env.example .env
bun run dev
```

Health check:

```sh
curl http://localhost:3001/health
```

WebSocket URL shape:

```text
wss://quillium.bryanhu.com/relay/<documentId>?auth=<supabase-access-token>
```

Passing auth in the query string works with browser WebSockets, but it can show up in proxy/access logs. Before wider production use, prefer a short-lived relay token minted for a specific document and session.

## Environment

| Name | Required | Default | Notes |
| --- | --- | --- | --- |
| `SUPABASE_URL` | Yes | none | Supabase project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | none | Service-role key. Keep server-only. |
| `PORT` | No | `3001` | Render/Fly/AWS will usually inject this. |
| `HOST` | No | `0.0.0.0` | Must be `0.0.0.0` on most hosts. |
| `ALLOWED_ORIGINS` | Production | unset | Comma-separated browser origins allowed to connect. If unset, origin checks are disabled. |
| `LOG_LEVEL` | No | `info` | `error`, `warn`, `info`, or `debug`. Use `warn` in quiet production and `debug` for protocol troubleshooting. |
| `PERSIST_DEBOUNCE_MS` | No | `500` | Batches high-frequency Yjs update writes to Supabase. |

Example production origins:

```text
ALLOWED_ORIGINS=https://quillium.ai,https://quillium.bryanhu.com,tauri://localhost
```

## Render Deployment

Render is the easiest first production path.

1. Create a Web Service from this repo.
2. Set the root directory to `relay`.
3. Use either native Bun/Node commands or the Dockerfile.
4. Set the health check path to `/health`.
5. Add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ALLOWED_ORIGINS`, and `LOG_LEVEL=warn`.
6. Keep the service at one instance.
7. Add a custom domain/path such as `quillium.bryanhu.com/relay`.

Native commands:

```sh
bun install --frozen-lockfile
bun run build
bun dist/index.js
```

Render-specific notes:

- Render Web Services support WebSocket connections.
- Render requires binding to `0.0.0.0` and the injected `PORT`.
- Do not horizontally scale this relay yet; reconnects are not guaranteed to land on the same instance.

Docs: [Render Web Services](https://render.com/docs/web-services), [Render WebSockets](https://render.com/docs/websocket), [Render Pricing](https://render.com/pricing).

## Docker

Build from the `relay` directory:

```sh
docker build -t quillium-relay .
docker run --env-file .env -p 3001:3001 quillium-relay
```

The image builds TypeScript in one stage, installs production dependencies in the runtime stage, exposes port `3001`, and includes a `/health` health check.

## Cost Breakdown

Prices move, so treat this as a decision guide rather than accounting. Last checked: April 23, 2026.

| Option | Likely minimum | Best reason to choose it | Catch |
| --- | ---: | --- | --- |
| Existing self-hosted box | $0 incremental | Cheapest cash cost if you already have reliable hardware and internet. | You own uptime, security updates, backups, TLS, monitoring, router/firewall, and power/network outages. |
| Cheap VPS/self-hosted cloud | ~$4-6/mo | Cheapest sane public deployment. Hetzner and DigitalOcean-style VPSes are simple with Docker + Caddy. | More ops work than Render/Fly. You patch the host. |
| AWS Lightsail | $3.50-5/mo | Cheapest AWS-branded path with predictable billing. | Less polished deploy workflow; IPv4 costs more than IPv6-only. |
| Fly.io | ~$3.32/mo for 512 MB shared CPU in some regions | Cheapest managed-ish WebSocket host; Docker-native; good for long-running processes. | More infra decisions than Render. Watch region/egress/volume choices. |
| Render | $7/mo starter | Easiest: Git deploys, logs, custom domain, TLS, health checks, WebSocket support. | Costs a little more; scaling still needs relay architecture changes. |
| AWS App Runner/ECS | Usually $20+/mo for always-on comfort | Fits teams already deep in AWS. | Not the cheapest for this; App Runner’s always-provisioned examples land much higher than tiny VPS/Fly/Render. |

My cost-first recommendation:

1. If you want least money and can tolerate ops: use an existing VPS/home server or a cheap VPS with Docker + Caddy.
2. If you want cheap without much server babysitting: use Fly.io, one Machine, 512 MB or 1 GB.
3. If you want the least deployment friction: use Render Starter at one instance.
4. Use AWS only if Quillium infrastructure is already standardizing there. For lowest AWS cost, prefer Lightsail over App Runner/ECS.

Sources: [Fly.io pricing](https://fly.io/docs/about/pricing/), [AWS Lightsail pricing](https://aws.amazon.com/lightsail/pricing/), [AWS App Runner pricing](https://aws.amazon.com/apprunner/pricing/), [Hetzner Cloud pricing](https://www.hetzner.com/cloud/private-cloud/?country=us), [DigitalOcean Droplet pricing](https://www.digitalocean.com/pricing/droplets).

## Pre-Launch Checklist

- [ ] Apply the Supabase tables for `sync_documents`, `yjs_documents`, and `yjs_updates`.
- [ ] Set `ALLOWED_ORIGINS` for production domains.
- [ ] Set `LOG_LEVEL=warn` unless actively debugging.
- [ ] Confirm `/health` returns `status: "ok"`.
- [ ] Test owner connect, guest connect, owner disconnect, guest reconnect rejection, and owner reconnect.
- [ ] Confirm deploy shutdown sends `SIGTERM` and leaves enough time for pending update flush.
- [ ] Replace query-string auth with short-lived document-scoped relay tokens before broad beta traffic.
