import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Icon } from 'antd';

import styles from './index.less';


class OptionModal extends React.Component {
  render() {
    const { options, onSelectValue } = this.props;
    return (
      <div className={styles.optionModal}>
        {options.map((option, index) => {
          return (
            <div
              key={index}
              className={styles.option}
              style={{ width: '100%' }}
              onClick={() => onSelectValue(option.label)}
            >
              {option.label}
              {option.description ?
                <Popover content={option.description}>
                  <Icon
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
