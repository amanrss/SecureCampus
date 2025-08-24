from fastapi import APIRouter
from ..services.db_service import get_logs
from fastapi.responses import StreamingResponse
import io, csv

router = APIRouter(prefix="/logs", tags=["logs"])

@router.get("/")
def logs_list(limit: int = 100):
    logs = get_logs(limit)
    for l in logs:
        if "timestamp" in l:
            l["timestamp"] = l["timestamp"].isoformat()
    return {"logs": logs}

@router.get("/export")
def export_csv():
    logs = get_logs(10000)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["name", "confidence", "camera_id", "timestamp", "matched_image"])
    for l in logs:
        writer.writerow([l.get("name"), l.get("confidence"), l.get("camera_id"), l.get("timestamp"), l.get("matched_image")])
    output.seek(0)
    return StreamingResponse(output, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=logs.csv"})
