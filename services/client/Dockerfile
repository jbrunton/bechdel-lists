FROM node:alpine as builder
WORKDIR '/app'

ARG google_client_id
ENV VUE_APP_GOOGLE_CLIENT_ID=$google_client_id
ARG build_version
ENV VUE_APP_BUILD_VERSION=$build_version

COPY ./package.json ./
RUN npm install --no-optional
COPY . .
RUN npm run build

FROM nginx
EXPOSE 5001
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
