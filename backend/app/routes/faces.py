from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import numpy as np, cv2
from ..services.face_service import engine, ensure_dirs, save_image
# MODIFIED: Import watchlist service
from ..services.db_service import insert_face_doc, list_faces, delete_face_by_id, update_face, remove_from_watchlist

router = APIRouter(prefix="/faces", tags=["faces"])

@router.post("/register")
async def register_face(name: str = Form(...), role: str = Form(""), file: UploadFile = File(...)):
    # ... (this function is unchanged)
    data = await file.read()
    img_np = np.frombuffer(data, np.uint8)
    img = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image")

    emb = engine.embed_bgr(img)
    if emb is None:
        raise HTTPException(status_code=422, detail="No face detected")

    ensure_dirs()
    image_path = save_image(name, img)

    doc = {
        "name": name,
        "role": role,
        "image_path": image_path,
        "embedding": emb.tolist()
    }
    _id = insert_face_doc(doc)
    engine.refresh_cache()
    return {"status": "ok", "id": _id, "name": name, "role": role}

@router.get("/list")
def faces_list():
    # ... (this function is unchanged)
    return {"faces": list_faces()}

# MODIFIED: Update the delete function to also remove from watchlist
@router.delete("/{face_id}")
def faces_delete(face_id: str):
    # Also remove from watchlist if they exist there
    remove_from_watchlist(face_id)
    
    deleted_count = delete_face_by_id(face_id)
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Face ID not found")
        
    engine.refresh_cache()
    return {"deleted": deleted_count}


@router.put("/{face_id}")
def faces_update(face_id: str, name: str = Form(...), role: str = Form(...)):
    # This endpoint is slightly modified to use Form for consistency
    update_data = {
        "name": name,
        "role": role
    }
    updated_count = update_face(face_id, update_data)
    if updated_count == 0:
        raise HTTPException(status_code=404, detail="Face ID not found")

    engine.refresh_cache()
    return {"status": "ok", "updated_count": updated_count}