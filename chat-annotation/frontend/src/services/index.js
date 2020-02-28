import superagent from 'superagent';

import Config from '../config';

export async function getScenario(params) {
  return superagent.get('/api/scenario')
    .query({ key: params.key })
    .send();
}
