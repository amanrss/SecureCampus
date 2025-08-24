from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
from fastapi.staticfiles import StaticFiles

# Import 'sio' from the socket_manager
from .socket_manager import sio 
# Import config variables
from .config import ALLOW_ORIGINS, REGISTER_DIR
# Import all the routers
from .routes.faces import router as faces_router
from .routes.recognize import router as recognize_router
from .routes.logs import router as logs_router
from .routes.watchlist import router as watchlist_router
# Import the face engine service
from .services.face_service import engine


# 1. Create the FastAPI app instance
app = FastAPI(title="SecureCampus 2.0 Backend", version="1.0")

# 2. Mount the static directory for serving registered face images
app.mount(f"/{REGISTER_DIR}", StaticFiles(directory=REGISTER_DIR), name="registered_faces")

# 3. Add CORS Middleware
origins = [ALLOW_ORIGINS] if ALLOW_ORIGINS != "*" else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Define startup event
@app.on_event("startup")
def startup_event():
    engine.load()

# 5. Include all the API routers
app.include_router(faces_router)
app.include_router(recognize_router)
app.include_router(logs_router)
app.include_router(watchlist_router)

# 6. Define a root endpoint (optional but good practice)
@app.get("/")
def root():
    return {"msg": "SecureCampus Backend Running"}

# 7. Create the final combined ASGI app
# This is the master app that directs traffic to Socket.IO or FastAPI
combined_app = socketio. ASGIApp(sio, other_asgi_app=app)