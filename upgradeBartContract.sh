#!/bin/bash

CC_RUNTIME_LANGUAGE=node
CC_VERSION=$1

echo Removing last contract...

docker rm -f $(docker ps | grep dev | awk '{print $1}')

# docker rm -f $(docker ps -a | grep couchdb | awk '{print $1}')

# cd ./network

# docker-compose -f docker-compose.yml up -d couchdb peer0.org1.example.com

# cd ../

echo Installing contract version $CC_VERSION

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode install -n registry -v $CC_VERSION -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"

echo Upgrading contract version $CC_VERSION

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode upgrade -o orderer.example.com:7050 -C mychannel -n registry -v $CC_VERSION  -c '{"Args": ["initLedger"]}' -P "OR ('Org1MSP.member','Org2MSP.member')"

sleep 5

echo Initializing contract version $CC_VERSION


docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n registry -c '{"function":"initLedger","Args":[]}'
