import _ from 'lodash';
import { pathToRegexp } from 'path-to-regexp';
import queryString from 'query-string';
import { routerRedux } from 'dva/router';
import { Modal } from 'antd';

import * as service from '../services';

import scenarioSample from './scenario_sample.json';

export default {
  namespace: 'app',
  state: {
    key: '',
    turker_id: '',
    title: '',
    body: '',
    highlight_text: '',
    progress: 0,
    scenario: scenarioSample,
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        console.log('history listen :', pathname);

        const match = pathToRegexp('/')
          .exec(pathname);

        if (match) {
          const query = queryString.parse(search);
          if (query.k) {
            dispatch({
              type: 'getScenario',
              payload: { key: query.k },
            });
          } else {
            dispatch(routerRedux.push('/404'));
          }
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
        Modal.warning({
          title: 'Invalid access',
          content: 'Please check the given url...',
        });
        yield put(routerRedux.replace('/404'));
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
      console.log('[putAnnotation] app:', app);
      try {
        const res = yield call(service.putAnnotation, {
          key: app.key,
          turker_id: app.turker_id,
          progress: app.progress,
          chat_scenario: app.scenario,
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
