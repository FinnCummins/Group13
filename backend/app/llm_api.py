import os
from openai import OpenAI
from flask.cli import load_dotenv


def call_open_ai():
    openai_api_key = os.getenv("OPENAI_API_KEY")
    client = OpenAI(api_key=openai_api_key)

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": "tell me about trinity college dublin in 100 words"}]
    )
    return completion.choices[0].message.content