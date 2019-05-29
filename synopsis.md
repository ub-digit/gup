time ./buildEmAll.sh
docker login docker.ub.gu.se
#docker build --tag=docker.ub.gu.se/koha2pg:2019-04-23.002 
docker push docker.ub.gu.se/gup-backend:dev-2019-05-001
docker push docker.ub.gu.se/gup-frontend:dev-2019-05-001
docker push docker.ub.gu.se/gup-solr:dev-2019-05-001
docker push docker.ub.gu.se/gup-database:dev-2019-05-001

export UID
docker pull docker.ub.gu.se/gup-backend:dev-2019-05-001
docker pull docker.ub.gu.se/gup-frontend:dev-2019-05-001
docker pull docker.ub.gu.se/gup-solr:dev-2019-05-001
docker pull docker.ub.gu.se/gup-database:dev-2019-05-001

docker-compose up -d gup_database
docker-compose exec gup_database ./prepare.sh
docker-compose up -d gup_solr
docker-compose exec gup_solr bin/full-reindex.sh

docker-compose up -d

docker-compose exec gup_database bash

docker-compose stop
docker-compose rm

docker-compose logs
docker-compose logs -f
docker-compose logs -f gup_backend

docker inspect gup_gup_solr_1




== Synopsis for dockerified GUP

* Flytta backend till egen katalog
* Skapa katalog för solr
* Skapa flera olika Dockerfile:
	- en för varje state     [dev|deploy], kanske senare även för [test]
	- en för varje delsystem [backend|frontend|solr], kanske senare även för [databas|filer]
* 



* docker-compose.yml (inte relevant på serversidan/vid deploy, används endast för dev)

=== Att göra-lista
* Ta bort Gemfile.lock och bundle-install:a fram en ny (så 2.3.1 blir 2.3.8 eller vad Stefan nu sa)
* Se om man kan låsa inexakta versioner av program i apt (så man kan få v5.3.x exempelvis)
* 

=== Kom ihåg
* I Dockerfile, bygg med apt och bundle högt upp, så dessa inte behöver göras varje gång man bygger om
* 





Hur skall de olika containrarna kunna kommunicera med varandra? gup_solr skall kunna läsa data från gup_db







docker build -f Dockerfile.deploy -t gup-backend:release-2019-05-02-001 .

BACKEND=/home/xmagnn/git/gup/gup/backend
docker run -v $BACKEND:/apps/application -p 43000:3000 -p 44222:22 -it gup-backend:release-2019-05-02-001






docker build -f Dockerfile.dev -t gup-backend-dev:release-001 .
BACKEND=/home/xmagnn/git/gup/gup/backend
docker run --name gup_backend -v $BACKEND:/apps/application -p 6310:3000 -it gup-backend-dev:release-001

docker build -f Dockerfile.dev -t gup-frontend-dev:release-001 .
FRONTEND=/home/xmagnn/git/gup/gup/frontend
docker run --name gup_frontend -v $FRONTEND:/apps/application -p 6311:4200 -p 35730:35730 -it gup-frontend-dev:release-001

docker build -f Dockerfile.dev.solr -t gup-solr-dev:release-001 .
docker run --name gup_solr --add-host=gup_database:130.241.17.142 -it gup-solr-dev:release-001

--add-host=pgdb:172.17.0.1 \
--add-host=pgdb:172.17.0.4

  gup_frontend:
    image: "gup-frontend:dev"
    depends_on:
     - gup_backend
    ports:
     - "6311:4200"
     - "35730:35730"
    volumes:
     - ${GUP_REPO:-.}/frontend:/apps/
    user: $UID


GUP_REPO=/home/xmagnn/git/gup/gup
docker-compose up

version: '3'
services:
  gup_backend:
    image: "gup-backend:dev"
    depends_on:
     - gup_database
     - gup_solr
    ports:
     - "6310:3000"
    volumes:
     - ${GUP_REPO:-.}:/apps/
  gup_frontend:
    image: "gup-frontend:dev"
    depends_on:
     - gup_backend
    ports:
     - "6311:4200"
     - "35730:35730"
    volumes:
     - ${GUP_REPO:-.}/frontend:/apps/
    user: $UID
  gup_database:
    image: "postgres:11"
    environment:
        POSTGRES_USER: "gup"
        POSTGRES_PASSWORD: "gupPW"
        POSTGRES_DB: "gup"
  gup_solr:
    image: "gup-solr:dev"
    depends_on:
     - gup_database




docker run -v $SOLR:/apps/application --name gup_solr -p 127.0.0.1:8983:8983 -it gup-solr-dev:release-2019-05-13-001 bash -l
docker run --name gup_solr -it gup-solr-dev:release-2019-05-13-001 bash -l
docker run --name gup_solr --add-host=gup_database:130.241.17.142 -it gup-solr-dev:release-2019-05-13-001

curl http://localhost:8983/solr/gup-journals/dataimport?command=full-import


