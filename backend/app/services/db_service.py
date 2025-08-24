from datetime import datetime
from typing import List, Dict, Any
# MODIFIED: Ensure 'db' is imported correctly along with the collections
from ..database import db, faces_col, logs_col
from bson.objectid import ObjectId

# This line will now work because 'db' is imported
watchlist_col = db["watchlist"]

# --- Original Functions (Untouched) ---
def insert_face_doc(doc: Dict[str, Any]) -> str:
    res = faces_col.insert_one(doc)
    return str(res.inserted_id)

def list_faces() -> List[Dict[str, Any]]:
    docs = list(faces_col.find({}, {"embedding": 0}))
    for d in docs:
        d["id"] = str(d["_id"])
        d.pop("_id", None)
    return docs

def get_all_embeddings() -> List[Dict[str, Any]]:
    items = list(faces_col.find({}, {"embedding": 1, "name": 1, "role": 1, "image_path": 1}))
    for it in items:
        it["id"] = str(it["_id"])
        it.pop("_id", None)
    return items

def delete_face_by_id(face_id: str) -> int:
    res = faces_col.delete_one({"_id": ObjectId(face_id)})
    return res.deleted_count

def update_face(face_id: str, update: Dict[str, Any]):
    res = faces_col.update_one({"_id": ObjectId(face_id)}, {"$set": update})
    return res.modified_count

def log_match(name: str, confidence: float, camera_id: str = "default", matched_image: str = None):
    logs_col.insert_one({
        "name": name,
        "confidence": float(confidence) if confidence is not None else None,
        "camera_id": camera_id,
        "timestamp": datetime.utcnow(),
        "matched_image": matched_image
    })

def get_logs(limit: int = 100):
    docs = list(logs_col.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit))
    return docs

# --- New Watchlist Functions (Untouched) ---
def add_to_watchlist(entry: Dict[str, Any]):
    watchlist_col.insert_one(entry)

def get_watchlist() -> List[Dict[str, Any]]:
    docs = list(watchlist_col.find({}, {"_id": 0}))
    return docs

def remove_from_watchlist(face_id: str) -> int:
    res = watchlist_col.delete_one({"face_id": face_id})
    return res.deleted_count

def is_on_watchlist(face_id: str) -> bool:
    return watchlist_col.count_documents({"face_id": face_id}) > 0

def get_watchlist_entry(face_id: str) -> Dict[str, Any]:
    return watchlist_col.find_one({"face_id": face_id}, {"_id": 0})