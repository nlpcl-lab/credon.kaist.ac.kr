import os, sys, datetime, random, json
from flask import Flask, Response, session, g, request, render_template, redirect
from flask_mongoengine import MongoEngine

from models import Scenario, Annotation

base_dir = os.path.abspath(os.path.dirname(__file__) + '/')
sys.path.append(base_dir)

app = Flask(__name__, static_url_path='')

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


@app.route("/api/annotation", methods=["GET"])
def get_annotation():
    # /api/annotation?key=gzkupvhjzo&turker_id=123123&entrance_key=123
    random_string_key = request.args.get('key', '')
    turker_id = request.args.get('turker_id', 0)
    entrance_key = request.args.get('entrance_key', 0)
    try:
        scenario = Scenario.objects.get(random_string_key=random_string_key)
    except Scenario.DoesNotExist:
        return Response(status=404)
    try:
        annotation = Annotation.objects.get(scenario=scenario, turker_id=turker_id, entrance_key=entrance_key)
    except Scenario.DoesNotExist:
        return Response(status=404)

    return json.dumps({'annotation': annotation.dump()})


@app.route("/api/annotation", methods=["PUT"])
def put_annotation():
    # /api/annotation?key=gzkupvhjzo&turker_id=123123&entrance_key=123
    random_string_key = request.args.get('key', '')
    turker_id = request.args.get('turker_id', '')
    entrance_key = request.args.get('entrance_key', 0)

    data = request.get_json()
    progress = data.get('progress', 0)
    chat_scenario = data.get('chat_scenario', [])

    try:
        scenario = Scenario.objects.get(random_string_key=random_string_key)
    except Scenario.DoesNotExist:
        return Response(status=404)
    try:
        annotation = Annotation.objects.get(scenario=scenario, turker_id=turker_id, entrance_key=entrance_key)
    except Annotation.DoesNotExist:
        annotation = Annotation(scenario=scenario, turker_id=turker_id, entrance_key=entrance_key)
        annotation.save()

    if progress < annotation.progress:
        print('invalid progress number')
        print('annotation.progress:', annotation.progress)
        print('progress:', progress)
        return Response(status=403)

    annotation.progress = progress
    annotation.chat_scenario = chat_scenario
    annotation.save()

    return json.dumps({'annotation': annotation.dump()})


if __name__ == '__main__':
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', True)
    app.run(host='0.0.0.0', debug=FLASK_DEBUG, port=6061)
