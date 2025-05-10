from flask import Flask, request, jsonify, session, redirect, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
import json

app = Flask(__name__)
CORS(app)
app.secret_key = 'your_very_secret_key_123!'

# Настройка SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(app)

# Модель пользователя
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# Создание таблицы при первом запуске
with app.app_context():
    db.create_all()

# Фронтенд путь
app.config['FRONTEND_FOLDER'] = os.path.join(os.path.dirname(__file__), 'frontend')

@app.route('/')
def serve_index():
    return send_from_directory(app.config['FRONTEND_FOLDER'], 'index.html')

@app.route('/main')
def serve_main():
    if 'user' not in session:
        return redirect('/')
    return send_from_directory(app.config['FRONTEND_FOLDER'], 'main.html')

@app.route('/process')
def serve_process():
    if 'user' not in session:
        return redirect('/')
    return send_from_directory(app.config['FRONTEND_FOLDER'], 'process.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect('/')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.config['FRONTEND_FOLDER'], path)

# 📅 Регистрация
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    login = data.get('login')
    password = data.get('password')

    if not login or not password:
        return jsonify({'status': 'fail', 'message': 'Заполните все поля'})

    if User.query.filter_by(login=login).first():
        return jsonify({'status': 'fail', 'message': 'Пользователь уже существует'})

    hashed_password = generate_password_hash(password)
    user = User(login=login, password=hashed_password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'status': 'success'})

# 🔑 Вход
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    login_input = data.get('login')
    password_input = data.get('password')

    user = User.query.filter_by(login=login_input).first()
    if user and check_password_hash(user.password, password_input):
        session['user'] = user.login
        return jsonify({'status': 'success'})
    return jsonify({'status': 'fail', 'message': 'Неверный логин или пароль'})

# 📁 Получение задач
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    if 'user' not in session:
        return jsonify({'status': 'fail', 'message': 'Не авторизован'}), 403

    # Проверяем, существует ли файл и не пуст ли он
    if not os.path.exists('tasks.json') or os.path.getsize('tasks.json') == 0:
        return jsonify({'status': 'success', 'tasks': []})

    try:
        with open('tasks.json', 'r', encoding='utf-8') as f:
            all_tasks = json.load(f)
    except json.JSONDecodeError:
        all_tasks = {}

    user_tasks = all_tasks.get(session['user'], [])
    return jsonify({'status': 'success', 'tasks': user_tasks})

# 🔄 Сохранение задач
@app.route('/api/tasks', methods=['POST'])
def save_tasks():
    if 'user' not in session:
        return jsonify({'status': 'fail', 'message': 'Не авторизован'}), 403

    data = request.get_json()
    tasks = data.get('tasks', [])

    try:
        # Проверяем, существует ли файл и не пуст ли он
        if not os.path.exists('tasks.json') or os.path.getsize('tasks.json') == 0:
            all_tasks = {}
        else:
            with open('tasks.json', 'r', encoding='utf-8') as f:
                all_tasks = json.load(f)
    except json.JSONDecodeError:
        all_tasks = {}

    # Обновляем задачи для текущего пользователя
    all_tasks[session['user']] = tasks

    with open('tasks.json', 'w', encoding='utf-8') as f:
        json.dump(all_tasks, f, ensure_ascii=False, indent=2)

    return jsonify({'status': 'success'})



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
