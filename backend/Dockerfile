# Use the full Debian-based Python image, not 'slim', as it's better for compiling
FROM python:3.11

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

# Copy the requirements file first to leverage Docker layer caching
COPY requirements.txt /app/

# Install the Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY ./app /app/app

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application in production
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "app.main:combined_app"]
