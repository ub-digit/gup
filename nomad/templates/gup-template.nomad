job "gup" {
  datacenters = ["gubdc1"]
  type = "service"

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

    # TODO: Per stage volumes
    volume "postgres" {
      type = "host"
      read_only = false
      source = "gup-[[.deploy.stage]]-postgres"
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

      env {
        POSTGRES_DB = "[[.env.gup_db]]"
        POSTGRES_USER = "[[.env.gup_db_user]]"
        POSTGRES_PASSWORD = "[[.env.gup_db_password]]"
        PGPORT = "[[.ports.gup_postgres_port]]"
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

    #volume "solr" {
    #  type = "host"
    #  read_only = false
    #  source = "gup-solr-[[.deploy.stage]]"
    #}

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

      env {
        GUP_SOLR_DATA_IMPORT_DB_URL = "jdbc:postgresql://${NOMAD_UPSTREAM_ADDR_gup-postgres-[[.deploy.stage]]}/[[.env.gup_db]]"
        GUP_SOLR_DATA_IMPORT_DB_USER = "[[.env.gup_db_user]]"
        GUP_SOLR_DATA_IMPORT_DB_PASSWORD = "[[.env.gup_db_password]]"
      }

      # Not using volume right now since not sure where to mount
      # Probably something like /opt/solr/server/solr/mycores/gup-guresearch/data etc
      # Will thus need multiple volumes
      #volume_mount {
      #  volume = "solr"
      #  destination = "???"
      #  read_only = false
      #}

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
    count = 1

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

      env {
        EMBER_ENVIRONMENT = "[[.deploy.stage]]"
        GUP_SERVICE_HOSTNAME = "[[.deploy.api_hostname]]"

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

    network {
      mode = "bridge"
      port "api" {
        to = [[.ports.gup_backend_port]]
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

      # GUP_SECRET_KEY_BASE??
      env {
        GUP_ENVIRONMENT = "[[.deploy.stage]]" #TODO: rebuid image and remove
        RAILS_ENV = "[[.deploy.stage]]"
        RAILS_PORT = "[[.ports.gup_backend_port]]"
        GUP_SECRET_KEY_BASE = "[[.env.gup_secret_key_base]]"
        GUP_DB_HOST = "${NOMAD_UPSTREAM_IP_gup-postgres-[[.deploy.stage]]}"
        GUP_DB_PORT = "${NOMAD_UPSTREAM_PORT_gup-postgres-[[.deploy.stage]]}"
        GUP_DB = "[[.env.gup_db]]"
        GUP_DB_USER = "[[.env.gup_db_user]]"
        GUP_DB_PASSWORD = "[[.env.gup_db_password]]"
        GUP_SOLR_HOST = "${NOMAD_UPSTREAM_IP_gup-solr-[[.deploy.stage]]}"
        GUP_SOLR_PORT = "${NOMAD_UPSTREAM_PORT_gup-solr-[[.deploy.stage]]}"
        GUP_TEST_USER_API_KEY = "[[.env.gup_test_user_api_key]]"
        GUP_SCOPUS_API_KEY = "[[.env.gup_scopus_api_key]]"
        GUP_MAIL_SMTP_HOST = "[[.env.gup_mail_smtp_host]]"
        GUP_MAIL_FROM = "[[.env.gup_mail_from]]"
        GUP_MAIL_TO = "[[.env.gup_mail_to]]"
        GUP_PUBLIC_BASE_URL = "${NOMAD_ADDR_api}"
        GUP_REPOSITORY_NAME = "[[.env.gup_repository_name]]"
        GUP_OAI_REPOSITORY_NAME = "[[.env.gup_oai_repository_name]]"
        GUP_OAI_REPOSITORY_URL = "${NOMAD_ADDR_api}/oai"
        GUP_OAI_RECORD_PREFIX = "[[.env.gup_oai_record_prefix]]"
        GUP_MQ_BASE_URL = "[[.env.gup_mq_base_url]]"
        GUP_MQ_API_KEY = "[[.env.gup_mq_api_key]]"
      }

      config {
        image = "docker.ub.gu.se/gup-backend:[[.deploy.git_revision]]"

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
