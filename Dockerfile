# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Install npm and nodejs
RUN apt-get update && apt-get install -y npm nodejs

EXPOSE 3000
EXPOSE 5000

# make /workdir
RUN mkdir /workdir

COPY requirements.txt /workdir/requirements.txt
# Install any needed packages specified in requirements.txt
WORKDIR /workdir
RUN pip install --no-cache-dir -r requirements.txt

COPY /app /workdir/app

# Set the working directory to /app/frontend
WORKDIR /workdir/app/frontend

# Install frontend dependencies
RUN npm install --force
