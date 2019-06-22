# Hyperledger Fabric

Basic structure of a Hyperledger Fabric Project

To run this project it's necessary to install Hyperledger Fabric prerequisites describe in this https://hyperledger-fabric.readthedocs.io/en/release-1.4/prereqs.html


To build the network and deploy the smart contract

``
./startFabric
``

List the smart contracts installed 

```
peer chaincode list --installed -C mychannel
```


To update the smart contract

```
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" -it cli bash

peer chaincode install -n bart -v 1.1 -p /opt/gopath/src/github.com/bart -l node

peer chaincode upgrade -o orderer.example.com:7050 -C mychannel -n bart -v 1.1 -c '{"Args": []}' -P "OR ('Org1MSP.member','Org2MSP.member')"

peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n bart -c '{"function":"initLedger","Args":[]}'
 
```


Global Variables


# if version not passed in, default to latest released version
VERSION=1.4.1
# if ca version not passed in, default to latest released version
CA_VERSION=1.4.1
# current version of thirdparty images (couchdb, kafka and zookeeper) released
THIRDPARTY_IMAGE_VERSION=0.4.15
ARCH=$(echo "$(uname -s|tr '[:upper:]' '[:lower:]'|sed 's/mingw64_nt.*/windows/')-$(uname -m | sed 's/x86_64/amd64/g')")
MARCH=$(uname -m)

DOCKER=true
SAMPLES=true
BINARIES=true

# Parse commandline args pull out
# version and/or ca-version strings first
if [ -n "$1" ] && [ "${1:0:1}" != "-" ]; then
    VERSION=$1;shift
    if [ -n "$1" ]  && [ "${1:0:1}" != "-" ]; then
        CA_VERSION=$1;shift
        if [ -n  "$1" ] && [ "${1:0:1}" != "-" ]; then
            THIRDPARTY_IMAGE_VERSION=$1;shift
        fi
    fi
fi

# prior to 1.2.0 architecture was determined by uname -m
if [[ $VERSION =~ ^1\.[0-1]\.* ]]; then
    export FABRIC_TAG=${MARCH}-${VERSION}
    export CA_TAG=${MARCH}-${CA_VERSION}
    export THIRDPARTY_TAG=${MARCH}-${THIRDPARTY_IMAGE_VERSION}
else
    # starting with 1.2.0, multi-arch images will be default
    : "${CA_TAG:="$CA_VERSION"}"
    : "${FABRIC_TAG:="$VERSION"}"
    : "${THIRDPARTY_TAG:="$THIRDPARTY_IMAGE_VERSION"}"
fi

BINARY_FILE=hyperledger-fabric-${ARCH}-${VERSION}.tar.gz
CA_BINARY_FILE=hyperledger-fabric-ca-${ARCH}-${CA_VERSION}.tar.gz




