# --- STAGE 1: The Builder ---
# Use a full Python image that includes all necessary build tools
FROM python:3.11 as builder

# Set the working directory
WORKDIR /app

# Install system-level dependencies required for compiling dlib and opencv
# This is the crucial step that fixes the build errors
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy only the requirements file
COPY requirements.txt .

# Install all Python packages into a dedicated folder
# This will compile insightface and dlib successfully
RUN pip install --no-cache-dir --prefix="/install" -r requirements.txt


# --- STAGE 2: The Final Image ---
# Start from the lightweight slim image for a smaller final size
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Install the same system libraries needed for the packages to RUN
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy the installed packages from the builder stage
COPY --from=builder /install /usr/local

# Copy the rest of the application code
COPY ./app /app/app

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application in production
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "app.main:combined_app"]
