import React from 'react';
import {connect} from 'dva';
import {Table, Button} from 'antd';

import styles from './index.less';


class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.main}>
        <div className={styles.chatBox}>
          <Button>버튼</Button>
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
