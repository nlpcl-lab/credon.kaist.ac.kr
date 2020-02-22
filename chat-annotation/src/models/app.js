import queryString from 'query-string';
import pathToRegexp from 'path-to-regexp';
import {routerRedux} from 'dva/router';
import {Icon, message, Modal} from 'antd';
import _ from 'lodash';
import React from 'react';

export default {
  namespace: 'app',
  state: {
    me: {
      id: -1,
      nickname: '로그인이 필요합니다',
      thumbnail: 'https://storage.cobak.co/profile/basic_profile_img05.png',
    },
    token_list: [],
  },
  subscriptions: {
    setupHistory({dispatch, history}) {
      history.listen(({pathname, search}) => {
      });
    },
  },
  effects: {
    * goTo({payload}, {put, call}) {
      yield put(routerRedux.push(payload));
    },
  },
  reducers: {
    updateState(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
