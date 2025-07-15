# Имитация чтения датчиков
import random
from datetime import datetime

def collect_all_data():
    return {
        "timestamp": datetime.now().isoformat(),
        "temperature": round(random.uniform(15.0, 30.0), 2),
        "ph": round(random.uniform(6.0, 9.0), 2),
        "turbidity": round(random.uniform(0.0, 100.0), 2)
    }