CONTAINER_NAME := frontend

.PHONY: up
up:
	docker-compose up

.PHONY: down
down:
	docker-compose down

.PHONY: down-v
down-v:
	docker-compose down -v

.PHONY: sh
sh:
	docker-compose exec ${CONTAINER_NAME} sh

.PHONY: yarn
yarn:
	docker-compose exec ${CONTAINER_NAME} sh -c "yarn && yarn dev --host 0.0.0.0"

.PHONY: test
test:
	docker-compose exec ${CONTAINER_NAME} sh -c "yarn && yarn test"

.PHONY: build
build:
	docker-compose exec ${CONTAINER_NAME} sh -c "yarn && yarn build --outDir ../docs"

.PHONY: create-project
create-project:
	docker run \
		--rm \
		--volume $(PWD):/work:cached \
		--workdir /work \
		node:14-alpine \
		yarn create vite-app frontend
