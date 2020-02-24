import React from 'react';
import _ from 'lodash';
import queryString from 'query-string';
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import { Icon, message, Modal } from 'antd';

import scenario_sample from './scenario_sample.json';

export default {
  namespace: 'app',
  state: {
    index: 0,
    scenario: scenario_sample,
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      console.log('scenario_sample:', scenario_sample);

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
