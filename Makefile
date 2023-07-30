docker:
	docker-compose down
	docker-compose up -d
	
migrate:
	npx prisma db push 
	npx prisma db seed
all:
	make docker
	sleep 3
	make migrate