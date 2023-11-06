from flask import request, flash, redirect, url_for, render_template
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import create_engine
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import base64, os, json
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@db:5432/agencia_turismo'
app.config['SECRET_KEY'] = 'GnXKv7!AV$hnjmgslOOHnElvbg7x24jbl&BvFEt^BJPNe&Uf4'
app.config['JWT_SECRET_KEY'] = 'asdasdasdg40981t029478gb&*$986340270YIUR'  

db = SQLAlchemy()
db.init_app(app)
jwt = JWTManager(app)


# Mapeamento do Banco de dados para SQLAlchemy

class Pacote(db.Model):
    __tablename__ = 'Pacote'
    codigo = db.Column(db.Integer, primary_key=True)
    valor = db.Column(db.Float)
    data_ini = db.Column(db.Date)
    data_fim = db.Column(db.Date)


class Cidade(db.Model):
    __tablename__ = 'Cidade'
    codigo = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String)
    estado = db.Column(db.String)
    populacao = db.Column(db.Integer)
    imagem = db.Column(db.LargeBinary)


class TipoVisita(db.Model):
    __tablename__ = 'Tipo Visita'
    codigo = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String)


class Visita(db.Model):
    __tablename__ = 'Visita'
    codigo = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String)
    endereco = db.Column(db.String)
    hora_ini = db.Column(db.DateTime)
    hora_fim = db.Column(db.DateTime)
    tipo_visita = db.Column(db.Integer, db.ForeignKey('Tipo Visita.codigo'))
    codigo_cidade = db.Column(db.Integer, db.ForeignKey('Cidade.codigo'))


class Hotel(db.Model):
    __tablename__ = 'Hotel'
    codigo = db.Column(db.Integer, primary_key=True)
    categoria = db.Column(db.String)
    codigo_visita = db.Column(db.Integer, db.ForeignKey(
        'Visita.codigo'))
    imagem = db.Column(db.LargeBinary)


class Restaurante(db.Model):
    __tablename__ = 'Restaurante'
    codigo = db.Column(db.Integer, primary_key=True)
    especialidade = db.Column(db.String)
    preco_medio = db.Column(db.Float)
    categoria = db.Column(db.String)
    codigo_visita = db.Column(db.Integer, db.ForeignKey('Visita.codigo'))
    hotel_associado = db.Column(
        db.Integer, db.ForeignKey('Hotel.codigo_visita'))
    casa_de_show_associada = db.Column(db.Integer)
    imagem = db.Column(db.LargeBinary)


class Quarto(db.Model):
    __tablename__ = 'Quarto'
    codigo = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String)
    valor = db.Column(db.Float)
    tipo = db.Column(db.String)
    codigo_hotel = db.Column(db.Integer, db.ForeignKey('Hotel.codigo_visita'))


class PontoTuristico(db.Model):
    __tablename__ = 'Ponto Turistico'
    codigo = db.Column(db.Integer, primary_key=True)
    desc = db.Column(db.String)
    codigo_visita = db.Column(db.Integer, db.ForeignKey('Visita.codigo'))
    imagem = db.Column(db.LargeBinary)


class CasaDeShow(db.Model):
    __tablename__ = 'Casa de Show'
    codigo = db.Column(db.Integer, primary_key=True)
    hora_ini = db.Column(db.Time)
    hora_fim = db.Column(db.Time)
    dia_fecha = db.Column(db.String)
    codigo_pontoturistico = db.Column(
        db.Integer, db.ForeignKey('Ponto Turistico.codigo'))


class Museu(db.Model):
    __tablename__ = 'Museu'
    codigo = db.Column(db.Integer, primary_key=True)
    data_funda = db.Column(db.Date)
    n_salas = db.Column(db.Integer)
    codigo_pontoturistico = db.Column(
        db.Integer, db.ForeignKey('Ponto Turistico.codigo'))
    codigo_fundador = db.Column(db.Integer)


class Fundador(db.Model):
    __tablename__ = 'Fundador'
    codigo = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String)
    data_nasc = db.Column(db.Date)
    data_obito = db.Column(db.Date)
    trabalho = db.Column(db.String)
    nacionalidade = db.Column(db.String)


class Igreja(db.Model):
    __tablename__ = 'Igreja'
    codigo = db.Column(db.Integer, primary_key=True)
    data_const = db.Column(db.Date)
    estilo = db.Column(db.String)
    codigo_pontoturistico = db.Column(
        db.Integer, db.ForeignKey('Ponto Turistico.codigo'))


class Cliente(db.Model):
    __tablename__ = 'Cliente'
    codigo = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String)
    email = db.Column(db.String(255))
    endereco = db.Column(db.String)
    fone = db.Column(db.String)
    senha_hash = db.Column(db.String(255))

    def set_password(self, senha):
        self.senha_hash = generate_password_hash(senha)

    def check_password(self, senha):
        return check_password_hash(self.senha_hash, senha)


