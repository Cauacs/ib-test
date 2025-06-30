# Como rodar a aplicação Laravel com React/Inertia localmente

Este projeto foi configurado com o Laravel Breeze usando o stack React/Inertia, seguindo a documentação oficial do Laravel.
https://laravel.com/docs/12.x/starter-kits#react

## Pré-requisitos

- Docker instalado
- Composer instalado globalmente

## Passos para rodar o projeto

1. Instale as dependências do Laravel Sail:

```
   composer require laravel/sail --dev
```
2. Copie o arquivo de ambiente:
```
   cp .env.example .env
```
3. Instale o Sail e selecione MySQL quando solicitado:
```
   php artisan sail:install
```
4. Suba os containers com Docker:
```
   ./vendor/bin/sail up -d
```
5. Instale as dependências PHP dentro do container:
```
   ./vendor/bin/sail composer install
```
6. Gere a chave da aplicação:
```
   ./vendor/bin/sail artisan key:generate
```
7. Execute as migrações:
```
   ./vendor/bin/sail artisan migrate
```
8. (Opcional) Popule o banco de dados com dados mock:
```
   ./vendor/bin/sail mysql laravel < mock-data.sql
```
9. Instale as dependências npm:
```
   ./vendor/bin/sail npm install
```
10. Compile os assets do frontend para produção:
```
    ./vendor/bin/sail npm run build
``` 
12. A aplicação estará disponível em
```
 http://localhost
```

## Observações

- Ao rodar npm run dev via Sail, o Vite servirá os assets do React diretamente, integrado ao Laravel.
- Não é necessário rodar um projeto React separado ou outro servidor de frontend.
- Para parar os containers do Docker:
```
  ./vendor/bin/sail down
```

