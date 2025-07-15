# Пример использования PyBluez или PyGATT для BLE-связи
import bluetooth

def receive_target_point():
    server_sock = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
    server_sock.bind(("", bluetooth.PORT_ANY))
    server_sock.listen(1)

    port = server_sock.getsockname()[1]
    bluetooth.advertise_service(server_sock, "BoatTarget", service_id="0000110A-0000-1000-8000-00805F9B34FB")

    print("Ожидание подключения...")
    client_sock, address = server_sock.accept()
    print(f"Подключено: {address}")

    data = client_sock.recv(1024)
    client_sock.close()
    return eval(data.decode())