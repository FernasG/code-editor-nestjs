up:
	@docker-compose up

build:
	@docker-compose build

sh:
	@docker-compose exec code-editor-nestjs bash

migration\:run:
	@docker-compose exec code-editor-nestjs bash -c "npx ts-node node_modules/typeorm/cli migration:run -d ormconfig.ts"

migration\:revert:
	@docker-compose exec code-editor-nestjs bash -c "npx ts-node node_modules/typeorm/cli migration:revert -d ormconfig.ts"