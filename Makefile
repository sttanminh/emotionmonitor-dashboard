docker-down: 
	docker-compose down

docker-up:
	docker-compose up -d
	
migrate:
	npx prisma db push 
	npx prisma db seed

reset:
	make docker-down
	make docker-up
	sleep 3
	make migrate

all:
	make docker-up
	sleep 3
	make migrate