class PessoaFisica(db.Model):
    __tablename__ = 'Pessoa Fisica'
    cpf = db.Column(db.String, primary_key=True)
    codigo_cliente = db.Column(db.Integer, db.ForeignKey('Cliente.codigo'))


class PessoaJuridica(db.Model):
    __tablename__ = 'Pessoa Juridica'
    cnpj = db.Column(db.String, primary_key=True)
    codigo_cliente = db.Column(db.Integer, db.ForeignKey('Cliente.codigo'))


class Cliente_Pacote(db.Model):
    __tablename__ = 'Cliente_Pacote'
    Cliente_codigo = db.Column(db.Integer, db.ForeignKey(
        'Cliente.codigo'), primary_key=True)
    Pacote_codigo = db.Column(db.Integer, db.ForeignKey(
        'Pacote.codigo'), primary_key=True)


class Pacote_Visita(db.Model):
    __tablename__ = 'Pacote_Visita'
    Pacote_codigo = db.Column(db.Integer, db.ForeignKey(
        'Pacote.codigo'), primary_key=True)
    Visita_codigo = db.Column(db.Integer, db.ForeignKey(
        'Visita.codigo'), primary_key=True)
    datahora_ini = db.Column(db.DateTime)
    datahora_fim = db.Column(db.DateTime)


CORS(app, resources={r"/*": {"origins": "*"}})


Base = declarative_base()


def create_session():
    engine = create_engine(
        'postgresql://postgres:postgres@db:5432/agencia_turismo')
    Session = sessionmaker(bind=engine)
    return Session()


# alguns exemplos (se conexão com o frontend)
def insert_data(session):
    # session = Session()

    novo_turista = Cliente(nome="João")
    session.add(novo_turista)

    novo_turista2 = Cliente(nome="Maria")
    session.add(novo_turista2)

    session.commit()


def fetch_data(session):
    turistas = session.query(Cliente).all()
    return turistas


# Rotas de comunicação Back-Front
@app.route("/")
def hello():
    return "Welcome to Python Flask."


@app.errorhandler(404)
def invalid_route():
    return jsonify({'errorCode': 404, 'message': 'Route not found'})


@app.route('/register', methods=['GET', 'POST', 'OPTIONS'])
def register():
    if request.method == 'POST':
        data = request.get_json()
        new_user = Cliente(email=data['username'], senha_hash=generate_password_hash(
            data['password'], method='sha256'))
        db.session.add(new_user)
        db.session.commit()
        flash('Registration successful! Please login.', category='success')
        return jsonify({'message': 'registered successfully'}), 200
    return render_template('signup.html')

