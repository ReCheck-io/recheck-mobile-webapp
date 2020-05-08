[![Website recheck.io](https://img.shields.io/badge/Website-recheck.io-brightgreen.svg)](https://recheck.io/)<a href="https://discord.gg/a2S6WX"><img src="https://img.shields.io/discord/675683560673509386?logo=discord" alt="chat on Discord"></a>
# recheck-mobile-webapp
This is the app we use for storage of keys and working on the phone through our service.

## Requirements

- have node 8.15 >=
- ``` npm install ```

## Getting started

### Start the app
This software is always running on https://beta.recheck.io/sign and there the app is on stable version. 

This repo, however is having the lastes version, therefore sometimes it may not work as expected. 

You can run this repo in four different ways: 

```npm run beta ``` - it will run the app with config for connection to https://beta.recheck.io

```npm run local_ae``` - it will run the app with config for localhost:3000 and AEthernity blockchain.

```npm run local_eth``` - it will run the app with config for localhost:3000 and Ethereum blockchain.


```npm run beta_eth``` - it will connect you to the beta, however at the moment, the test environment is running on AEthernity blockchain.

### Steps to work with the app 
1. Once you start the app you will be asked to create an identity. This identity will be stored on the browser's cache. 
2. You can interact with the server by scanning the QR codes according to the current action you want to execute. 