from fastapi import APIRouter, UploadFile, File, Form
# Import the new logic function
from ..services.recognition_logic import perform_recognition
# Import sio to send alerts
from ..socket_manager import sio

router = APIRouter(prefix="/face", tags=["recognize"])

@router.post("/recognize")
async def recognize_face(file: UploadFile = File(...), camera_id: str = Form("default")):
    image_data = await file.read()
    
    # 1. Get results from the logic function
    recognition_result, alert_data = await perform_recognition(image_data, camera_id)

    # 2. If there's an alert, emit it
    if alert_data:
        event_name = 'critical_alert' if alert_data.get("threat_level") == "critical" else 'watchlist_alert'
        await sio.emit(event_name, alert_data)

    # 3. Return the result of the recognition
    return recognition_result