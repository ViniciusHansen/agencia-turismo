from flask import Blueprint, request, flash, redirect, url_for, render_template
from werkzeug.security import generate_password_hash, check_password_hash
from models import Cliente



main = Blueprint('main', __name__)
from database import db

@main.route('/success', methods=['GET', 'POST'])
def hello():
    return 'Hello, World!'

@main.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form['username']
        senha_hash = request.form['password']

        hashed_password = generate_password_hash(senha_hash, method='sha256')

        new_user = Cliente(email=email, senha_hash=hashed_password)
        db.session.add(new_user)  # Use db.session
        db.session.commit()  # Use db.session

        flash('Registration successful! Please login.', category='success')

        return redirect(url_for('main.login'))

    return render_template('signup.html')


@main.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['username']
        senha_hash = request.form['password']
        user = Cliente.query.filter_by(email=email).first()

        if user and check_password_hash(user.senha_hash, senha_hash):
            flash('Logged in successfully!', category='success')
            #return redirect(url_for('main.success'))
        else:
            flash('Login Unsuccessful. Please check username and password',
                  category='error')

    return render_template('login.html')
