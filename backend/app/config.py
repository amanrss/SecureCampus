import os
from dotenv import load_dotenv
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "securecampus")
REGISTER_DIR = os.getenv("REGISTER_DIR", "registered_faces")
EMBEDDING_DIM = int(os.getenv("EMBEDDING_DIM", "512"))
MATCH_THRESHOLD = float(os.getenv("MATCH_THRESHOLD", "0.35"))
ALLOW_ORIGINS = os.getenv("ALLOW_ORIGINS", "*")
