import dva from 'dva';
import createHistory from 'history/createBrowserHistory';
import { message } from 'antd';

import router from './router';
import appModel from './models/app';
import './index.less';

message.config({
  duration: 1.5,
  maxCount: 2,
});

const app = dva({
  history: createHistory(),
});
app.model(appModel);
app.router(router);
app.start('#root');
