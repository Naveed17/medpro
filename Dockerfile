FROM wodby/node:16 as dev

COPY --chown=node:node package.json package-lock.json "${APP_ROOT}/"
RUN set -xe; \
  npm ci;

COPY docker/docker-entrypoint-init.d/ /docker-entrypoint-init.d/
COPY --chown=node:node . "${APP_ROOT}/"

EXPOSE 3000
ENV PORT 3000
VOLUME ["$APP_ROOT"]

FROM wodby/node:16 AS builder

ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=dev "${APP_ROOT}/node_modules" "${APP_ROOT}/node_modules"
COPY --chown=node:node . "${APP_ROOT}/"

RUN npm run build

FROM wodby/node:16 AS runner

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder ${APP_ROOT}/next.config.js ./
COPY --from=builder ${APP_ROOT}/public ./public
COPY --from=builder ${APP_ROOT}/package.json ./package.json
COPY --from=builder ${APP_ROOT}/package-lock.json ./package-lock.json
COPY docker/docker-entrypoint-init.d/ /docker-entrypoint-init.d/

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=node:nodejs ${APP_ROOT}/.next/standalone ./
# COPY --from=builder --chown=node:nodejs ${APP_ROOT}/.next/static ./.next/static

CMD ["npm", "run", "start"]
