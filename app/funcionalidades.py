from models import Cliente
from sqlalchemy import create_engine
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

def create_session():
    engine = create_engine(
        'postgresql://postgres:postgres@db:5432/agencia_turismo')
    Session = sessionmaker(bind=engine)
    return Session()



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
