# --- STAGE 1: The Builder ---
# Use a full Python image that includes all necessary build tools
FROM python:3.11 as builder

# Set the working directory
WORKDIR /app

# Install system-level dependencies with the correct, modern package names
# This is the definitive fix for the build errors
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy only the requirements file
COPY requirements.txt .

# Install all Python packages into a dedicated folder
# This will now compile successfully
RUN pip install --no-cache-dir --prefix="/install" -r requirements.txt


# --- STAGE 2: The Final Image ---
# Start from the lightweight slim image for a smaller final size
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Install only the RUNTIME system libraries needed for the packages to function
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Copy the installed packages from the builder stage
COPY --from=builder /install /usr/local

# Copy the rest of the application code
COPY ./app /app/app

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application in production
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "app.main:combined_app"]
