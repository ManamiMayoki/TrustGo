.PHONY: all dev build test test-server test-client lint docker-up docker-down docker-logs clean

all: install dev

install:
	npm install
	cd server && npm install
	cd client && npm install

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

test-server:
	npm run test:server

test-client:
	npm run test:client

test-security:
	npm run test:security

lint:
	npm run lint

docker-up:
	docker compose up --build -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f

clean:
	rm -rf node_modules client/node_modules server/node_modules client/dist
