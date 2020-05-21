unless Rails.env == "test"
  require 'prometheus/middleware/collector'
  require 'prometheus/middleware/exporter'

  Rails.application.middleware.unshift Prometheus::Middleware::Exporter
  Rails.application.middleware.unshift Prometheus::Middleware::Collector
end
