from flask import Flask, request, jsonify
import pickle
import pandas as pd

# ------------------ Настройка модели ------------------
PARAMETERS_LIST = ["N", "P", "K", "ph", "temperature", "humidity", "rainfall", "Zn", "S"]

class Culture():
    def __init__(self, calories_per_kg):
        self.calories_per_kg = calories_per_kg

CULTURES = ["Maize", "Potato", "Wheat", "Barley", "Bean", "Pea"]
NEEDED_CALORIES_PER_DAY = 3200
CULTURES_DATAS = {
    "Maize": Culture(3650),
    "Potato": Culture(700),
    "Wheat": Culture(3300),
    "Barley": Culture(3540),
    "Bean": Culture(3300),
    "Pea": Culture(3300)
}
CULTURE_EN_TO_RU = {
    "Maize": "Кукуруза",
    "Potato": "Картофель",
    "Wheat": "Пшеница",
    "Barley": "Ячмень",
    "Bean": "Фасоль",
    "Pea": "Горох"
}

MODEL_FILE = './backend/crop_yield_model.pkl'
with open(MODEL_FILE, 'rb') as f:
    model_data = pickle.load(f)

MODEL = model_data['model']
SCALER = model_data['scaler']
LABEL_ENCODER = model_data['label_encoder']
FEATURES = model_data['features']

# ------------------ Вспомогательные функции ------------------
def _predictProductivityOfCulture(culture: str, args={}):
    new_data = pd.DataFrame({
        'N': [args["N"]],
        'P': [args["P"]],
        'K': [args["K"]],
        'ph': [args["ph"]],
        'temperature': [args["temperature"]],
        'humidity': [args["humidity"]],
        'rainfall': [args["rainfall"]],
        'Zn': [args["Zn"]],
        'S': [args["S"]],
        'original_crop': [culture]
    })
    new_data['crop_encoded'] = LABEL_ENCODER.transform(new_data['original_crop'])
    X_new_scaled = SCALER.transform(new_data[FEATURES])
    predictions = MODEL.predict(X_new_scaled)
    return predictions[0]

def predictProductivity(mode: str, depParam: dict, args={}):
    result = {"cultures": [], "total": 0}
    for culture in CULTURES:
        productivity = _predictProductivityOfCulture(culture, args)
        value = 0

        if mode == "FARM":
            price = depParam.get(culture, {}).get("price", 0)
            value = productivity * price * 1000 # цена за тонну, а продуктивность в тоннах с гектара
        elif mode == "STATION":
            peopleNumber = depParam["peopleNumber"]
            square = depParam["square"]
            neededCalories = NEEDED_CALORIES_PER_DAY * peopleNumber
            productivityKgM2 = productivity / 10
            totalCalories = productivityKgM2 * square * CULTURES_DATAS[culture].calories_per_kg
            days = totalCalories / neededCalories
            productivity = productivityKgM2
            value = days # количество дней, на которое хватит урожая

        tmp = {
            "culture": culture,
            "cultureRu": CULTURE_EN_TO_RU[culture],
            "productivity": productivity,
            "value": value
        }
        result["cultures"].append(tmp)
        result["total"] += value

    result["cultures"] = sorted(result["cultures"], key=lambda x: x["value"], reverse=True)
    return result

# ------------------ Flask сервер ------------------
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        mode = data.get("mode")
        depParam = data.get("depParam", {})
        args = data.get("args", {})

        if not mode:
            return jsonify({"error": "Missing required field: mode"}), 400

        result = predictProductivity(mode, depParam, args)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
