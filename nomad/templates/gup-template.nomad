job "gup" {
  datacenters = ["gubdc1"]
  type = "service"

  vault {
    policies = ["nomad-server"]
    change_mode = "restart"
  }

  update {
    max_parallel = 1
    min_healthy_time = "10s"
    healthy_deadline = "5m"
    progress_deadline = "10m"
    auto_revert = false
    canary = 0
  }

  migrate {
    max_parallel = 1
    health_check = "checks"
    min_healthy_time = "10s"
    healthy_deadline = "5m"
  }

  group "postgres" {
    count = 1

    network {
      mode = "bridge"
    }

    volume "postgres" {
      type = "host"
      read_only = false
      source = "gup-[[.deploy.stage]]-postgres" #-data?
    }

    volume "postgres-initdb" {
      type = "host"
      read_only = true
      source = "gup-[[.deploy.stage]]-postgres-initdb"
    }

    service {
      name = "gup-postgres-[[.deploy.stage]]"
      port = [[.ports.gup_postgres_port]]

      connect {
        sidecar_service{}
      }
    }

    restart {
      attempts = 2
      interval = "30m"
      delay = "15s"
      mode = "fail"
    }

    task "postgres" {
      driver = "docker"

      volume_mount {
        volume = "postgres"
        destination = "/var/lib/postgresql/data"
        read_only = false
      }

      volume_mount {
        volume = "postgres-initdb"
        destination = "/docker-entrypoint-initdb.d"
        read_only = true
      }

      template {
        data = <<EOF
{{with secret "secret/apps/gup/[[.deploy.stage]]"}}
POSTGRES_DB = "{{.Data.data.db_name}}"
POSTGRES_USER = "{{.Data.data.db_user}}"
POSTGRES_PASSWORD = "{{.Data.data.db_password}}"
{{end}}
PGPORT = "[[.ports.gup_postgres_port]]"
EOF
        destination = "secrets/config.env"
        env = true
      }

      config {
        image = "docker.ub.gu.se/gup-postgres:[[.deploy.git_revision]]"
        args = ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]

        auth {
          username = "[[.docker.auth.username]]"
          password = "[[.docker.auth.password]]"
        }
      }

      resources {
        cpu    = 500 # 500 MHz
        memory = 1024 # 1024MB
      }
    }
  }

  group "solr" {
    count = 1

    network {
      mode = "bridge"
      #port "solr" {
      #  static = 8888 #TODO: remove?
      #  to = [[.ports.gup_solr_port]]
      #}
    }

    volume "gup-guresearch-data" {
      type = "host"
      read_only = false
      source = "gup-[[.deploy.stage]]-solr-gup-guresearch-data"
    }

    volume "gup-journals-data" {
      type = "host"
      read_only = false
      source = "gup-[[.deploy.stage]]-solr-gup-journals-data"
    }

    volume "gup-people-data" {
      type = "host"
      read_only = false
      source = "gup-[[.deploy.stage]]-solr-gup-people-data"
    }

    volume "gup-publications-data" {
      type = "host"
      read_only = false
      source = "gup-[[.deploy.stage]]-solr-gup-publications-data"
    }

    service {
      name = "gup-solr-[[.deploy.stage]]"
      port = [[.ports.gup_solr_port]]
      connect {
        sidecar_service {
          proxy {
            upstreams {
              destination_name = "gup-postgres-[[.deploy.stage]]"
              local_bind_port  = [[.ports.gup_postgres_port]]
            }
          }
        }
      }
    }

    task "solr" {
      driver = "docker"

      volume_mount {
        volume = "gup-guresearch-data"
        destination = "/opt/solr/server/solr/mycores/gup-guresearch/data"
        read_only = false
      }

      volume_mount {
        volume = "gup-journals-data"
        destination = "/opt/solr/server/solr/mycores/gup-journals/data"
        read_only = false
      }

      volume_mount {
        volume = "gup-people-data"
        destination = "/opt/solr/server/solr/mycores/gup-people/data"
        read_only = false
      }

      volume_mount {
        volume = "gup-publications-data"
        destination = "/opt/solr/server/solr/mycores/gup-publications/data"
        read_only = false
      }

      template {
        data = <<EOF
{{with secret "secret/apps/gup/[[.deploy.stage]]"}}
GUP_SOLR_DATA_IMPORT_DB_URL = "jdbc:postgresql://${NOMAD_UPSTREAM_ADDR_gup-postgres-[[.deploy.stage]]}/{{.Data.data.db_name}}"
GUP_SOLR_DATA_IMPORT_DB_USER = "{{.Data.data.db_user}}"
GUP_SOLR_DATA_IMPORT_DB_PASSWORD = "{{.Data.data.db_password}}"
{{end}}
EOF
        destination = "secrets/config.env"
        env = true
      }


      config {
        image = "docker.ub.gu.se/gup-solr:[[.deploy.git_revision]]"

        auth {
          username = "[[.docker.auth.username]]"
          password = "[[.docker.auth.password]]"
        }
      }

      resources {
        cpu    = 500 # 500 MHz
        memory = 1024 # 1024MB
      }
    }
  }

  group "frontend" {
    count = 2

    network {
      mode = "bridge"
      port "frontend" {
        to = [[.ports.gup_frontend_port]]
      }
    }

    service {
      name = "gup-frontend-[[.deploy.stage]]"

      port = "frontend"

      tags = ["haproxy"]

      meta {
        hostname = "[[.deploy.frontend_hostname]]"
      }
    }

    task "frontend" {
      driver = "docker"

      # TODO: Could use env instead of template?
      template {
        data = <<EOF
EMBER_ENVIRONMENT = "[[.deploy.stage]]"
GUP_SERVICE_HOSTNAME = "[[.deploy.api_hostname]]"
EOF
        destination = "secrets/config.env"
        env = true
      }

      config {
        image = "docker.ub.gu.se/gup-frontend:[[.deploy.git_revision]]"

        auth {
          username = "[[.docker.auth.username]]"
          password = "[[.docker.auth.password]]"
        }
      }

      resources {
        cpu    = 500 # 500 MHz
        memory = 256 # 256MB
      }
    }
  }

  group "backend" {
    count = 1

    volume "uploads" {
      type = "host"
      read_only = false
      source = "gup-[[.deploy.stage]]-backend-uploads"
    }

    network {
      mode = "bridge"
      port "api" {
        to = [[.ports.gup_rails_port]]
      }
    }

    service {
      name = "gup-api-[[.deploy.stage]]"
      port = "api" # Need to prefix with service name and stage, think this might be global?

      tags = ["haproxy"]

      meta {
        hostname = "[[.deploy.api_hostname]]"
      }

      connect {
        sidecar_service {
          tags = ["sidecar-proxy"]
          proxy {
            upstreams {
              destination_name = "gup-postgres-[[.deploy.stage]]"
              local_bind_port  = [[.ports.gup_postgres_port]]
            }
            upstreams {
              destination_name = "gup-solr-[[.deploy.stage]]"
              local_bind_port  = [[.ports.gup_solr_port]] # TODO: verify this is sent and applied to backend through env
            }
          }
        }
      }
      #check {
      #  expose = true
      #  type = "http"
      #  name = "gup-api-health"
      #  path = "/"
      #  interval= "10s"
      #  timeout = "2s"
      #}
    }

    task "api" {
      driver = "docker"

      volume_mount {
        volume = "uploads"
        destination = "/opt/gup-uploads"
        read_only = false
      }

      template {
        data = <<EOF
RAILS_ENV = "[[.deploy.stage]]"
RAILS_PORT = "[[.ports.gup_rails_port]]"
{{with secret "secret/apps/gup/[[.deploy.stage]]"}}
GUP_SECRET_KEY_BASE = "{{.Data.data.secret_key_base}}"
GUP_DB_HOST = "${NOMAD_UPSTREAM_IP_gup-postgres-[[.deploy.stage]]}"
GUP_DB_PORT = "${NOMAD_UPSTREAM_PORT_gup-postgres-[[.deploy.stage]]}"
GUP_DB = "{{.Data.data.db_name}}"
GUP_DB_USER = "{{.Data.data.db_user}}"
GUP_DB_PASSWORD = "{{.Data.data.db_password}}"
GUP_SOLR_HOST = "${NOMAD_UPSTREAM_IP_gup-solr-[[.deploy.stage]]}"
GUP_SOLR_PORT = "${NOMAD_UPSTREAM_PORT_gup-solr-[[.deploy.stage]]}"
GUP_TEST_USER_API_KEY = "{{.Data.data.test_user_api_key}}"
GUP_SCOPUS_API_KEY = "{{.Data.data.scopus_api_key}}"
GUP_MAIL_SMTP_HOST = "{{.Data.data.mail_smtp_host}}"
GUP_MAIL_FROM = "{{.Data.data.mail_from}}"
GUP_MAIL_TO = "{{.Data.data.mail_to}}"
GUP_PUBLIC_BASE_URL = "${NOMAD_ADDR_api}"
GUP_REPOSITORY_NAME = "{{.Data.data.repository_name}}"
GUP_OAI_REPOSITORY_NAME = "{{.Data.data.oai_repository_name}}"
GUP_OAI_REPOSITORY_URL = "${NOMAD_ADDR_api}/oai"
GUP_OAI_RECORD_PREFIX = "{{.Data.data.oai_record_prefix}}"
GUP_MQ_BASE_URL = "{{.Data.data.mq_base_url}}"
GUP_MQ_API_KEY = "{{.Data.data.mq_api_key}}"
{{end}}
EOF
        destination = "secrets/config.env"
        env = true
      }

      config {
        image = "docker.ub.gu.se/gup-backend:[[.deploy.git_revision]]"
        args = ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]

        auth {
          username = "[[.docker.auth.username]]"
          password = "[[.docker.auth.password]]"
        }
      }

      resources {
        cpu    = 500 # 500 MHz
        memory = 512 # 512MB
      }
    }
  }
}
