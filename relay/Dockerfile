FROM node:22-bookworm-slim AS node-security

# The patched version tags currently have empty OCI indexes. Install the
# official release tarball into a compatible Node 22 glibc image instead.
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl xz-utils \
    && case "$(dpkg --print-architecture)" in \
      arm64) arch=arm64; sha=6287aa46b6c375d816e63ae66d024fbbfd70404825aabdfdf898a970871d2f4b ;; \
      amd64) arch=x64; sha=1805bcd35e6815559bd2eb97db438d3fdb0eb3a5e6a977b7c1badca76337e9ce ;; \
      *) exit 1 ;; \
    esac \
    && curl --fail --show-error --location "https://nodejs.org/dist/v22.23.4/node-v22.23.4-linux-${arch}.tar.xz" -o /tmp/node.tar.xz \
    && echo "${sha}  /tmp/node.tar.xz" | sha256sum --check --strict \
    && tar -xJf /tmp/node.tar.xz -C /usr/local --strip-components=1 \
    && test "$(node --version)" = v22.23.4 \
    && rm -rf /var/lib/apt/lists/* /tmp/node.tar.xz

FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM deps AS production-deps
RUN rm -rf node_modules && bun install --frozen-lockfile --production

FROM node-security AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node-security AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001
COPY --from=build /app/package.json ./
COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD node -e "const port = process.env.PORT || 3001; fetch(`http://127.0.0.1:${port}/health`).then((res) => process.exit(res.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node", "dist/index.js"]
