#!/bin/sh

cd ./frontend
yarn prod
cp -r ./dist/* ../backend/resources/public

