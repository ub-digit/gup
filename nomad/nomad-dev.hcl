
# Enable the client
client {
    enabled = true

    # For demo assume we are talking to server1. For production,
    # this should be like "nomad.service.consul:4647" and a system
    # like Consul used for service discovery.
    # servers = ["127.0.0.1:4647"]

    host_volume "gup-postgres" {
       path      = "/opt/postgres/gup-data"
       read_only = false
    }

    host_volume "gup-postgres-initdb" {
       path      = "/opt/postgres/gup-initdb"
       read_only = true
    }

    #host_volume "gup-solr-lab" {
    #   path      = "/opt/solr/gup-lab"
    #   read_only = false
    #}

    #network_interface = "eno1"
}

plugin "docker" {
  config {
    gc {
      dangling_containers {
        enabled = false
      }
    }
  }
}
