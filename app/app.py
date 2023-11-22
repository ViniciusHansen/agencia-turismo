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


class Cidade(db.Model):
    __tablename__ = 'Cidade'
    codigo = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String)
    estado = db.Column(db.String)
    populacao = db.Column(db.Integer)
    imagem = db.Column(db.LargeBinary)
    visita = db.relationship('Visita', backref='cidade', lazy=True)


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
    # categoria = db.Column(db.String)
    # descricao = db.Column(db.String)
    # preco_medio = db.Column(db.Float)
    


class Hotel(db.Model):
    __tablename__ = 'Hotel'
    nome = db.Column(db.String)
    codigo = db.Column(db.Integer, primary_key=True)
    categoria = db.Column(db.String)
    descricao = db.Column(db.String)
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
    nome = db.Column(db.String)
    descricao = db.Column(db.String)


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
    codigo_visita = db.Column(db.Integer, db.ForeignKey('Visita.codigo'))
    imagem = db.Column(db.LargeBinary)
    nome = db.Column(db.String)
    descricao = db.Column(db.String)

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


class Carrinho(db.Model):
    __tablename__ = 'Carrinho'
    codigo = db.Column(db.Integer, primary_key=True)
    codigo_cliente = db.Column(db.Integer, db.ForeignKey('Cliente.codigo'))
    pacotes = db.relationship('Pacote', secondary='carrinho_pacote')

class Carrinho_Pacote(db.Model):
    __tablename__ = 'carrinho_pacote'
    carrinho_codigo = db.Column(db.Integer, db.ForeignKey('Carrinho.codigo'), primary_key=True)
    pacote_codigo = db.Column(db.Integer, db.ForeignKey('Pacote.codigo'), primary_key=True)


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

@app.route('/visitas', methods=['GET'])
def get_visitas():
    # visitas = Visita.query.all()  # Obtém todas as visitas
    visitas = Visita.query.options(db.joinedload(Visita.cidade)).all()
    resultado = []

    for visita in visitas:
        # Estrutura de dados para acumular informações da visita
        cidade_info = {
            'codigo': visita.cidade.codigo,
            'nome': visita.cidade.nome,
            'estado': visita.cidade.estado,
            'populacao': visita.cidade.populacao,
            # Converte a imagem para uma string base64, se houver imagem.
            'imagem': base64.b64encode(visita.cidade.imagem).decode('utf-8') if visita.cidade.imagem else None
        }
        detalhes_visita = {
            'codigo': visita.codigo,
            'nome': visita.nome,
            'endereco': visita.endereco,
            'hora_ini': str(visita.hora_ini),
            'hora_fim': str(visita.hora_fim),
            'tipo_visita': visita.tipo_visita,
            'cidade': cidade_info,
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
                # 'categoria': hotel.categoria,
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
                'descricao': ponto_turistico.descricao,
                'imagem': ponto_turistico.imagem
            })

        resultado.append(detalhes_visita)

    return jsonify(resultado), 200

@app.route('/add-visita', methods=['POST'])
def add_visita():
    # Obtenha os dados JSON enviados no corpo da solicitação
    json_data = request.get_json()

    # Lê os dados do JSON
    visita_nome = json_data['nome']
    endereco = json_data['endereco']
    hora_ini = json_data['hora_ini']
    hora_fim = json_data['hora_fim']

    # Processa os campos selecionados
    cidade_nome = json_data.get('cidade', {}).get('value')
    cidade = Cidade.query.filter_by(nome=cidade_nome).first()
    
    restaurante = None
    pontoTuristico = None
    hotel = None

    if json_data.get('restaurante', {}) != None:
        restaurante_nome = json_data.get('restaurante', {}).get('value')
        restaurante = Restaurante.query.filter_by(nome=restaurante_nome).first()

    if json_data.get('pontoTuristico', {}) != None:
        pontoTuristico_nome = json_data.get('pontoTuristico', {}).get('value')
        pontoTuristico = PontoTuristico.query.filter_by(nome=pontoTuristico_nome).first()

    if json_data.get('hotel', {}) != None:
        hotel_nome = json_data.get('hotel', {}).get('value')
        hotel = Hotel.query.filter_by(nome=hotel_nome).first()

    # Crie a visita no banco de dados
    nova_visita = Visita(
        nome=visita_nome,
        endereco=endereco,
        hora_ini=hora_ini,
        hora_fim=hora_fim,
        cidade=cidade
    )

    db.session.add(nova_visita)
    db.session.commit()

    # Adicione o código da visita ao hotel, restaurante ou ponto turístico
    if restaurante:
        restaurante.codigo_visita = nova_visita.codigo
        db.session.commit()

    if pontoTuristico:
        pontoTuristico.codigo_visita = nova_visita.codigo
        db.session.commit()

    if hotel:
        hotel.codigo_visita = nova_visita.codigo
        db.session.commit()

    return jsonify({'message': 'Visita cadastrada com sucesso'}), 201


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

