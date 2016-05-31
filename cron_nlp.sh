#!/bin/sh
if ps -ef | grep -v grep | grep NlpTitles.py; then
        kill $(ps -ef | grep -v grep | grep NlpTitles.py |awk '{print $2}')
fi

/usr/bin/python3 /var/www/politicat.com/nlp/NlpTitles.py >> /var/www/politicat.com/cron_nlp.log &

exit 0
