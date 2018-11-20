# hx.online
Hexenhaus


##User management
meteor add accounts-password
meteor add useraccounts:unstyled
meteor add aldeed:template-extension


###Ubuntu updating

apt update
apt upgrade
apt dist-upgrade


#Error

Nginx can't start

systemctl status nginx.service OR journalctl -xe

#Ubuntu Housekeeping

delete user: deluser --remove-home flossgraben


### Domains

flossgraben.run
hexenhaus.online
    login.hexenhaus.online
madcross.de
    forum.madcross.de
    madeast-registration.madcross.de
    vjjcfe5ginxx.madcross.de

###nginx

/etc/nginx/nginx.conf

##build
gregor@localhost:~/meteorApps/top100$ meteor build .
gregor@localhost:~/meteorApps/top100$ sudo mv top100.tar.gz /home/meteoruser/meteorApps/top100/
meteoruser@localhost:~/meteorApps/top100/bundle/programs/server$ cd /home/meteoruser/meteorApps/top100/
meteoruser@localhost:~/meteorApps/top100$ tar -zxf top100.tar.gz
meteoruser@localhost:~/meteorApps/top100$ cd bundle/programs/server/
meteoruser@localhost:~/meteorApps/top100/bundle/programs/server$ npm install
root@localhost:/# service meteorTop100 restart

#### Pictures
http://www.myuuzik.de/index.php?SearchIndex=Music&Keywords=Ed+Sheeran+Shape+of+you&ItemPage=1
https://www.base64-image.de/
Resize 150px
Copy to /public/img/cover/<year>-<title>.png
Add to json "img": "base64"