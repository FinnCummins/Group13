## Adding API keys to the .env file:
Replace `addkeyhere` with your actual API keys.

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