DISTDIR=dist
TESTSERVER=gup3-test.ub.gu.se
DRIFTSERVER=gup3.ub.gu.se
DESTDIR=/apps/gup
APPENV=production


all:
	@echo -n "run like this:"
	@echo    "'make deploy-test'"
	@echo -n "           or:" 
	@echo    "'make deploy-drift'"



deploy-drift: 
	./create-deploy-info.sh
	ember build --environment=production
	mv deploy-info.txt dist
	scp -r $(DISTDIR)/* $(DRIFTSERVER):$(DESTDIR)/


deploy-test: 
	./create-deploy-info.sh
	ember build --environment=development
	mv deploy-info.txt dist
	scp -r $(DISTDIR)/* app-user@$(TESTSERVER):$(DESTDIR)/


