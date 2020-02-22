rm -rf ./dist
mkdir ./dist
mkdir ./dist/static
cp -r ./static ./dist
pug index.pug -o ./dist -P
# pug -w . -o ./dist -P