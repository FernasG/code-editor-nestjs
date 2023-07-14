# COM222 - Code Editor NestJS (Back-end)

![alt last commit](https://img.shields.io/github/last-commit/FernasG/code-editor-nestjs?style=flat-square)
![alt files in src](https://img.shields.io/github/directory-file-count/FernasG/code-editor-nestjs/src?label=files&style=flat-square)

O Code Editor é um editor de código online, permitindo aos desenvolvedores criar, armazenar e executar seus projetos em diversas linguagens como JavaScript e Python, tirando o trabalho necessário para configurar um ambiente de desenvolvimento, tarefa que pode ser difícil e complexa para novos programadores.

## Dependências

- NestJS;
- Axios;
- TypeORM;
- Passport;
- TypeScript;
- AWS Client S3;

[![Dependencies](https://skillicons.dev/icons?i=nestjs,typescript,postgres,aws,docker&theme=dark)](https://skillicons.dev)

## Instalação

:information_source: Esse repositório pode ser complementado com o [Code Editor Frontend](https://github.com/FernasG/code-editor-nextjs), mas você também pode utilizá-lo com alguma aplicação capaz de fazer requisições como `Insomnia`, `Postman`, `Curl` ou `Wget`.

### Configuração de Ambiente

Para rodar o projeto é necessário instalar o `Docker`, `Docker-Compose` e `Make`.

- Manual de instalação do [Docker](https://docs.docker.com/engine/install/), [Docker-Compose](https://docs.docker.com/compose/install/) e [Make](https://cmake.org/install/);

### Variáveis de Ambiente

Esse projeto utiliza [Simple Storage Service](https://aws.amazon.com/pt/s3/) da AWS para salvar os códigos na nuvem, portanto é preciso ter uma conta na [AWS](https://aws.amazon.com/) e gerar as credenciais para utilizar seus serviços.

1. Renomeie o arquivo `.env.example` para `.env`;
2. Ao abrir o arquivo insira nos campos com prefixo `AWS` as suas credenciais das AWS, você deve criar um _bucket_ na S3 que ficará responsável por armazenar os códigos, o nome do bucket criado deve ser inserido na váriavel `AWS_S3_BUCKET`;
3. O campo `HACKEREARTH_API_KEY` armazena a chave da API do [HackerEarth](https://www.hackerearth.com/pt-br/docs/wiki/developers/v4/) que é utilizado para compilar e executar os códigos;
4. A váriavel `HACKEREARTH_CALLBACK_URL` armazena a URL que recebe as requisições de resposta da API do HackerEarth, você pode usar o [Ngrok](https://ngrok.com/) para expor a porta 3000 da sua máquina, com a URL gerada basta adicionar o caminho `/codespaces/callback` ao fim da URL;
5. No campo `DATABASE_CONNECTION_URL` você deve inserir a URL de conexão com o banco de dados, há uma instância do banco sendo criada dentro Docker, sua URL é por padrão `postgresql://postgres:qAeMLDkV3&i274x1Yh@code-editor-database:5432`;
6. O campo `JWT_SECRET_KEY` refere-se a _string_ que será utilizada para gerar os _tokens_ de sessão dos usuários, você pode usar qualquer texto que quiser, porém recomendamos use algum gerador de _string_ aleatório como o [Random.org](https://www.random.org/strings/);

### Execução

Com o ambiente configurado abra o terminal na raiz do projeto e execute o comando:
```
make up
```
Esse comando fará o _build_ do projeto, após finalizar você verá a seguinte mensagem no terminal:
```
LOG [NestApplication] Nest application successfully started
```
Com o servidor rodando é preciso preparar o banco de dados, criando as tabelas que serão utilizadas pelo serviço, execute o comando abaixo para rodar as migrations:
```
make migration:run
```
Agora é possível interagir com a API através da URL `localhost:3000`.

## Autores

[Fernando Goulart](https://www.linkedin.com/in/fernando-goulart-2534901b9/)