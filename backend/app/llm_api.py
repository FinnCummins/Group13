import os
from openai import OpenAI
from flask.cli import load_dotenv


def call_open_ai(prompt):
    openai_api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=openai_api_key)

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )
    return completion.choices[0].message.content