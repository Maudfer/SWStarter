### QuickStart with Docker (more details further below):

```bash
npm run dev
```

Default addresses:
```bash
Web app - http://localhost:3000/
REST API - http://localhost:4000/
Stats - http://localhost:4000/stats
```
Please give it a second the first time you click each button/link in dev mode! NextJS takes some navigating to build cache.

# SWStarter Exercise - Mauricio Fernandes

This repository contains a small web application split into a Next.js
frontend and a Fastify based API server. Both services are packaged with
Docker and can be started together via Compose.

The Dockerfiles run the test suites when built, so failing tests will stop the
image from being created. The frontend uses Jest as well and behaves the same
way.

# Notes to reviewer

Hey there! I decided to keep the Node API as a separate service because it makes
the data layer easier to maintain and keeps the frontend lightweight. Redis is
used both for caching and as a simple job queue so we can recompute search stats
without blocking requests. Everything is packaged with Docker Compose for
simplicity—one command brings the stack up or runs the tests. I tried to keep
the implementation straightforward so it's easy to extend.

I briefly considered rolling the API into the Next.js app to keep the stack as
compact as possible. It certainly would have reduced the number of containers
to juggle, but I worried the boundaries between rendering logic and data logic
would get muddied. Keeping them separate felt a bit cleaner even if it meant a
touch more setup upfront.

Splitting things now also leaves room to scale each service on its own if this
ever grows beyond a toy project. The trade‑off is a little extra moving pieces
during development, though Compose smooths most of that over. In the end the
pros of clarity and flexibility outweighed the added complexity for me.

Using Redis at this stage might seem heavy, but I didn't want to keep hitting the 
public API without need, and it let me play with background jobs and caching without 
committing to a full database. If we swap it for something else later the rest of the 
code won't need much adjusting, which felt like a good compromise.

## Project Structure

- `frontend/` – Next.js application
- `backend/` – Fastify API server and background worker

## Development

Use the helper scripts defined in the root `package.json`:

```bash
# install dependencies for both services
npm run install

# build and run all containers
npm run dev
```

The frontend will be available on [http://localhost:3000](http://localhost:3000)
and the backend on [http://localhost:4000](http://localhost:4000).

## Production build

Each service contains its own `Dockerfile` for production images and the
Compose file builds them automatically. Redis support can be enabled by running
Compose with the `with-redis` profile:

```bash
docker-compose --profile with-redis up --build
```


The backend exposes `/stats` which returns information about past search
queries. Statistics are recomputed every five minutes by a worker service using
a Redis backed job queue.

