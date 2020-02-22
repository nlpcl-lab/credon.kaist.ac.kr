import React from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';

import styles from './index.less';


class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.main}>
        <div className={styles.chat}>
          <div className={styles.balloon}>

          </div>
          <div className={styles.inputBox}>
            <Button>버튼</Button>
          </div>
        </div>
      </div>
    );
  }
}

Main.propTypes = {};

function mapStateToProps(state) {
  return {
    app: state.app,
  };
}

export default connect(mapStateToProps)(Main);
