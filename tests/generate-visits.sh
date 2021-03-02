#!/bin/sh
year="2021"
month="03"
day="02"
URL="$1"
APIKEY="$2"

# curl -X POST http://lucy1.local:5000/Lucy/VisitorAnalytics/arrival/Building1 -H "Authorization: APIKEY SC:lucy1:e255756835518e03" -H "Content-Type: application/json" --data '{ "count": 23,"time":$dt }'

for i in $(seq -f "%02g" 7 19); 
do 
    dt="$year-$month-$day""T$i:00:00Z"
    count=$((1 + $RANDOM % 10))
    echo $dt; 
    echo $count
    curl -X POST $URL/Lucy/VisitorAnalytics/arrival/Building1 -H "Authorization: APIKEY $APIKEY" -H "Content-Type: application/json" --data "{ \"count\": $count,\"time\":\"$dt\" }"

done
