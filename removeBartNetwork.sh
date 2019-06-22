#!/bin/bash

starttime=$(date +%s)

echo Stopping containers...

docker stop $(docker ps -aq)

echo Removing containers...

docker rm $(docker ps -aq)

echo Removing peer dev images...

docker rmi -f $(docker images | grep dev | awk '{print $3}')

echo Pruning volumes...

docker volume prune

echo Total setup execution time : $(($(date +%s) - starttime)) secs ...
