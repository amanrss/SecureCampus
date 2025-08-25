import os, uuid, cv2, numpy as np
from pathlib import Path
from typing import Optional, Tuple, List, Dict
from ..config import REGISTER_DIR, MATCH_THRESHOLD
from ..services.db_service import get_all_embeddings
import logging

# MODIFIED: We will now only use insightface
import insightface
from insightface.app import FaceAnalysis

class FaceEngine:
    def __init__(self):
        self.app = FaceAnalysis(name="buffalo_l")
        self.app.prepare(ctx_id=0, det_size=(640, 640))
        self.cache = None
        self.meta = []

    def load(self):
        self.refresh_cache()

    def refresh_cache(self):
        items = get_all_embeddings()
        self.meta = items
        if len(items) == 0:
            self.cache = None
        else:
            vecs = [np.array(x.get("embedding", []), dtype=np.float32) for x in items]
            vecs = [v / (np.linalg.norm(v) + 1e-9) for v in vecs]
            self.cache = np.vstack(vecs)

    def embed_bgr(self, img_bgr: np.ndarray) -> Optional[np.ndarray]:
        faces = self.app.get(img_bgr)
        if not faces:
            return None
        f = max(faces, key=lambda x: x.bbox[2]*x.bbox[3])
        emb = f.normed_embedding
        return emb.astype(np.float32)

    def match(self, query_emb: np.ndarray) -> Tuple[Optional[Dict], float]:
        if self.cache is None or query_emb is None:
            return None, 1.0
        q = query_emb.reshape(1, -1)
        from sklearn.metrics.pairwise import cosine_similarity
        sims = cosine_similarity(q, self.cache)[0]
        best_idx = int(np.argmax(sims))
        best_sim = float(sims[best_idx])
        dist = 1.0 - best_sim
        if dist <= MATCH_THRESHOLD:
            return self.meta[best_idx], dist
        return None, dist

engine = FaceEngine()

# The rest of the file is unchanged
def ensure_dirs():
    Path(REGISTER_DIR).mkdir(parents=True, exist_ok=True)

def save_image(name: str, img_bgr: np.ndarray) -> str:
    person_dir = Path(REGISTER_DIR) / name
    person_dir.mkdir(parents=True, exist_ok=True)
    fname = f"{uuid.uuid4().hex}.jpg"
    out = person_dir / fname
    cv2.imwrite(str(out), img_bgr)
    return str(out)