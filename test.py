# tests/test_usuarios.py
import requests

BASE = "http://localhost:3000"

def test_crear_usuario_paciente():
    body = {
        "id": "P10",
        "nombre": "Carlos",
        "rol": "paciente"
    }

    r = requests.post(f"{BASE}/usuarios", json=body)

    assert r.status_code == 201
    data = r.json()
    assert data["ok"] is True
    assert data["data"]["id"] == "P10"
    assert data["data"]["rol"] == "paciente"




