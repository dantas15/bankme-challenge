FROM node:20-slim AS base

# Install openssl for Prisma
RUN apt-get update -y && apt-get install -y openssl 

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN mkdir -p /prod/server

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm --filter server deploy --prod /prod/server

FROM base AS server

COPY --from=build /prod/server /prod/server
WORKDIR /prod/server
# From: https://pnpm.io/package_json#dependenciesmetainjected
# For simple use cases, it can be accomplished by invoking pnpm install again
RUN pnpm install
RUN pnpm build
EXPOSE 8080
CMD [ "pnpm", "start:prod" ]
