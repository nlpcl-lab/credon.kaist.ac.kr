import os, sys, datetime, random, json
from flask import Flask, Response, session, g, request, render_template, redirect
from flask_mongoengine import MongoEngine

from models import Scenario, Annotation

base_dir = os.path.abspath(os.path.dirname(__file__) + '/')
sys.path.append(base_dir)

app = Flask(__name__)

app.config.from_object('config.Config')
db = MongoEngine(app)


@app.route("/", methods=["GET"])
def index():
    return render_template('index.html')


@app.route("/api/scenario", methods=["GET"])
def get_scenario():
    # /api/scenario?key=gzkupvhjzo
    random_string_key = request.args.get('key', '')
    try:
        scenario = Scenario.objects.get(random_string_key=random_string_key)
        return json.dumps({'scenario': scenario.dump()})
    except Scenario.DoesNotExist:
        return Response(status=404)


if __name__ == '__main__':
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', True)
    app.run(host='0.0.0.0', debug=FLASK_DEBUG, port=6060)
