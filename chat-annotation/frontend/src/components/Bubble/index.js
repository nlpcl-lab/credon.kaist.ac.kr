import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'antd';

import BounceSpinner from '../BounceSpinner';
import styles from './index.less';


class Bubble extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { text, alignLeft, loading } = this.props;

    const style = {
      backgroundColor: alignLeft ? '#e9ecef' : '#339af0',
      color: alignLeft ? '#000' : '#FFF',
    };
    return (
      <div
        className={styles.bubble}
        style={{ justifyContent: alignLeft ? 'flex-start' : 'flex-end' }}
      >
        {loading ?
          <BounceSpinner style={style}/> :
          <div className={styles.text} style={style}>{text}</div>
        }
      </div>
    );
  }
}


Bubble.propTypes = {
  text: PropTypes.string,
  alignLeft: PropTypes.bool,
  loading: PropTypes.bool,
};
Bubble.defaultProps = {
  text: '',
  alignLeft: false,
  loading: false,
};


export default Bubble;
