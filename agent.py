# Данный модуль сожержит функцию для общения с моделью
# Она получает параметры, которые нужно передать модели, и принимает результат - урожайность.
# Так для n культур: .
# Результат в виде:
# {
#     "cultures": {
#         "culture1": {
#            "culture": culture,
#            "cultureRu": перевод,
#            "productivity": productivity,
#            "value": стоимость урожая за гектар/на сколько хватит
#         },
#         ...
#     },
#     "total": money/days - сумма всех полей value
# }

import pickle
import pandas as pd

PARAMETERS_LIST = ["N", "P", "K", "ph", "temperature", "humidity", "rainfall", "Zn", "S"]

class Culture():
    calories_per_kg = 0
    
    def __init__(self, calories_per_kg):
        self.calories_per_kg = calories_per_kg

CULTURES = ["Maize", "Potato", "Wheat", "Barley", "Bean", "Pea"]
NEEDED_CALORIES_PER_DAY = 3200
CULTURES_DATAS: dict[str, Culture] = {
    "Maize": Culture(3650),
    "Potato": Culture(700),
    "Wheat": Culture(3300),
    "Barley": Culture(3540),
    "Bean": Culture(3300),
    "Pea": Culture(3300)
}
CULTURE_EN_TO_RU = {"Maize": "Кукуруза", "Potato": "Картофель", "Wheat": "Пшеница", "Barley": "Ячмень", "Bean": "Фасоль", "Pea": "Горох"}

MODEL_FILE = './crop_yield_model.pkl'
with open(MODEL_FILE, 'rb') as f:
    model_data = pickle.load(f)

MODEL = model_data['model']
SCALER = model_data['scaler']
LABEL_ENCODER = model_data['label_encoder']
FEATURES = model_data['features']


def _predictProductivityOfCulture(culture: str, args={}):
    # culture - культура для прогноза
    # args - 27 параметров, которые нужны модели    
    new_data = pd.DataFrame({
        'N': [args["N"]],              # Азот
        'P': [args["P"]],              # Фосфор
        'K': [args["K"]],              # Калий
        'ph': [args["ph"]],              # pH почвы
        'temperature': [args["temperature"]],    # Температура (среднее)
        'humidity': [args["humidity"]],       # Влажность
        'rainfall': [args["rainfall"]],      # Осадки (сумма)
        'Zn': [args["Zn"]],              # Цинк
        'S': [args["S"]],              # Сера
        'original_crop': [culture]  # Название культуры (НЕ закодированное)
    })
    new_data['crop_encoded'] = LABEL_ENCODER.transform(new_data['original_crop'])
    X_new_scaled = SCALER.transform(new_data[FEATURES])
    predictions = MODEL.predict(X_new_scaled)
    
    # возвращаем результат
    return predictions[0]

def predictProductivity(mode: str, depParam: dict, args={}):
    # mode - режим программы: FARM или STATION
    # depParam - зависит от mode:
    #   FARM - словарь стоимостей культур за килограм с количеством кг для посева
    #   {
    #       "culture": {
    #           "price": 3, # в $
    #       },
    #       ...
    #   }
    #   STATION - peopleNumber - количество обитателей
    # args - 27 параметров, которые нужны модели
    
    result: dict = {
        "cultures": [],
        "total": 0
    }
    
    for culture in CULTURES:
        productivity = _predictProductivityOfCulture(culture, args) # т/га
        value = 0
        
        # расчёты...
        if mode == "FARM":
            price = depParam[culture]["price"]
            
            value = productivity * price * 1000 # стоимость урожая за гектар
        elif mode == "STATION":
            peopleNumber = depParam["peopleNumber"]
            square = depParam["square"]
            
            neededCalories = NEEDED_CALORIES_PER_DAY * peopleNumber # за один день для всех поселенцев
            # так как урожайность идёт на гектар и в тоннах, это для космонавтов много. Надо перевести в киллограммы на квадратный метр
            productivityKgM2 = productivity / 10
            totalCalories = productivityKgM2 * square * CULTURES_DATAS[culture].calories_per_kg 
            days = totalCalories / neededCalories # сколько дней хватит, чтобы кушать с одного кв. метра
            print(totalCalories, days)
            
            productivity = productivityKgM2
            value = days
            
        tmp = {
            "culture": culture,
            "cultureRu": CULTURE_EN_TO_RU[culture],
            "productivity": productivity,
            "value": value
        }
        
        result["cultures"].append(tmp)
        result["total"] += value
    
    # сортировка культур по value
    result["cultures"] = sorted(result["cultures"], key=lambda x: x["value"], reverse=True)
    
    return result

if __name__ == "__main__":
    import sys
    import json

    try:
        raw_input = sys.stdin.read().strip()
        if not raw_input:
            print(json.dumps({"error": "No input received"}))
            sys.exit(1)

        data = json.loads(raw_input)

        mode = data.get("mode")
        depParam = data.get("depParam", {})
        args = data.get("args", {})

        if not mode:
            raise ValueError("Missing required field: mode")

        result = predictProductivity(mode, depParam, args)
        
        print(json.dumps(result, ensure_ascii=False))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
