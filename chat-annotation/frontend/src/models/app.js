import _ from 'lodash';
import queryString from 'query-string';
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';

import * as service from '../services';

import scenarioSample from './scenario_sample.json';

export default {
  namespace: 'app',
  state: {
    key: '',
    title: '',
    body: '',
    highlight_text: '',
    progress: 0,
    scenario: scenarioSample,
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        const query = queryString.parse(search);
        if (query.k) {
          dispatch({
            type: 'getScenario',
            payload: { key: query.k },
          });
        }
      });
    },
  },
  effects: {
    * getScenario({ payload }, { put, call }) {
      try {
        const res = yield call(service.getScenario, { key: payload.key });
        const body = JSON.parse(res.text);
        yield put({
          type: 'updateState',
          payload: {
            key: payload.key,
            scenario: _.get(body, 'scenario.chat_scenario'),
          },
        });
      } catch (e) {
        console.log(e);
      }
    },
    * putAnnotation({ payload }, { put, call, select }) {
      const app = yield select(state => state.app);
      if (!app.key) {
        console.error('[putAnnotation] app.key is null');
        return;
      }
      if (!app.turker_id) {
        console.error('[putAnnotation] app.turker_id is null');
        return;
      }
      try {
        const res = yield call(service.putAnnotation, {
          key: app.key,
          turker_id: app.turker_id,
          progress: app.progress,
          chat_annotation: app.scenario,
        });
        console.log('[putAnnotation] res', res);
      } catch (err) {
        console.error('[putAnnotation]', err);
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
