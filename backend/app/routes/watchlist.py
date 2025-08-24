from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional # ADDED Optional
from ..services import db_service

router = APIRouter(prefix="/watchlist", tags=["watchlist"])

class WatchlistEntry(BaseModel):
    face_id: str
    name: str
    reason: str
    threat_level: Optional[str] = 'info' # ADDED: 'info' or 'critical'

@router.post("/")
def add_to_watchlist(entry: WatchlistEntry):
    if db_service.is_on_watchlist(entry.face_id):
        raise HTTPException(status_code=400, detail="Face ID already on watchlist")
    db_service.add_to_watchlist(entry.dict())
    return {"status": "ok", "message": f"{entry.name} added to watchlist."}

# ... rest of the file is unchanged
@router.get("/")
def get_watchlist():
    return {"watchlist": db_service.get_watchlist()}

@router.delete("/{face_id}")
def remove_from_watchlist(face_id: str):
    deleted_count = db_service.remove_from_watchlist(face_id)
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="Face ID not found on watchlist")
    return {"status": "ok", "message": "Removed from watchlist."}