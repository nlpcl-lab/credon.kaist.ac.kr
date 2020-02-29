import os
import json
from tqdm import tqdm
from mongoengine import connect

from models import Scenario, Annotation
import config as config

collections = ['scenario', 'annotation']


def insert_data(path):
    for item in Scenario.objects.all():
        item.delete()

    with open(path) as f:
        data = json.load(f)
        for item in tqdm(data):
            doc_id = item['doc_id']
            chat_scenario = item['chat_scenario']
            random_string_key = item['random_string_key']

            for msg in chat_scenario:
                if msg['message'] == 'please click the ‘export’ button':
                    msg['type'] = 'CHOICE'
                    msg['options'] = [
                        {
                            'label': 'export',
                            'description': '',
                        }
                    ]

            chat_scenario[-1]['type'] = 'CHOICE'
            chat_scenario[-1]['options'] = [
                {
                    'label': 'export',
                    'description': '',
                }
            ]

            if Scenario.objects.filter(doc_id=doc_id).count():
                continue

            Scenario(
                doc_id=doc_id,
                chat_scenario=chat_scenario,
                random_string_key=random_string_key
            ).save()


def db_backup(memo):
    import datetime

    backup_dir = './backup/' + datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%S')
    os.makedirs(backup_dir)

    memo_path = os.path.abspath(backup_dir + '/memo.txt')
    with open(memo_path, 'w') as f:
        f.write(memo)

    import subprocess

    MONGODB_SETTINGS = config.Config.MONGODB_SETTINGS
    for collection in collections:
        print('now backup collection {}'.format(collection))
        backup_path = os.path.abspath(backup_dir + '/{}'.format(collection))
        subprocess.call(['mongoexport',
                         '-h',
                         '{}:{}'.format(MONGODB_SETTINGS['host'], MONGODB_SETTINGS['port']),
                         '-u',
                         MONGODB_SETTINGS['username'],
                         '-p',
                         MONGODB_SETTINGS['password'],
                         '-d',
                         MONGODB_SETTINGS['db'],
                         '-c',
                         collection,
                         '-o',
                         backup_path,
                         ])


if __name__ == '__main__':
    connect(**config.Config.MONGODB_SETTINGS)

    insert_data('./data/chat-v-0.2.json')
