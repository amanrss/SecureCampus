import numpy as np
import cv2
from .face_service import engine
from .db_service import log_match, is_on_watchlist, get_watchlist_entry

async def perform_recognition(image_data: bytes, camera_id: str):
    """
    Performs face recognition logic and returns results without sending websockets.
    Returns a tuple: (recognition_result, alert_data)
    """
    img_np = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
    if img is None:
        return None, None

    emb = engine.embed_bgr(img)
    if emb is None:
        log_match("Unknown", 0.0, camera_id)
        return {"status": "no_face", "camera_id": camera_id}, None

    meta, dist = engine.match(emb)
    if meta is None:
        log_match("Unknown", 0.0, camera_id)
        return {"status": "unknown", "distance": dist, "camera_id": camera_id}, None

    confidence = float(1.0 - dist) if dist <= 1.0 else 0.0
    log_match(meta["name"], confidence, camera_id, matched_image=meta.get("image_path"))

    recognition_result = {
        "status": "success",
        "name": meta["name"],
        "role": meta.get("role", ""),
        "confidence": confidence,
        "camera_id": camera_id
    }

    alert_data = None
    face_id = meta.get("id")
    if face_id and is_on_watchlist(face_id):
        watchlist_details = get_watchlist_entry(face_id)
        alert_data = {
            "name": meta["name"],
            "role": meta.get("role", ""),
            "confidence": confidence,
            "camera_id": camera_id,
            "image_path": meta.get("image_path"),
            "reason": watchlist_details.get("reason", "No reason specified"),
            "threat_level": watchlist_details.get("threat_level", "info")
        }
    
    return recognition_result, alert_data