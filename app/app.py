from flask import request, flash, redirect, url_for, render_template
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import create_engine
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

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
    datahora_ini = db.Column(db.DateTime)
    datahora_fim = db.Column(db.DateTime)
    tipo_visita = db.Column(db.Integer, db.ForeignKey('Tipo Visita.codigo'))
    codigo_cidade = db.Column(db.Integer, db.ForeignKey('Cidade.codigo'))


class Hotel(db.Model):
    __tablename__ = 'Hotel'
    categoria = db.Column(db.String)
    codigo_visita = db.Column(db.Integer, db.ForeignKey(
        'Visita.codigo'), primary_key=True)
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


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = Cliente.query.filter_by(email=data['username']).first()
    pw = data['password']  # Mudança aqui
    if user and check_password_hash(user.senha_hash, pw):
        access_token = create_access_token(identity=user.email)
        return jsonify({'access_token': access_token}), 200
    return jsonify({'message': 'Invalid credentials'}), 401


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
