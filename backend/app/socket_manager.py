import socketio
import base64
from .services.recognition_logic import perform_recognition

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")

@sio.event
async def connect(sid, environ):
    print(f"Socket.IO client connected: {sid}")

@sio.on('process_frame')
async def process_frame(sid, data):
    # --- DEBUG PRINT 1 ---
    print(f"Received 'process_frame' event from sid: {sid} for camera: {data.get('camera_id')}")
    try:
        header, encoded = data['frame'].split(",", 1)
        image_data = base64.b64decode(encoded)
        camera_id = data['camera_id']
        
        # --- DEBUG PRINT 2 ---
        print(f"[{camera_id}] Image decoded, starting recognition...")
        recognition_result, alert_data = await perform_recognition(image_data, camera_id)
        # --- DEBUG PRINT 3 ---
        print(f"[{camera_id}] Recognition finished. Result: {recognition_result}, Alert: {alert_data is not None}")

        if recognition_result:
            await sio.emit('recognition_result', recognition_result, to=sid)

        if alert_data:
            event_name = 'critical_alert' if alert_data.get("threat_level") == "critical" else 'watchlist_alert'
            await sio.emit(event_name, alert_data)
        
        # --- DEBUG PRINT 4 ---
        print(f"[{camera_id}] Finished emitting results.")

    except Exception as e:
        print(f"!!!!!! ERROR processing frame for sid {sid}: {e} !!!!!!")

@sio.event
async def disconnect(sid):
    print(f"Socket.IO client disconnected: {sid}")