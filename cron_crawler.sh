if ps -ef | grep -v grep | grep crawler/main.js; then
        kill $(ps -ef | grep -v grep | grep crawler/main.js |awk '{print $2}')
fi

/usr/bin/node /var/www/politicat.com/crawler/main.js >> /var/www/politicat.com/cron_crawler.log &

exit 0
