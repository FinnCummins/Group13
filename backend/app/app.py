from flask import Flask

from llm_api import call_open_ai

app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    return call_open_ai()


if __name__ == '__main__':
    app.run()
