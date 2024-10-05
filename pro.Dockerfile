# PRO version of OpenTrader
# You must have access to the private repository to build this image
# https://github.com/bludnic/opentrader-pro
FROM node:20-alpine AS base

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat git
RUN apk update
# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
# Set working directory
WORKDIR /app
RUN pnpm add @moonrepo/cli -g
COPY . .

# Install opentrader-pro git submodule
# Configure Git to use the token for GitHub
ARG GITHUB_TOKEN
RUN git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"
RUN rm -rf pro
RUN git clone https://github.com/bludnic/opentrader-pro.git pro

RUN moon docker scaffold processor frontend
# Install toolchain and dependencies
RUN moon docker setup

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# Install pnpm & moonrepo
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm add @moonrepo/cli -g

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/.moon/docker/workspace .
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch
# The param --lockfile is required to write pro module dependencies to pnpm-lock.yaml
# This overrides the param from .npmrc
RUN pnpm install --prefer-offline --lockfile

# ENV vars
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

ARG NEXT_PUBLIC_PROCESSOR_URL
ENV NEXT_PUBLIC_PROCESSOR_URL=$NEXT_PUBLIC_PROCESSOR_URL

ARG NEXT_PUBLIC_PROCESSOR_ENABLE_TRPC
ENV NEXT_PUBLIC_PROCESSOR_ENABLE_TRPC=$NEXT_PUBLIC_PROCESSOR_ENABLE_TRPC

ARG NEXT_PUBLIC_STATIC
ENV NEXT_PUBLIC_STATIC=$NEXT_PUBLIC_STATIC

ARG ADMIN_PASSWORD
ENV ADMIN_PASSWORD=$ADMIN_PASSWORD

RUN moon run :build

FROM base AS optimizer
# Intall only production deps

RUN apk add --no-cache libc6-compat
RUN apk update
# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY --from=installer /app/pro/frontend/dist ./pro/frontend/dist
COPY --from=installer /app/pro/processor ./pro/processor
COPY --from=installer /app/package.json ./package.json
COPY --from=installer /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=installer /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=installer /app/packages ./packages
COPY --from=installer /app/.npmrc ./.npmrc

RUN pnpm i --prod


FROM base AS runner
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.

# Cannot create DB file when running Prisma migrations
# due lack of permissions when running as non-root user
# RUN addgroup --system --gid 1001 expressjs
# RUN adduser --system --uid 1001 expressjs
# USER expressjs

WORKDIR /app

COPY --from=optimizer /app/pro/frontend/dist ./pro/frontend/dist
COPY --from=optimizer /app/pro/processor ./pro/processor
COPY --from=optimizer /app/node_modules ./node_modules

# Copy Prisma schema, migrations, and seed script
COPY --from=optimizer /app/packages/prisma/src/schema.prisma ./packages/prisma/src/schema.prisma
COPY --from=optimizer /app/packages/prisma/src/migrations ./packages/prisma/src/migrations
COPY --from=optimizer /app/packages/prisma/seed.mjs ./packages/prisma/seed.mjs

# Copy the entrypoint script to run migrations before starting the app
COPY bin/docker-entry.sh /app/bin/docker-entry.sh
ENTRYPOINT ["/app/bin/docker-entry.sh"]

WORKDIR /app/pro/processor
CMD node dist/main.mjs
