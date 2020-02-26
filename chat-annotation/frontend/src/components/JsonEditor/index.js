import React from 'react';
import { JsonEditor as Editor } from 'jsoneditor-react/es/index';


import styles from './index.less';


class JsonEditor extends React.Component {
  componentDidMount() {
    // this.editor.expandAll();
  }

  componentDidUpdate(prevProps, prevState) {
    const { value } = this.props;
    if (value !== prevProps.value && this.editor.jsonEditor) {
      this.editor.jsonEditor.set(value);
    }
  }

  render() {
    const { value, onChange } = this.props;
    return (
      <Editor
        ref={(el) => {
          this.editor = el;
        }}
        mode="code"
        value={value}
        onChange={onChange}
      />
    );
  }
}

export default JsonEditor;
