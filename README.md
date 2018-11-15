# hx.online
Hexenhaus


##User management
meteor add accounts-password
meteor add useraccounts:unstyled
meteor add aldeed:template-extension
meteor add themeteorchef:bert


#!/bin/bash
# Deploy top100 to productive account

echo "Create new Version of Meter top100"

#DevAccount
cd /home/gregor/meteorApps/top100/
meteor build  /home/meteoruser/meteorApps/tmp --server-only
echo "Build new version"
cd /home/meteoruser/meteorApps/tmp
sudo tar -zxf /home/meteoruser/meteorApps/tmp/top100.tar.gz -C /home/meteoruser/meteorApps/top100
sudo (cd /home/meteoruser/meteorApps/top100/bundle/programs/server; npm install)
sudo chown -R meteoruser /home/meteoruser/meteorApps/top100/
sudo service meteorTop100 restart
echo "New version Started!"