@app.route('/hoteis', methods=['GET'])
def get_hoteis():
    hoteis = Hotel.query.all()
    return jsonify([{'nome': hotel.nome, 'categoria': hotel.categoria, 'descricao': hotel.descricao} for hotel in hoteis]), 200

@app.route('/restaurantes', methods=['GET'])
def get_restaurantes():
    restaurantes = Restaurante.query.all()
    return jsonify([{'nome': restaurante.nome, 'especialidade': restaurante.especialidade, 'preco_medio': restaurante.preco_medio} for restaurante in restaurantes]), 200

@app.route('/pontos-turisticos', methods=['GET'])
def get_pontos_turisticos():
    pontos_turisticos = PontoTuristico.query.all()
    return jsonify([{'nome': ponto_turistico.nome, 'descricao': ponto_turistico.descricao} for ponto_turistico in pontos_turisticos]), 200

@app.route('/cidades', methods=['GET'])
def get_cidades():
    cidades = Cidade.query.all()
    return jsonify([{'nome': cidade.nome, 'estado': cidade.estado, 'populacao': cidade.populacao} for cidade in cidades]), 200

@app.route('/add-cidade', methods=['POST'])
def add_cidade():
    nome = request.form.get('nome')
    estado = request.form.get('estado')
    populacao = request.form.get('populacao')
    imagem = request.files['imagem'] if 'imagem' in request.files else None

    if nome and estado and populacao:
        # Processar a imagem da cidade como um BLOB
        imagem_blob = imagem.read() if imagem else None  # Ou converta para Base64 se o banco exigir

        nova_cidade = Cidade(nome=nome, estado=estado, populacao=populacao, imagem=imagem_blob)
        db.session.add(nova_cidade)
        db.session.commit()
        return jsonify({'message': 'Cidade adicionada com sucesso'}), 201
    else:
        return jsonify({'message': 'Campos obrigatórios não preenchidos'}), 400


@app.route('/add-hotel', methods=['POST'])
def add_hotel():
    nome = request.form.get('nome')
    categoria = request.form.get('categoria')
    descricao = request.form.get('descricao')
    imagem = request.files['imagem'] if 'imagem' in request.files else None

    if nome and categoria and descricao:
        novo_hotel = Hotel(nome=nome, categoria=categoria, descricao=descricao, imagem=imagem)
        db.session.add(novo_hotel)
        db.session.commit()
        return jsonify({'message': 'Hotel cadastrado com sucesso'}), 201
    else:
        return jsonify({'message': 'Campos obrigatórios não preenchidos'}), 400

def get_codigo(email_usuario):
    cliente = Cliente.query.filter_by(email=email_usuario).first()
    if cliente:
        return cliente.codigo


@app.route('/api/checkout', methods=['POST'])
def checkout():
    data = request.json
    itens = data['itens']
    usuario = data['usuario']


    # Criar um novo pacote (ajuste de acordo com seus campos e lógica)
    novo_pacote = Pacote(valor=5000)
    db.session.add(novo_pacote)
    db.session.flush()  # Para obter o código do pacote antes do commit

    # Associar cada item do carrinho ao pacote
    for item in itens:
        pacote_visita = Pacote_Visita(Pacote_codigo=novo_pacote.codigo, Visita_codigo=item['codigo'])
        db.session.add(pacote_visita)

    # Associar pacote ao cliente (ajuste conforme necessário)
    cliente_pacote = Cliente_Pacote(Cliente_codigo=get_codigo(usuario), Pacote_codigo=novo_pacote.codigo)
    db.session.add(cliente_pacote)

    db.session.commit()

    return jsonify({"pacoteCodigo": novo_pacote.codigo}), 200





# #######################################    
# testar
# @app.route('/add-hotel', methods=['POST'])
# def add_hotel():
#     nome = request.form.get('nome')
#     categoria = request.form.get('categoria')
#     descricao = request.form.get('descricao')
#     imagem = request.files['imagem'] if 'imagem' in request.files else None

