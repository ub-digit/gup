# GUP dockerified #

## Förberedelser ##
Du behöver ha gup-arkivet utcheckat och förberett medelst information från config-repositoriet. Notera att database.yml skall innehålla följande information:

``
host: gup_database
username: gup
password: gupPW
``

Du behöver också ha UID exporterad och sökvägarna till bak- och framända i variablerna BACKEND respektive FRONTEND 

``
$ export UID
$ FRONTEND=$(pwd)/frontend
$ BACKEND=$(pwd)/backend
``

Du behöver också vara inloggad på vår docker-server:
``
$ docker login docker.ub.gu.se
``

Detta och nedanstående förutsätter att du står i gup-roten.

## Starta servrarna ##
Du måste börja med att ta upp databasen och populera denna:
``
$ docker-compose up -d gup_database
$ docker-compose exec gup_database ./prepare.sh
``

Sen behöver du ta upp solr och börja in indexering:
``
$ docker-compose up -d gup_solr
$ docker-compose exec gup_solr bin/full-reindex.sh
``

Sen tar du upp resten:
``
$ docker-compose up -d
``

Sen kan du surfa in till localhost:6311

## Drift & Underhåll ##
För att få ett bash-skal in i någon av servrarna använder du nedanstående kommandon:
``
$ docker-compose exec gup_frontend bash
docker-compose exec gup_backend bash
docker-compose exec gup_database bash
docker-compose exec gup_solr bash
``

Vill du stoppa alla servrar?
``
$ docker-compose stop
``

Vill du ta bort alla stoppade servrar?
``
$ docker-compose rm
``

För att titta på loggarna
``
$ docker-compose logs
$ docker-compose logs -f
$ docker-compose logs -f gup_backend
``

Om man behöver se mer information om en container kan man använda docker inspect. Viktigt att veta då är att docker namnsätter containers annorlunda än vad docker-compose gör. Det finns ingen motsvarighet till inspect i docker-compose.
``
$ docker inspect gup_gup_solr_1
``


## Ombyggnation ##
Om man behöver bygga om en eller flera images kan man köra respektive build-skriptet i respektive katalog. Man måste först då ändra tagnamnet i byggskriptet. Detta taggnamn behöver också ändras i docker-compose.yml. Vill man bygga om samtliga images kan man använda <code>buildEmAll.sh</code>code> i rotkatalogen.

Den/de images som har byggts om behöver sen pushas upp till servern. Glöm inte att ändra taggarna.
``
$ docker push docker.ub.gu.se/gup-backend:dev-2019-05-001
$ docker push docker.ub.gu.se/gup-frontend:dev-2019-05-001
$ docker push docker.ub.gu.se/gup-solr:dev-2019-05-001
$ docker push docker.ub.gu.se/gup-database:dev-2019-05-001
``

Om man vill hämta ner images lokalt kan man göra det. Glöm inte att ändra taggarna.
``
$ docker pull docker.ub.gu.se/gup-backend:dev-2019-05-001
$ docker pull docker.ub.gu.se/gup-frontend:dev-2019-05-001
$ docker pull docker.ub.gu.se/gup-solr:dev-2019-05-001
$ docker pull docker.ub.gu.se/gup-database:dev-2019-05-001
``
