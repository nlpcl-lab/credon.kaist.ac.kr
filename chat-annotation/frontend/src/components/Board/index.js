import React from 'react';
import { Empty } from 'antd';
import Highlighter from 'react-highlight-words';

import styles from './index.less';


class Board extends React.Component {
  render() {
    const { title, body, highlightText } = this.props;
    return (
      <div className={styles.board}>
        {title ? <div className={styles.title}>{title}</div> : null}
        {body ? <Highlighter
          className={styles.body}
          searchWords={[]}
          findChunks={() => {
            const start = body.indexOf(highlightText);
            if (start === -1) {
              return [{
                start: 0,
                end: 0,
              }];
            }
            return [{
              start,
              end: start + highlightText.length,
            }];
          }}
          textToHighlight={body ? body : ''}
        /> : null}
        {body}
        {!title && !body ? <Empty className={styles.empty} description={false}/> : null}
      </div>
    );
  }
}


export default Board;
