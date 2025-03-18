import os
from openai import OpenAI
from dotenv import load_dotenv


load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY is not set. Please check your .env file or environment variables.")
client = OpenAI(api_key=openai_api_key)


def call_open_ai(prompt):
    try:
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}]
        )
        return completion.choices[0].message.content
    except Exception as e:
        raise RuntimeError(f"Error calling OpenAI API: {str(e)}")


def get_embedding(text):
    try:
        response = client.embeddings.create(
            model="text-embedding-ada-002",
            input=text
        )

        embedding_vector = response.data[0].embedding
        return embedding_vector
    except Exception as e:
        raise RuntimeError(f"Error generating embedding: {str(e)}")
