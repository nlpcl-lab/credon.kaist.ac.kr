import _ from 'lodash';
import queryString from 'query-string';
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';

import * as service from '../services';

import scenarioSample from './scenario_sample.json';

export default {
  namespace: 'app',
  state: {
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
        console.log('query:', query);
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
            scenario: _.get(body, 'scenario.chat_scenario'),
          },
        });
      } catch (e) {
        console.log(e);
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
