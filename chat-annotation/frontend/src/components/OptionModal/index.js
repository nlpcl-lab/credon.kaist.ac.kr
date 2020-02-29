import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Icon } from 'antd';

import styles from './index.less';


class OptionModal extends React.Component {
  render() {
    const { options, onSelectValue } = this.props;


    return (
      <div
        className={styles.optionModal}
        style={{ flexWrap: options.length >= 5 ? 'wrap' : 'nowrap' }}
      >
        {options.map((option, index) => {
          let width = '100%';
          if (options.length >= 5) width = '130px';
          if (options.length === 5 && index >= 3) width = '160px';

          return (
            <div
              key={index}
              className={styles.option}
              style={{ width }}
              onClick={() => onSelectValue(option.label)}
            >
              {option.label}
              {option.description ?
                <Popover
                  content={<div style={{ maxWidth: '400px' }}>{option.description}</div>}
                >
                  <Icon
                    onClick={(e) => e.stopPropagation()}
                    className={styles.icon}
                    type="question-circle"
                  />
                </Popover> : null}
            </div>
          );
        })}
      </div>
    );
  }
}


export default OptionModal;
