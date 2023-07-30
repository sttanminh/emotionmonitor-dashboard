docker:
	docker-compose down
	docker-compose up -d
	
migrate:
	npx prisma db push 

all:
	make docker
	sleep 3
	make migrate