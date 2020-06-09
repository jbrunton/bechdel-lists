FROM ruby:2.6.3 as base
WORKDIR "/app"
COPY ./Gemfile* ./
RUN gem install bundler -v 2.1.4
RUN bundle install
COPY . .
CMD bash -c "rm -f /app/tmp/pids/server.pid && bundle exec rails s -b '0.0.0.0'"

FROM base as dev

FROM base as prod
