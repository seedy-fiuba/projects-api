run:
	docker-compose up --build

deploy:
	heroku container:login
	heroku container:push web --app seedy-fiuba-projects-api
	heroku container:release web --app seedy-fiuba-projects-api
