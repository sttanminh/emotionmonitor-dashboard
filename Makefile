docker:
	docker-compose down
	docker-compose up -d
	
migrate:
	npx prisma migrate dev

all:
	make docker
	sleep 1
	make migrate