FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install gunicorn

COPY . .

EXPOSE 5000

ENV FLASK_APP=app/app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV PORT=5000
ENV PYTHONPATH=/app

# Use gunicorn instead of flask run
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--chdir", "/app", "app.app:app"]