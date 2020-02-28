import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, message as Message } from 'antd';

import styles from './index.less';


class ExportModal extends React.Component {
  copyToClipboard = () => {
    this.textarea.select();
    document.execCommand('copy');
    Message.info('Copied');
  };

  render() {
    const { visible, onChangeVisible, messages } = this.props;

    const text = [];
    messages.forEach((message) => {
      text.push(`"${message.is_user ? 'you' : 'bot'}","${message.text}","${message.updated_at}"`);
    });
    return (
      <Modal
        title="Export Chat"
        visible={visible}
        footer={<Button onClick={() => this.copyToClipboard()}>Copy to Clipboard</Button>}
        className={styles.exportModal}
        onCancel={() => onChangeVisible(false)}
      >
        <textarea
          rows="6"
          className={styles.textarea}
          ref={(el) => {
            this.textarea = el;
          }}
        >
          {text.join('\n')}
        </textarea>
      </Modal>
    );
  }
}

ExportModal.propTypes = {
  visible: PropTypes.bool,
  messages: PropTypes.array,
};
ExportModal.defaultProps = {
  visible: false,
  messages: [],
};


export default ExportModal;
