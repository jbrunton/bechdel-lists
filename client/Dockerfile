FROM node:alpine as builder
WORKDIR '/app'
# TODO: use docker-compose to build and remove this
ENV VUE_APP_GOOGLE_CLIENT_ID=729453438306-js80sgkqlrnot0elppoe7fblb51lkjv5.apps.googleusercontent.com
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
EXPOSE 5001
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
