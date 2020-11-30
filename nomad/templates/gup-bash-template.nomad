job "gup-[[.service]]-[[ timeNow ]]" {
  datacenters = ["gubdc1"]
  type = "batch"

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
      # GUP_SECRET_KEY_BASE??
      env {
        RAILS_ENV = "[[.deploy.stage]]"  # RAILS_ENV instead of GUP_ENVIRONMENT for rake
        GUP_DB_HOST = "${NOMAD_UPSTREAM_IP_gup-postgres-[[.deploy.stage]]}"
        GUP_DB_PORT = "${NOMAD_UPSTREAM_PORT_gup-postgres-[[.deploy.stage]]}"
        GUP_DB = "[[.env.gup_db]]"
        GUP_DB_USER = "[[.env.gup_db_user]]"
        GUP_DB_PASSWORD = "[[.env.gup_db_password]]"
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
