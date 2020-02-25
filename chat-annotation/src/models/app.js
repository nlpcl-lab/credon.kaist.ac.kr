import _ from 'lodash';
import queryString from 'query-string';
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';

import scenarioSample from './scenario_sample.json';

export default {
  namespace: 'app',
  state: {
    progress: 0,
    scenario: scenarioSample,
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen(({ pathname, search }) => {

      });
    },
  },
  effects: {
    * goTo({ payload }, { put, call }) {
      yield put(routerRedux.push(payload));
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
