from flask import Flask, request, jsonify
from database import init_db, save_data

app = Flask(__name__)
init_db()

@app.route('/api/data', methods=['POST'])
def receive_data():
    data = request.json
    save_data(data)
    return jsonify({"status": "ok"}), 200

@app.route('/api/data', methods=['GET'])
def get_data():
    # TODO: реализовать выдачу данных из БД
    return jsonify({"data": []})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)