#     if nome and categoria and descricao:
#         # Converter a imagem para um fluxo de bytes
#         imagem_blob = imagem.read() if imagem else None

#         novo_hotel = Hotel(nome=nome, categoria=categoria, descricao=descricao, imagem=imagem_blob)
#         db.session.add(novo_hotel)
#         db.session.commit()
#         return jsonify({'message': 'Hotel cadastrado com sucesso'}), 201
#     else:
#         return jsonify({'message': 'Campos obrigatórios não preenchidos'}), 400

    

@app.route('/add-restaurante', methods=['POST'])
def add_restaurante():
    nome = request.form.get('nome')
    especialidade = request.form.get('especialidade')
    preco_medio = request.form.get('preco_medio')
    categoria = request.form.get('categoria')
    descricao = request.form.get('descricao')
    imagem = request.files['imagem'] if 'imagem' in request.files else None

    if nome and especialidade and preco_medio and categoria and descricao:
        novo_restaurante = Restaurante(nome=nome, especialidade=especialidade, preco_medio=preco_medio,
                                       categoria=categoria, descricao=descricao, imagem=imagem)
        db.session.add(novo_restaurante)
        db.session.commit()
        return jsonify({'message': 'Restaurante cadastrado com sucesso'}), 201
    else:
        return jsonify({'message': 'Campos obrigatórios não preenchidos'}), 400

@app.route('/add-ponto-turistico', methods=['POST'])
def add_ponto_turistico():
    nome = request.form.get('nome')
    descricao = request.form.get('descricao')
    imagem = request.files['imagem'] if 'imagem' in request.files else None

    if nome and descricao:
        novo_ponto_turistico = PontoTuristico(nome=nome, descricao=descricao, imagem=imagem)
        db.session.add(novo_ponto_turistico)
        db.session.commit()
        return jsonify({'message': 'Ponto turístico cadastrado com sucesso'}), 201
    else:
        return jsonify({'message': 'Campos obrigatórios não preenchidos'}), 400


@app.route('/carrinho/add', methods=['POST'])
@jwt_required()
def add_to_carrinho():
    data = request.get_json()
    cliente_id = get_jwt_identity()
    cliente = Cliente.query.filter_by(email=cliente_id).first()

    if cliente:
        carrinho = Carrinho.query.filter_by(codigo_cliente=cliente.codigo).first()
        if not carrinho:
            carrinho = Carrinho(codigo_cliente=cliente.codigo)
            db.session.add(carrinho)
        
        pacote = Pacote.query.get(data['pacote_codigo'])
        if pacote and pacote not in carrinho.pacotes:
            carrinho.pacotes.append(pacote)
            db.session.commit()
            return jsonify({'message': 'Pacote added to cart'}), 200
        return jsonify({'message': 'Package not found or already in cart'}), 404
    return jsonify({'message': 'Customer not found'}), 404


@app.route('/carrinho/remove', methods=['POST'])
@jwt_required()
def remove_from_carrinho():
    data = request.get_json()
    cliente_id = get_jwt_identity()
    cliente = Cliente.query.filter_by(email=cliente_id).first()

    if cliente:
        carrinho = Carrinho.query.filter_by(codigo_cliente=cliente.codigo).first()
        if carrinho:
            pacote = Pacote.query.get(data['pacote_codigo'])
            if pacote and pacote in carrinho.pacotes:
                carrinho.pacotes.remove(pacote)
                db.session.commit()
                return jsonify({'message': 'Pacote removed from cart'}), 200
            return jsonify({'message': 'Package not found in cart'}), 404
        return jsonify({'message': 'Cart not found'}), 404
    return jsonify({'message': 'Customer not found'}), 404


@app.route('/carrinho/view', methods=['GET'])
@jwt_required()
def view_carrinho():
    cliente_id = get_jwt_identity()
    cliente = Cliente.query.filter_by(email=cliente_id).first()

    if cliente:
        carrinho = Carrinho.query.filter_by(codigo_cliente=cliente.codigo).first()
        if carrinho:
            pacotes = [{'codigo': p.codigo, 'nome': p.nome, 'valor': p.valor} for p in carrinho.pacotes]
            return jsonify({'pacotes': pacotes}), 200
        return jsonify({'message': 'No cart found'}), 404
    return jsonify({'message': 'Customer not found'}), 404


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
