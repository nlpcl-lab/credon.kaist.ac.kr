import superagent from 'superagent';


export async function getScenario(params) {
  return superagent.get('/api/scenario')
    .query({ key: params.key })
    .send();
}

export async function getAnnotation(params) {
  return superagent.get('/api/annotation')
    .query({
      key: params.key,
      turker_id: params.turker_id,
    });
}

export async function putAnnotation(params) {
  return superagent.put('/api/annotation')
    .query({
      key: params.key,
      turker_id: params.turker_id,
      entrance_key: params.entrance_key,
    })
    .send({
      progress: params.progress,
      chat_scenario: params.chat_scenario,
    });
}
