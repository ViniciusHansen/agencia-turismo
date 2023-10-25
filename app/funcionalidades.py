from dados import Cliente
from sqlalchemy import create_engine
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

def setup_database():
    engine = create_engine(
        'postgresql://postgres:postgres@db:5432/agencia_turismo')

    Base.metadata.create_all(engine)

    Session = sessionmaker(bind=engine)
    session = Session()

    return session


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
