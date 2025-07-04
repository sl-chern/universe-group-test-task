FROM node:lts-alpine AS builder
WORKDIR /app
RUN npm install turbo --global 
COPY . .
ARG PACKAGE_NAME
RUN turbo prune --scope=${PACKAGE_NAME} --docker

FROM node:lts-alpine AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package*.json .
COPY --from=builder /app/turbo.json ./turbo.json
RUN npm install 

FROM node:lts-alpine AS sourcer
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=builder /app/out/full/ .
COPY .gitignore .gitignore

FROM node:lts-alpine AS runner
WORKDIR /app
COPY --from=sourcer /app/ .
ARG PACKAGE_NAME
WORKDIR /app/apps/${PACKAGE_NAME}
CMD ["npm", "run", "start:dev"]
