## Adding API keys to the .env file:
To set up your environment variables, copy `.env.example` to a new file named `.env` and replace `insert_your_key_here` with your actual API keys.

```bash
cp backend/.env.example backend/.env
```

## Running the application using Docker:
To run the application using Docker, please ensure that Docker Desktop ([download here](https://www.docker.com/products/docker-desktop/)) is running on your machine. You can now run the application using docker-compose:

```bash
docker-compose up --build -d
```

and to stop:
```bash
docker-compose down
```

## Running the application using a venv:
### Setting up the virtual environment:

For macOS and Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

For Windows:

```bash
python -m venv venv
.\venv\bin\activate.ps1
```

### Install the Requirements:
With the virtual environment activated, install the project dependencies using:

```bash
pip3 install -r backend/requirements.txt
```
make sure you have python and pip installed first

### Run Flask
To start the Flask application:
```bash
cd backend/app/
flask --app app run
```

# Start the database
First ensure that you have docker installed on your machine.

Then to start the PostgreSQL Database:
```bash
cd database
docker compose up -d
```