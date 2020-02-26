import os, sys, datetime, random
from flask import Flask, session, g, request, render_template, redirect
from flask_mongoengine import MongoEngine

base_dir = os.path.abspath(os.path.dirname(__file__) + '/')
sys.path.append(base_dir)

app = Flask(__name__)


# app.config.from_object('config.Config')
# db = MongoEngine(app)


@app.route("/", methods=["GET"])
def index():
    return render_template('index.html')


if __name__ == '__main__':
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', True)
    app.run(host='0.0.0.0', debug=FLASK_DEBUG, port=6060)
