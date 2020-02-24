import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'antd';

import styles from './index.less';


class Bubble extends React.Component {
  render() {
    const { text, alignLeft } = this.props;
    return (
      <div
        className={styles.bubble}
        style={{ justifyContent: alignLeft ? 'flex-start' : 'flex-end' }}
      >
        <div
          className={styles.text}
          style={{
            backgroundColor: alignLeft ? '#e9ecef' : '#339af0',
            color: alignLeft ? '#000' : '#FFF',
          }}
        >
          {text}
        </div>
      </div>
    );
  }
}


Bubble.propTypes = {
  text: PropTypes.string,
  alignLeft: PropTypes.bool,
};
Bubble.defaultProps = {
  text: '',
  alignLeft: false,
};


export default Bubble;
