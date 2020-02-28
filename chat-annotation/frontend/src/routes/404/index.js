import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import { Result } from 'antd';


import styles from './index.less';

class NotFound extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { app, dispatch } = this.props;
    return (
      <Result
        className={styles.notFound}
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        // extra={<Button type="primary">Back Home</Button>}
      />
    );
  }
}

NotFound.propTypes = {};

function mapStateToProps(state) {
  return {
    app: state.app,
  };
}

export default connect(mapStateToProps)(NotFound);
