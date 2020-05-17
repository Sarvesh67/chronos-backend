APP_NAME=chronos-backend
# Figure out a way to put all of this in package.json

run:
	docker-compose up

test:
	npm run test

generate-token:
	npm run testToken
	
install:
	docker-compose -f docker-compose.builder.yml run --rm install-packages

push:
	git add --all
	git commit
	git push -u origin master
	
pull:
	git pull -v origin master

update:
	make pull
	make restart

pm2-start:
	pm2 start --name $(APP_NAME) bin/www

stop:
	pm2 stop $(APP_NAME)

restart:
	pm2 restart $(APP_NAME)

logs:
	pm2 logs $(APP_NAME)

# Database.
db:
	docker exec -it chronos-backend npm run db

db-connect:
	docker exec -it chronos-db psql -U postgres -d chronos

