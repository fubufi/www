serve:
	NODE_OPTIONS=--openssl-legacy-provider npm start

deps:
	npm install

deploy-init:
	npm run deploy

build:
	NODE_OPTIONS=--openssl-legacy-provider GENERATE_SOURCEMAP=true npm run build
	echo "fubufi.com" > build/CNAME

deploy:
	git push origin `git subtree split --prefix build master`:gh-pages --force

.PHONY: build
