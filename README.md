# GUP dockerized #

## Förberedelser ##
Du behöver ha docker-compose installerat. Du behöver också ha gup-arkivet utcheckat och står i dess rot, hädanefter kallat gup-roten.

```backend/config/database.yml```-filen som skall användas i en utvecklingsmiljö är den som är incheckad i gup-repot och skall innehålla följande information för development:
```
host: gup_database
username: gup
password: gupPW
```

Du behöver också ha UID exporterad för att UID skall finnas som miljövariabel och docker-compose skall kunna köras som rätt användare.
```
$ export UID
```

Du behöver också vara inloggad på vår docker-server:
```
$ docker login docker.ub.gu.se
```

Det finns en katalog ```files``` som monteras i alla fyra containrar som ```/files```. Där kan du lägga filer som du vill flytta in i en container, exempelvis en ny databasdump, förändrade solrkonfigurationsfiler, etc.

## Starta servrarna ##
Du måste börja med att starta database-containern (och därmed databasen):
```
$ docker-compose up -d gup_database
```
Det tar någon sekund innan databasen kommer igång, sen kan du populera databasen:
```
$ docker-compose exec gup_database ./prepare.sh
```
Sen behöver du starta solr-containern och börja in indexering:
```
$ docker-compose up -d gup_solr
$ docker-compose exec gup_solr bin/full-reindex.sh
```
Själva indexeringen tar cirka en timme, och det är först när indexeringen är färdig som GUP använder indexet (den har inget index i imagen) och därmed fullt ut går att använda.

Sen startar du resterande containrar:
```
$ docker-compose up -d
```

Backend och frontend byggs vid uppstart så det tar några minuter för dessa att komma upp. Detta kan du se i loggarna, se nedan.

Nu är utvecklingsmiljön startad och du kan nå den på localhost:6311. Ändrar du i koden lokalt på din maskin kan du se dessa ändringar och sen checka in dessa ändringar.


## Drift & Underhåll ##
För att få ett bash-skal in i någon av containrarna använder du något av nedanstående kommandon:
```
$ docker-compose exec gup_frontend bash
$ docker-compose exec gup_backend bash
$ docker-compose exec gup_database bash
$ docker-compose exec gup_solr bash
```
Detta kan du vilja göra om du exempelvis lägger till ett gem och behöver bygga om manuellt. Notera att ändringar i containern bara lever så länge containern lever. Om du vill göra någon ändring som skall bestå behöver du bygga en ny image.


Vill du stoppa alla containrar?
```
$ docker-compose stop
```

Vill du ta bort alla stoppade containrar?
```
$ docker-compose rm
```

Vill du både stoppa och ta bort alla containrar kan man göra det med ett kommando:
```
$ docker-compose down
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
Om man behöver bygga om en eller flera images kan man köra respektive build-skriptet i respektive katalog. Man måste först då ändra tagnamnet i byggskriptet. Detta taggnamn behöver också ändras i docker-compose.yml. Vill man bygga om samtliga images kan man använda <code>buildEmAll.sh</code> i rotkatalogen.

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
Imagen har en dump av databasen i sig. Den ligger i roten och heter ```gup-production.dmp```. Denna fil ligger även uppbackad på Laban på ```root@130.241.16.50:/netapp/digit/dig/data-source/data/digit-share/docker/gup/database/gup-production.dmp```. Om du vill ha mera aktuell data kan du ta en ny dump som du sen lägger in i containern i dess ställe:
```
pg_dump -v  -Upostgres -dgup -h app-production-1.ub.gu.se --schema='public' --format=c -f "files/gup-production.dmp"
```
Du måste ersätta den befintliga dumpfilen med den nya i containern och den måste ha exakt samma namn (<code>gup-production.dmp</code>) för att prepare-skriptet skall fungera. 

Du måste lägga in den i containern efter att du startat containern ```gup_database```, men innan du kört ```./prepare.sh``` då prepare-skriptet använder just den dumpfilen.

Då skulle ovan instruktion att starta och populera databasen kunna ersättas med:
```
$ pg_dump -v  -Upostgres -dgup -h app-production-1.ub.gu.se --schema='public' --format=c -f "files/gup-production.dmp"
$ docker-compose up -d gup_database
$ docker-compose exec gup_database bash
$ cp /files/gup-production.dmp .
$ exit
$ docker-compose exec gup_database ./prepare.sh
```