# Пример работы с Ublox M9 через последовательный порт
import serial

def get_gps_data():
    ser = serial.Serial('/dev/ttyUSB0', baudrate=9600, timeout=1)
    line = ser.readline().decode('utf-8')
    if line.startswith('$GPGGA'):
        parts = line.split(',')
        lat = float(parts[2][:2]) + float(parts[2][2:]) / 60
        lon = float(parts[4][:3]) + float(parts[4][3:]) / 60
        return {"lat": lat, "lon": lon}
    return {"lat": 0, "lon": 0}