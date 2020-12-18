[[ if .periodic | parseBool ]]
job "gup-[[.service]]-periodic" {
  periodic {
    cron = "[[.cron]]"
    prohibit_overlap = true
  }
[[ else ]]
job "gup-[[.service]]-[[ timeNow ]]" {
[[ end ]]

  datacenters = ["gubdc1"]
  type = "batch"

  vault {
    policies = ["nomad-server"]
    change_mode = "restart"
  }

  group "[[.service]]" {
    count = 1

    network {
      mode = "bridge"
    }

    service {
      name = "gup-[[.service]]-[[.deploy.stage]]"

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
    }

    task "[[.service]]"  {
      driver = "docker"

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
        entrypoint = [] # Reset entrypoint
        command = "/bin/bash"
        args = ["-c", "[[.command]][[ if .append_stage | parseBool ]] [[.deploy.stage]][[ end ]]"]

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
}
