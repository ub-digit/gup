FROM alpine:latest AS release
RUN apk add --no-cache git

ARG GIT_REVISION
ARG GIT_REPO_URL

WORKDIR /root/

RUN set -ex \
  && git clone $GIT_REPO_URL release -b $GIT_REVISION --depth 1

FROM docker.ub.gu.se/rails:ruby-2.5.8

COPY --from=release /root/release /usr/src/app

# Fix for non existing CA certificates
COPY harica/ /usr/local/share/ca-certificates/
RUN update-ca-certificates

RUN bundle install
