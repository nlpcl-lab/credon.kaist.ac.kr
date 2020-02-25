import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Empty } from 'antd';

import styles from './index.less';


class Board extends React.Component {
  render() {
    const { title, body, highlightText } = this.props;
    return (
      <div className={styles.board}>
        {title ? <div className={styles.title}>{title}</div> : null}
        {body ? <div className={styles.body}>{body}</div> : null}
        {!title && !body ? <Empty className={styles.empty} description={false}/> : null}
      </div>
    );
  }
}


export default Board;
