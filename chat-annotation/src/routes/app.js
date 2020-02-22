import React from 'react';
import {connect} from 'dva';
import PropTypes from 'prop-types'
import {ConfigProvider} from 'antd';
import ko_KR from 'antd/lib/locale-provider/ko_KR';
import 'moment/locale/ko';

import styles from './app.less';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const {children, app, location} = this.props;

    return (
      <div>
        <ConfigProvider locale={ko_KR}>
          {children}
        </ConfigProvider>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired,
};

function mapStateToProps(state) {
  return {
    app: state.app,
  };
}

export default connect(mapStateToProps)(App);
