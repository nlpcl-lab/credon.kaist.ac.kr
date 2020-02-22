import dva from 'dva';
import {message} from 'antd'
import './index.less';

message.config({
  duration: 1.5,
  maxCount: 2,
});

// 1. Initialize
const app = dva();
app.model(require('./models/app').default);
app.router(require('./router').default);
app.start('#root');
