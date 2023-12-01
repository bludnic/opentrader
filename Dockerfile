FROM node:18-alpine AS base

# The web Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update this Dockerfile, the Dockerfile in the web workspace and copy that over to Dockerfile in the docs.

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
# Set working directory
WORKDIR /app
RUN pnpm add turbo -g
COPY . .
RUN turbo prune --scope=processor --scope=frontend --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# Install pnpm & turbo
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm add turbo -g

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
# Copy Prisma Schema as it is not included in `/json` dir
COPY --from=builder /app/out/full/packages/prisma/src/schema.prisma ./packages/prisma/src/schema.prisma
RUN pnpm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

ARG NEXT_PUBLIC_PROCESSOR_URL
ENV NEXT_PUBLIC_PROCESSOR_URL=$NEXT_PUBLIC_PROCESSOR_URL

ARG NEXT_PUBLIC_PROCESSOR_ENABLE_TRPC
ENV NEXT_PUBLIC_PROCESSOR_ENABLE_TRPC=$NEXT_PUBLIC_PROCESSOR_ENABLE_TRPC

ARG NEXT_PUBLIC_PROCESSOR_ENABLE_TRPC
ENV NEXT_PUBLIC_PROCESSOR_ENABLE_TRPC=$NEXT_PUBLIC_PROCESSOR_ENABLE_TRPC

ARG NEXT_PUBLIC_STATIC
ENV NEXT_PUBLIC_STATIC=$NEXT_PUBLIC_STATIC

ARG ADMIN_PASSWORD
ENV ADMIN_PASSWORD=$ADMIN_PASSWORD

RUN turbo run build

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 expressjs
RUN adduser --system --uid 1001 expressjs
USER expressjs
COPY --from=installer /app/apps/frontend/out ./apps/frontend/out
COPY --from=installer /app/apps/processor ./apps/processor
COPY --from=installer /app/node_modules ./node_modules

WORKDIR /app/apps/processor
CMD node dist/main.js
