para buildar:
```sh
sudo docker-compose up --build
```

Se estiver no Windows tente usar o docker desktop

- para pegar o ip do container:
```sh
sudo docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' agencia-turismo-db-1

```

O usuário admin deve ser `admin@admin.com`