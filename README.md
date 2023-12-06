# Agência de Turismo
## Trabalho desenvolvido para as matérias Banco de Dados 2 e Desenvolvimento Web na UDESC

![demo](docs/demo.gif)

# Objetivo
Criar um sistema baseado em Web para controlar as reservas de uma agência de turismo. Nesse sistema, existe um usuário admin (O usuário admin deve ser `admin@admin.com`) que pode cadastrar pontos turísticos, cidades e visitas no site. Podem existir N usuários normais que podem selecionar M visitas e fazer check-out, nesse ato será criado um pacote personalizado para o cliente contendo as visitas selecionadas. Todas as compras realizadas pelos usuários podem ser monitoradas pelo Admin.

# Tecnologias
- Banco de Dados
    - PostgresSQL
    - [MongoDB](https://github.com/ViniciusHansen/agencia-mongo)
- Backend
    - Flask
    - REST API
- Frontend
    - React JS
    - Material UI
- Integração
    - Docker
----
## Build:
```sh
sudo docker-compose up --build
```
acesse em `localhost:3000`

## IP do container:
```sh
sudo docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' agencia-turismo-db-1

```
