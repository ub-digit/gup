FROM ruby:2.3.1

ARG GIT_REVISION
ARG GIT_REPO_URL

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    locales \
    #postgresql-client \
    git \
  && rm -rf /var/lib/apt/lists/* \
  && echo "en_US.UTF-8 UTF-8" > /etc/locale.gen \
  && locale-gen en_US.UTF-8

WORKDIR /usr/src/app

RUN set -ex \
  && git clone $GIT_REPO_URL repo -b $GIT_REVISION --depth 1

WORKDIR /usr/src/app/repo
RUN bundle install

EXPOSE 3000
CMD ["sh", "-c", "rails server -b 0.0.0.0 -e $GUP_ENVIRONMENT"]
