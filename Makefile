.PHONY: yarn
yarn:
	cd frontend && yarn && yarn dev

.PHONY: test
test:
	cd frontend && yarn && yarn test

.PHONY: build
build:
	cd frontend && yarn && yarn build --outDir ../docs
