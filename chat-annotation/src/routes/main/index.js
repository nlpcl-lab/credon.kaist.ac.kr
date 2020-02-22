import React from 'react';
import {connect} from 'dva';
import {Table} from 'antd';

import styles from './index.less';


class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const dataSource = [{
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street'
    }, {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street'
    }];

    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    }];

    return (
      <div className={styles.main}>
        <Table dataSource={dataSource} columns={columns}/>
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
