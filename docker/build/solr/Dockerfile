FROM alpine:latest AS release
RUN apk add --no-cache git

ARG GIT_REVISION
ARG GIT_REPO_URL

WORKDIR /root/

RUN set -ex \
  && git clone $GIT_REPO_URL release -b $GIT_REVISION --depth 1

WORKDIR release/solr/config

# Copy in solrconfig.xml
RUN ls -d cores/*/conf | xargs -I{ cp solrconfig.xml {/

# Or softlink?
# RUN ls -d cores/*/conf | xargs -I{ ln -s ../../../gup-config/solrconfig.xml {/solrconfig.xml

FROM solr:5.5.5

ENV GUP_SOLR_CONF_PATH="/opt/solr/gup-config"

USER root

RUN set -ex \
  && apt-get update \
  && apt-get -y install gettext-base \
  && rm -rf /var/lib/apt/lists/*

USER $SOLR_USER

WORKDIR /opt/solr/dist

# VERSION??
RUN curl -O https://jdbc.postgresql.org/download/postgresql-42.2.6.jar

WORKDIR /opt/solr

COPY --from=release --chown=solr:solr /root/release/solr/config $GUP_SOLR_CONF_PATH

RUN ls "$GUP_SOLR_CONF_PATH/cores" | xargs -I{ precreate-core { "$GUP_SOLR_CONF_PATH/cores/"{

COPY gup-solr-docker-entrypoint.sh /opt/docker-solr/scripts

ENTRYPOINT ["gup-solr-docker-entrypoint.sh"]
CMD ["solr-foreground"]
