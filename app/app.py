from flask import Flask, render_template
from dados import Cliente
from funcionalidades import setup_database, insert_data, fetch_data



app = Flask(__name__)

@app.route('/')
def hello():
    return "Olá, Mundo!"

@app.route('/clientes')
def mostrar_clientes():
    session = setup_database()

    # Aqui você pode chamar a função insert_data(session) se quiser inserir dados.
    #insert_data(session)

    clientes = fetch_data(session)
    session.close()

    # Formate os dados como uma string simples para visualização.
    clientes_str = "\n".join([cliente.nome for cliente in clientes])
    return clientes_str


if __name__ == "__main__":
    app.run(host="0.0.0.0")