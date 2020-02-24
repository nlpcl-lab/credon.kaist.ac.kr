import React from 'react';
import { JsonEditor as Editor } from 'jsoneditor-react/es/index';

import styles from './index.less';


class JsonEditor extends React.Component {
  componentDidMount() {
    this.editor.expandAll();
  }

  render() {
    const { value, onChange } = this.props;
    return (
      <Editor
        ref={(el) => {
          this.editor = el;
        }}
        value={value}
        onChange={onChange}
      />
    );
  }
}

export default JsonEditor;
