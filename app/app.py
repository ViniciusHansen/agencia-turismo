from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from routes import main
from database import db

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@db:5432/agencia_turismo'
    app.config['SECRET_KEY'] = 'GnXKv7!AV$hnjmgslOOHnElvbg7x24jbl&BvFEt^BJPNe&Uf4'

    db.init_app(app)

    app.register_blueprint(main)

    return app
