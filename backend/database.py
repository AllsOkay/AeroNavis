import sqlite3

def init_db():
    conn = sqlite3.connect('data/samples.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS samples (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            lat REAL,
            lon REAL,
            temperature REAL,
            ph REAL,
            turbidity REAL
        )
    ''')
    conn.commit()
    conn.close()

def save_data(data):
    conn = sqlite3.connect('data/samples.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO samples (timestamp, lat, lon, temperature, ph, turbidity)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        data['timestamp'],
        data['lat'], data['lon'],
        data['temperature'], data['ph'], data['turbidity']
    ))
    conn.commit()
    conn.close()