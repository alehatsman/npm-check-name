#!/bin/sh

./clear.sh

cd ./frontend
yarn prod
cd ../
cp -r ./frontend/dist/* ./backend/resources/public
cd ./backend
lein uberjar
cd ../
mkdir -p dist
cp ./backend/target/npm_check_name-0.1.0-SNAPSHOT-standalone.jar ./dist
