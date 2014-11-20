#/bin/bash
# -------------------------------------------------- #
# collects deploy info
# -------------------------------------------------- #

SEPARATOR='# ---------------------------------------- #'
INFOFILE=deploy-info.txt


echo 'Submit your user name so we can keep track on you!'
read DEPLOYER
echo $SEPARATOR           >  $INFOFILE
date                      >> $INFOFILE
echo "DEPLOYER:$DEPLOYER" >> $INFOFILE
echo $SEPARATOR           >> $INFOFILE
git show HEAD | head -5   >> $INFOFILE
echo $SEPARATOR           >> $INFOFILE
chmod 664 $INFOFILE
