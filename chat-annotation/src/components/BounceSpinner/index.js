import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Empty } from 'antd';

import styles from './index.less';


class BounceSpinner extends React.Component {
  render() {
    const { style } = this.props;
    return (
      <div className={styles.spinner} style={{ ...style }}>
        <div className={styles.bounce1}/>
        <div className={styles.bounce2}/>
        <div/>
      </div>
    );
  }
}


export default BounceSpinner;
