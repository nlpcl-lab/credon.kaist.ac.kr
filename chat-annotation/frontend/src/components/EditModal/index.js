import React from 'react';
import { Input, Modal, Button } from 'antd';

import styles from './index.less';
import OptionModal from '../OptionModal';
import PropTypes from 'prop-types';
import Bubble from '../Bubble';

const { TextArea } = Input;

class EditModal extends React.Component {
  renderOptionModal = () => {
    const { options, updateValue } = this.props;
    return <OptionModal
      options={options}
      isAbsolute={false}
      onSelectValue={(value) => updateValue(value)}
    />;
  };
  renderFooter = () => {
    const { options, close, updateValue } = this.props;
    if (options) return null;
    return [
      <Button key="cancel" onClick={() => close()}>
        Cancel
      </Button>,
      <Button key="save" type="primary" onClick={() => updateValue(this.textarea.state.value)}>
        Save
      </Button>,
    ];
  };

  render() {
    const { visible, originalValue, options, close } = this.props;
    return (
      <div>
        <Modal
          title="Edit"
          visible={visible}
          destroyOnClose
          className={styles.editModal}
          footer={this.renderFooter()}
          onCancel={() => close()}
        >
          {options ? this.renderOptionModal() :
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
          }
        </Modal>
      </div>
    );
  }
}

export default EditModal;
