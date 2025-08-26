# Use the full Debian-based Python image. It is larger but more reliable for complex builds.
FROM python:3.11

# Set the working directory
WORKDIR /app

# Install all system-level dependencies required for compiling and running the libraries
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file
COPY requirements.txt /app/

# Install the Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY ./app /app/app

# Expose the port the app runs on (Render ignores this, but it's good practice)
EXPOSE 10000

# Command to run the application in production
# MODIFIED: Added '-b 0.0.0.0:10000' to bind to the correct port for Render
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:10000", "app.main:combined_app"]
