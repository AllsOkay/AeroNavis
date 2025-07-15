import gps_handler
import imu_handler
import sensor_handler
import ble_comms
import navigation
import time

def run_boat():
    print("Ожидание координат...")
    target_coords = ble_comms.receive_target_point()
    
    print(f"Цель установлена: {target_coords}")
    
    while not navigation.reached_destination(target_coords):
        current_gps = gps_handler.get_gps_data()
        heading = imu_handler.get_heading()
        navigation.update_position(current_gps, heading)
        navigation.navigate_to(target_coords)
        time.sleep(1)

    print("Лодка достигла цели. Сбор данных...")
    data = sensor_handler.collect_all_data()
    print("Данные собраны:", data)

    # Передача данных на сервер
    print("Отправка данных на сервер...")
    # TODO: реализовать HTTP-запрос к backend

run_boat()