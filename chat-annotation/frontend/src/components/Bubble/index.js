import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Table, Button } from 'antd';

import BounceSpinner from '../BounceSpinner';
import styles from './index.less';


class Bubble extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isHovered: false,
    };
  }

  render() {
    const {
      text, alignLeft, loading, editable, openEditModal
    } = this.props;
    const { isHovered } = this.state;

    const style = {
      backgroundColor: alignLeft ? '#e9ecef' : '#339af0',
      color: alignLeft ? '#000' : '#FFF',
    };
    return (
      <div
        className={styles.bubble}
        onMouseEnter={() => this.setState({ isHovered: true })}
        onMouseLeave={() => this.setState({ isHovered: false })}
        style={{ justifyContent: alignLeft ? 'flex-start' : 'flex-end' }}
      >
        {loading ?
          <BounceSpinner style={style}/> :
          <div
            className={styles.text}
            style={style}
          >
            <span>{text}</span>
            {editable && isHovered ?
              <span
                className={styles.editButton}
                onClick={() => openEditModal()}
              >
                (<Icon type="edit"/>edit)
              </span> : null}
          </div>
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
