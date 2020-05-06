FROM nginx

ARG listen_env
RUN test -n "${listen_env}"
RUN echo "listen_env=${listen_env}"

COPY ./listen.${listen_env}.conf /etc/nginx/listen.conf
COPY ./default.conf /etc/nginx/conf.d/default.conf
