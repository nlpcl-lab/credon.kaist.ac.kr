import React from 'react';
import PropTypes from 'prop-types';
import { Input, Modal } from 'antd';
import Highlighter from 'react-highlight-words';

import styles from './index.less';

const { TextArea } = Input;

class EditModal extends React.Component {
  render() {
    const { visible, originalValue, updateValue, close } = this.props;
    return (
      <div>
        <Modal
          title="Edit"
          visible={visible}
          destroyOnClose
          className={styles.editModal}
          onCancel={() => close()}
          onOk={() => {
            updateValue(this.textarea.state.value);
          }}
        >
          <TextArea
            autoSize={{
              minRows: 2,
              maxRows: 4,
            }}
            className={styles.textarea}
            defaultValue={originalValue}
            ref={(el) => {
              this.textarea = el;
            }}
          />
        </Modal>
      </div>
    );
  }
}


export default EditModal;
