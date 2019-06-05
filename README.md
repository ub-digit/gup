# GUP dockerified #

## Förberedelser ##
Du behöver ha docker-compose installerat. Du behöver också ha gup-arkivet utcheckat och står i dess rot, hädanefter kallat gup-roten.

```database.yml```-filen som skall användas i en utvecklingsmiljö är den som är incheckad i gup-repot och skall innehålla följande information:

```
host: gup_database
username: gup
password: gupPW
```

Du behöver också ha UID exporterad och sökvägarna till bak- och framända i variablerna BACKEND respektive FRONTEND 

```
$ export UID
```

Du behöver också vara inloggad på vår docker-server:
```
$ docker login docker.ub.gu.se
```

## Starta servrarna ##
Du måste börja med att ta upp databasen och populera denna:
```
$ docker-compose up -d gup_database
$ docker-compose exec gup_database ./prepare.sh
```

Sen behöver du ta upp solr och börja in indexering:
```
$ docker-compose up -d gup_solr
$ docker-compose exec gup_solr bin/full-reindex.sh
```

Sen tar du upp resten:
```
$ docker-compose up -d
```

Sen kan du surfa in till localhost:6311

## Drift & Underhåll ##
För att få ett bash-skal in i någon av servrarna använder du nedanstående kommandon:
```
$ docker-compose exec gup_frontend bash
$ docker-compose exec gup_backend bash
$ docker-compose exec gup_database bash
$ docker-compose exec gup_solr bash
```

Vill du stoppa alla servrar?
```
$ docker-compose stop
```

Vill du ta bort alla stoppade servrar?
```
$ docker-compose rm
```

För att titta på loggarna
```
$ docker-compose logs
$ docker-compose logs -f
$ docker-compose logs -f gup_backend
```

Om man behöver se mer information om en container kan man använda docker inspect. Viktigt att veta då är att docker namnsätter containers annorlunda än vad docker-compose gör. Det finns ingen motsvarighet till inspect i docker-compose.
```
$ docker inspect gup_gup_solr_1
```


## Ombyggnation ##
Om man behöver bygga om en eller flera images kan man köra respektive build-skriptet i respektive katalog. Man måste först då ändra tagnamnet i byggskriptet. Detta taggnamn behöver också ändras i docker-compose.yml. Vill man bygga om samtliga images kan man använda <code>buildEmAll.sh</code>code> i rotkatalogen.

Den/de images som har byggts om behöver sen pushas upp till servern. Glöm inte att ändra taggarna.
```
$ docker push docker.ub.gu.se/gup-backend:dev-2019-05-001
$ docker push docker.ub.gu.se/gup-frontend:dev-2019-05-001
$ docker push docker.ub.gu.se/gup-solr:dev-2019-05-001
$ docker push docker.ub.gu.se/gup-database:dev-2019-05-001
```

Om man vill hämta ner images lokalt kan man göra det. Glöm inte att ändra taggarna.
```
$ docker pull docker.ub.gu.se/gup-backend:dev-2019-05-001
$ docker pull docker.ub.gu.se/gup-frontend:dev-2019-05-001
$ docker pull docker.ub.gu.se/gup-solr:dev-2019-05-001
$ docker pull docker.ub.gu.se/gup-database:dev-2019-05-001
```

## Databasen ##
Imagen har en dump av databasen i sig. Den ligger i roten och heter ```gup-production.dmp```. Denna fil ligger även uppbackad på Laban på ```root@130.241.16.50:/netapp/digit/dig/data-source/data/digit-share/docker/gup/database/gup-production.dmp```. Om du vill ha mera aktuella data kan du ta en ny dump som du sen lägger in i containern i dess ställe:
```
pg_dump -v  -Upostgres -dgup -h app-production-1.ub.gu.se --schema='public' --format=c -f "gup-production.dmp"
```
Denna fil måste du lägga in i containern efter att du startat ```gup_database```, men innan du kört ```./prepare.sh```.
