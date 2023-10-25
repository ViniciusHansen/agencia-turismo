from werkzeug.security import generate_password_hash, check_password_hash
from database import db


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
    hotel_associado = db.Column(db.Integer, db.ForeignKey('Hotel.codigo_visita'))
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
