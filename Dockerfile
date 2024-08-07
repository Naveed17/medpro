FROM wodby/node:20 as dev

COPY --chown=node:node package.json package-lock.json "${APP_ROOT}"/
RUN set -xe; \
  npm ci;

COPY docker/docker-entrypoint-init.d/ /docker-entrypoint-init.d/
COPY --chown=node:node . "${APP_ROOT}/"

EXPOSE 3000
ENV PORT 3000
VOLUME ["$APP_ROOT"]

FROM wodby/node:20 AS builder

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_OPTIONS="--max-old-space-size=8192"

COPY --chown=node:node --from=dev "${APP_ROOT}/node_modules" "${APP_ROOT}/node_modules"
COPY --chown=node:node . "${APP_ROOT}/"

ENV NEXT_SHARP_PATH=${APP_ROOT}/node_modules/sharp

RUN set -xe; \
  npm run build -- --no-lint

COPY --chown=node:node postinstall.cjs  $"{APP_ROOT}"/postinstall.cjs
RUN npm run tinymce

FROM wodby/node:20 AS runner

ENV NODE_ENV production
ENV NEXT_SHARP_PATH=${APP_ROOT}/node_modules/sharp
ENV NEXT_TELEMETRY_DISABLED 1

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=node:node ${APP_ROOT}/public ./public
COPY --from=builder --chown=node:node ${APP_ROOT}/.next/standalone ./
COPY --from=builder --chown=node:node ${APP_ROOT}/.next/static ./.next/static

CMD ["node", "server.js"]