@app.errorhandler(404)
def invalid_route(e):
    # You can use the exception object e to get more information about the error if needed
    return 'This route is invalid or the page does not exist.', 404


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = Cliente.query.filter_by(email=data['username']).first()
    pw = data['password']  # Mudança aqui
    if user and check_password_hash(user.senha_hash, pw):
        access_token = create_access_token(identity=user.email)
        return jsonify({'access_token': access_token}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/visitas', methods=['GET'])
def get_visitas():
    visitas = Visita.query.all()  # Obtém todas as visitas
    resultado = []

    for visita in visitas:
        # Estrutura de dados para acumular informações da visita
        detalhes_visita = {
            'codigo': visita.codigo,
            'nome': visita.nome,
            'endereco': visita.endereco,
            'hora_ini': str(visita.hora_ini),
            'hora_fim': str(visita.hora_fim),
            'tipo_visita': visita.tipo_visita,
            'hoteis': [],
            'restaurantes': [],
            'pontos_turisticos': []
        }

        # Encontra todas as informações associadas a essa visita
        hoteis = Hotel.query.filter_by(codigo_visita=visita.codigo).all()
        restaurantes = Restaurante.query.filter_by(codigo_visita=visita.codigo).all()
        pontos_turisticos = PontoTuristico.query.filter_by(codigo_visita=visita.codigo).all()

        for hotel in hoteis:
            detalhes_visita['hoteis'].append({
                'nome': hotel.nome,
                'categoria': hotel.categoria,
                'imagem': hotel.imagem  # assumindo que temos um campo nome no modelo de Hotel, que é incorreto com base na estrutura atual, por favor adicione se necessário
            })

        for restaurante in restaurantes:
            detalhes_visita['restaurantes'].append({
                'nome': restaurante.nome,
                'preco_medio': restaurante.preco_medio,
                'especialidade': restaurante.especialidade,
                'categoria': restaurante.categoria,
                'imagem': restaurante.imagem
            })

        for ponto_turistico in pontos_turisticos:
            detalhes_visita['pontos_turisticos'].append({
                'nome': ponto_turistico.nome,
                'descricao': ponto_turistico.desc,
                'imagem': ponto_turistico.imagem
            })

        resultado.append(detalhes_visita)

    return jsonify(resultado), 200




@app.route('/add-visita', methods=['POST'])
def add_pacote():
    form_data = request.form.to_dict()
    print("Form Data:", form_data)
    # Lê os dados básicos da visita
    visita_nome = request.form['visita_nome']
    data_ini = request.form['data_ini']
    data_fim = request.form['data_fim']
    
    cidade_nome = request.form['cidade_nome']
    cidade_estado = request.form['cidade_estado']
    cidade_populacao = request.form['cidade_populacao']
    
    # Processa a imagem da cidade como um BLOB
    cidade_imagem = request.files.get('cidade_imagem')
    cidade_imagem_blob = cidade_imagem.read() if cidade_imagem else None  # Ou converta para Base64 se o banco exigir

    # Salva o pacote (a lógica para associar hotéis, restaurantes e pontos turísticos ao pacote pode variar)
    visita = Visita(nome=visita_nome, hora_ini=data_ini, hora_fim=data_fim)
    cidade = Cidade(nome=cidade_nome,estado=cidade_estado,populacao=cidade_populacao,imagem=cidade_imagem_blob)
    db.session.add(visita)
    db.session.add(cidade)

    hoteis_data = json.loads(request.form['hoteis'])
    restaurantes_data = json.loads(request.form['restaurantes'])
    pontos_turisticos_data = json.loads(request.form['pontosTuristicos'])

    # Processar e salvar hotéis
    for index, hotel_dado in enumerate(hoteis_data):
        categoria = hotel_dado['categoria']
        # Obter imagem associada ao hotel pelo índice
        hotel_imagem = request.files.get(f'hotel_{index}_imagem')        
        hotel_imagem_blob = hotel_imagem.read() if hotel_imagem else None
        # Criar e salvar o objeto Hotel
        hotel = Hotel(categoria=categoria, imagem=hotel_imagem_blob)
        db.session.add(hotel)

    # Processar e salvar restaurantes
    for index, restaurante_dado in enumerate(restaurantes_data):
        especialidade = restaurante_dado['especialidade']
        # Obter imagem associada ao restaurante pelo índice
        restaurante_imagem = request.files.get(f'restaurante_{index}_imagem')
        restaurante_imagem_blob = restaurante_imagem.read() if restaurante_imagem else None
        # Criar e salvar o objeto Restaurante
        restaurante = Restaurante(especialidade=especialidade, imagem=restaurante_imagem_blob)
        db.session.add(restaurante)

    # Processar e salvar pontos turísticos
    for index, ponto_turistico_dado in enumerate(pontos_turisticos_data):
        descricao = ponto_turistico_dado['desc']
        # Obter imagem associada ao ponto turístico pelo índice
        ponto_imagem = request.files.get(f'pontoTuristico_{index}_imagem')
        ponto_imagem_blob = ponto_imagem.read() if ponto_imagem else None
        # Criar e salvar o objeto PontoTuristico
        ponto_turistico = PontoTuristico(desc=descricao, imagem=ponto_imagem_blob)
        db.session.add(ponto_turistico)


    db.session.commit()  # Salva todas as alterações no banco de dados

    return jsonify({'message': 'Pacote adicionado com sucesso'}), 201


@app.route('/pacotes/reservar', methods=['POST'])
@jwt_required()
def reserve_pacote():
    data = request.get_json()
    cliente_id = get_jwt_identity()
    cliente = Cliente.query.filter_by(email=cliente_id).first()
    if cliente:
        nova_reserva = Cliente_Pacote(Cliente_codigo=cliente.codigo, Pacote_codigo=data['pacote_codigo'])
        db.session.add(nova_reserva)
        db.session.commit()
        return jsonify({'message': 'Reservation made successfully'}), 200
    return jsonify({'message': 'Customer not found'}), 404

@app.route('/reservas', methods=['GET'])
@jwt_required()
def list_reservas():
    cliente_id = get_jwt_identity()
    cliente = Cliente.query.filter_by(email=cliente_id).first()
    reservas = Cliente_Pacote.query.filter_by(Cliente_codigo=cliente.codigo).all()
    return jsonify([{'Pacote_codigo': reserva.Pacote_codigo} for reserva in reservas]), 200

@app.route('/reservas/cancelar', methods=['DELETE'])
@jwt_required()
def cancel_reserva():
    data = request.get_json()
    cliente_id = get_jwt_identity()
    cliente = Cliente.query.filter_by(email=cliente_id).first()
    Cliente_Pacote.query.filter_by(Cliente_codigo=cliente.codigo, Pacote_codigo=data['pacote_codigo']).delete()
    db.session.commit()
    return jsonify({'message': 'Reservation cancelled successfully'}), 200


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
