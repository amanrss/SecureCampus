from pymongo import MongoClient
from .config import MONGO_URI, DB_NAME

client = MongoClient(
    MONGO_URI,
    serverSelectionTimeoutMS=10000
)
db = client[DB_NAME]
faces_col = db["faces"]
logs_col = db["logs"]
