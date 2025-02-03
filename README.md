## 🔑 Adding API keys to the .env file:
To set up your environment variables, copy `.env.example` to a new file named `.env` and replace `insert_your_key_here` with your actual API keys.

```bash
cp backend/.env.example backend/.env
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