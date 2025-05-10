from flask import Flask, request, jsonify, send_from_directory, redirect, session
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.secret_key = 'your_very_secret_key_123!'

# Конфигурация
app.config.update({
    'FRONTEND_FOLDER': os.path.join(os.path.dirname(__file__), 'frontend'),
    'ALLOWED_EXTENSIONS': {'xls', 'xlsx'}
})

# Маршруты
@app.route('/')
def serve_index():
    return send_from_directory(app.config['FRONTEND_FOLDER'], 'index.html')

@app.route('/main')
def serve_main():
    if 'user' not in session:
        return redirect('/')
    return send_from_directory(app.config['FRONTEND_FOLDER'], 'main.html')

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect('/')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.config['FRONTEND_FOLDER'], path)

# API
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    # Здесь должна быть проверка в БД
    session['user'] = data.get('email')
    return jsonify({'status': 'success'})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)