from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Time, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Pacote(Base):
    __tablename__ = 'Pacote'
    codigo = Column(Integer, primary_key=True)
    valor = Column(Float)
    data_ini = Column(Date)
    data_fim = Column(Date)


class Cidade(Base):
    __tablename__ = 'Cidade'
    codigo = Column(Integer, primary_key=True)
    nome = Column(String)
    estado = Column(String)
    populacao = Column(Integer)


class TipoVisita(Base):
    __tablename__ = 'Tipo Visita'
    codigo = Column(Integer, primary_key=True)
    nome = Column(String)


class Visita(Base):
    __tablename__ = 'Visita'
    codigo = Column(Integer, primary_key=True)
    nome = Column(String)
    endereco = Column(String)
    datahora_ini = Column(DateTime)
    datahora_fim = Column(DateTime)
    tipo_visita = Column(Integer, ForeignKey('Tipo Visita.codigo'))
    codigo_cidade = Column(Integer, ForeignKey('Cidade.codigo'))


class Hotel(Base):
    __tablename__ = 'Hotel'
    categoria = Column(String)
    codigo_visita = Column(Integer, ForeignKey(
        'Visita.codigo'), primary_key=True)


class Restaurante(Base):
    __tablename__ = 'Restaurante'
    codigo = Column(Integer, primary_key=True)
    especialidade = Column(String)
    preco_medio = Column(Float)
    categoria = Column(String)
    codigo_visita = Column(Integer, ForeignKey('Visita.codigo'))
    hotel_associado = Column(Integer, ForeignKey('Hotel.codigo_visita'))
    casa_de_show_associada = Column(Integer)


class Quarto(Base):
    __tablename__ = 'Quarto'
    codigo = Column(Integer, primary_key=True)
    nome = Column(String)
    valor = Column(Float)
    tipo = Column(String)
    codigo_hotel = Column(Integer, ForeignKey('Hotel.codigo_visita'))


class PontoTuristico(Base):
    __tablename__ = 'Ponto Turistico'
    codigo = Column(Integer, primary_key=True)
    desc = Column(String)
    codigo_visita = Column(Integer, ForeignKey('Visita.codigo'))


class CasaDeShow(Base):
    __tablename__ = 'Casa de Show'
    codigo = Column(Integer, primary_key=True)
    hora_ini = Column(Time)
    hora_fim = Column(Time)
    dia_fecha = Column(String)
    codigo_pontoturistico = Column(
        Integer, ForeignKey('Ponto Turistico.codigo'))


class Museu(Base):
    __tablename__ = 'Museu'
    codigo = Column(Integer, primary_key=True)
    data_funda = Column(Date)
    n_salas = Column(Integer)
    codigo_pontoturistico = Column(
        Integer, ForeignKey('Ponto Turistico.codigo'))
    codigo_fundador = Column(Integer)


class Fundador(Base):
    __tablename__ = 'Fundador'
    codigo = Column(Integer, primary_key=True)
    nome = Column(String)
    data_nasc = Column(Date)
    data_obito = Column(Date)
    trabalho = Column(String)
    nacionalidade = Column(String)


class Igreja(Base):
    __tablename__ = 'Igreja'
    codigo = Column(Integer, primary_key=True)
    data_const = Column(Date)
    estilo = Column(String)
    codigo_pontoturistico = Column(
        Integer, ForeignKey('Ponto Turistico.codigo'))


class Cliente(Base):
    __tablename__ = 'Cliente'
    codigo = Column(Integer, primary_key=True)
    nome = Column(String)
    endereco = Column(String)
    fone = Column(String)


class PessoaFisica(Base):
    __tablename__ = 'Pessoa Fisica'
    cpf = Column(String, primary_key=True)
    codigo_cliente = Column(Integer, ForeignKey('Cliente.codigo'))


class PessoaJuridica(Base):
    __tablename__ = 'Pessoa Juridica'
    cnpj = Column(String, primary_key=True)
    codigo_cliente = Column(Integer, ForeignKey('Cliente.codigo'))


class Cliente_Pacote(Base):
    __tablename__ = 'Cliente_Pacote'
    Cliente_codigo = Column(Integer, ForeignKey(
        'Cliente.codigo'), primary_key=True)
    Pacote_codigo = Column(Integer, ForeignKey(
        'Pacote.codigo'), primary_key=True)


class Pacote_Visita(Base):
    __tablename__ = 'Pacote_Visita'
    Pacote_codigo = Column(Integer, ForeignKey(
        'Pacote.codigo'), primary_key=True)
    Visita_codigo = Column(Integer, ForeignKey(
        'Visita.codigo'), primary_key=True)
    datahora_ini = Column(DateTime)
    datahora_fim = Column(DateTime)





