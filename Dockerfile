# Use uma imagem base Python
FROM python:3.9-slim

# Defina uma pasta de trabalho
WORKDIR /app

# Copie os requisitos e instale-os
COPY app/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copie o resto do aplicativo
COPY app /app

EXPOSE 5000
EXPOSE 5432

# Comando para executar o aplicativo Flask
CMD ["python", "app.py"]

