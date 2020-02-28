import datetime
from flask_mongoengine import MongoEngine
import uuid
import hashlib

db = MongoEngine()


class Scenario(db.Document):
    doc_id = db.IntField(default=0)
    random_string_key = db.StringField(default='')
    chat_scenario = db.ListField(default=[])
    created_at = db.DateTimeField(default=datetime.datetime.now)

    def dump(self):
        return {
            'id': str(self.id),
            'random_string_key': self.random_string_key,
            'chat_scenario': self.chat_scenario,
            'created_at': str(self.created_at),
        }

    meta = {
        'indexes': [
            'doc_id',
            'random_string_key',
        ],
    }


class Annotation(db.Document):
    scenario = db.ReferenceField(Scenario)
    turker_id = db.StringField(default='')
    chat_scenario = db.ListField(default=[])

    created_at = db.DateTimeField(default=datetime.datetime.now)
    updated_at = db.DateTimeField(default=datetime.datetime.now)

    meta = {
        'indexes': [
            'scenario',
            'turker_id',
        ],
    }

    def dump(self):
        return {
            'id': str(self.id),
            'scenario_id': str(self.scenario.id),
            'turker_id': str(self.user.id),
            'chat_scenario': self.chat_scenario,
            'created_at': str(self.created_at),
            'updated_at': str(self.updated_at),
        }
