import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import { Button, Input, Tooltip } from 'antd';


import styles from './index.less';
import { Bubble, JsonEditor, Board, OptionModal, ExportModal, EditModal } from '../../components';
import Config from '../../config';

const { TextArea } = Input;

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.getInitialEditModal = () => ({
      visible: false,
      editPath: '0.response.0',
      originalValue: '',
    });

    this.state = {
      input: '',
      isUserTyping: false,
      isBotTyping: false,
      exportButtonVisible: false,
      exportModalVisible: false,
      editModal: this.getInitialEditModal(),
    };
    this.userTypingTimeoutId = null;
    this.botTypingTimeoutId = null;
    this.intervalId = null;
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      const { app, dispatch } = this.props;
      const { progress, scenario } = app;
      const { isUserTyping, isBotTyping } = this.state;

      if (isBotTyping) return;
      if ([Config.constants.types.TYPING, Config.constants.types.CHOICE].indexOf(scenario[progress].type) >= 0
        && _.get(scenario, `${progress}.response`, []).length === 0) {
        return;
      }
      this.moveToNextStep();
    }, 2000);
  }


  componentDidUpdate(prevProps, prevState) {
    const { app } = this.props;
    const { scenario, progress } = app;
    if (progress !== prevProps.app.progress
      || scenario !== prevProps.app.scenario) {
      this.bubbles.scrollTop = this.bubbles.scrollHeight;
    }
  }

  componentWillUnmount() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.userTypingTimeoutId) clearTimeout(this.userTypingTimeoutId);
    if (this.botTypingTimeoutId) clearTimeout(this.botTypingTimeoutId);
  }

  moveToNextStep = (params = {}) => {
    const { app, dispatch } = this.props;
    const { progress, scenario } = app;

    if (progress + 1 < scenario.length) {
      this.setState({ isBotTyping: true });
      if (this.botTypingTimeoutId) clearTimeout(this.botTypingTimeoutId);
      this.botTypingTimeoutId = setTimeout(() => {
        this.setState({ isBotTyping: false, });
        this.botTypingTimeoutId = null;
      }, 4000);

      scenario[progress + 1].displayed_at = moment()
        .toISOString();

      const payload = {
        ...params,
        progress: progress + 1
      };

      const scene = scenario[progress + 1];
      if (_.get(scene, 'update_document.title', '')) payload.title = _.get(scene, 'update_document.title');
      if (_.get(scene, 'update_document.body', '')) payload.body = _.get(scene, 'update_document.body');
      if (_.get(scene, 'update_document.highlight_text', '')) payload.highlight_text = _.get(scene, 'update_document.highlight_text');

      dispatch({
        type: 'app/updateState',
        payload,
      });
      dispatch({ type: 'app/putAnnotation' });
    }
  };


  updateInput = (input) => {
    this.setState({
      input,
      isUserTyping: true,
    });
    if (this.userTypingTimeoutId) clearTimeout(this.userTypingTimeoutId);
    this.userTypingTimeoutId = setTimeout(() => {
      this.setState({
        isUserTyping: false,
      });
      this.userTypingTimeoutId = null;
    }, 500);
  };


  buildMessages = () => {
    const { app } = this.props;
    const messages = [];
    const { progress, scenario } = app;

    for (let i = 0; i <= progress && i < scenario.length; i += 1) {
      messages.push({
        is_user: false,
        edit_path: null,
        text: scenario[i].message,
        updated_at: scenario[i].displayed_at ? scenario[i].displayed_at : '',
      });
      if (_.isArray(scenario[i].response)) {
        scenario[i].response.forEach((item, index) => {
          messages.push({
            is_user: true,
            edit_path: scenario[i].type === Config.constants.types.TYPING ? `${i}.response.${index}` : null,
            text: item.text,
            updated_at: item.updated_at ? item.updated_at : '',
          });
        });
      }
    }
    return messages;
  };


  addMessage = (value) => {
    const { app, dispatch } = this.props;
    const { progress, scenario } = app;

    const trimmedValue = value.trim();
    if (!trimmedValue) return;


    const newScenario = _.cloneDeep(scenario);
    if (!_.isArray(scenario[progress].response)) newScenario[progress].response = [];
    newScenario[progress].response.push({
      updated_at: moment()
        .toISOString(),
      text: trimmedValue,
    });
    this.setState({
      input: '',
      isUserTyping: false,
    });
    if (trimmedValue.toLowerCase() === 'export') {
      this.setState({
        exportButtonVisible: true,
        exportModalVisible: true,
      });
    }
    if (newScenario[progress].message.indexOf('turker-id') >= 0) {
      // When asked for turker_id, only set the response once
      this.moveToNextStep({
        turker_id: trimmedValue,
        scenario: newScenario,
      });
    } else {
      dispatch({
        type: 'app/updateState',
        payload: {
          scenario: newScenario,
        },
      });
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  };

  renderInput = () => {
    const { app } = this.props;
    const { input, isBotTyping, exportButtonVisible } = this.state;
    const {
      scenario,
      progress
    } = app;

    if (exportButtonVisible) {
      return <OptionModal
        options={[
          {
            label: 'export',
            description: '',
          }
        ]}
        onSelectValue={(value) => this.addMessage(value)}
      />;
    }

    const currentScene = scenario[progress];
    if (_.get(currentScene, 'type') === Config.constants.types.CHOICE
      && _.get(currentScene, 'response', []).length === 0) {
      return !isBotTyping ?
        <OptionModal
          options={_.get(currentScene, 'options')}
          onSelectValue={(value) => this.addMessage(value)}
        /> : null;
    }

    return <div className={styles.inputBox}>
      <TextArea
        value={input}
        autoSize={{
          minRows: 1,
          maxRows: 3
        }}
        onChange={(e) => this.updateInput(e.target.value)}
        className={styles.input}
        placeholder="Type a message..."
      />
      <div
        className={styles.sendButton}
        onClick={() => this.addMessage(input)}
      >
        Send
      </div>
    </div>;
  };


  render() {
    const { app, dispatch } = this.props;
    const { exportModalVisible, exportButtonVisible, isBotTyping, editModal } = this.state;
    const {
      title,
      body,
      highlight_text,
      scenario,
      progress
    } = app;

    const messages = this.buildMessages();

    return (
      <div className={styles.main}>
        <ExportModal
          visible={exportModalVisible}
          onChangeVisible={(visible) => this.setState({ exportModalVisible: visible })}
          messages={messages}
        />
        <EditModal
          visible={editModal.visible}
          originalValue={editModal.originalValue}
          updateValue={(value) => {
            const newScenario = _.cloneDeep(scenario);
            const ss = editModal.editPath.split('.');
            if (ss.length !== 3) return;

            const scenarioIndex = ss[0];
            const responseIndex = ss[2];

            const targetItem = _.get(newScenario, `${scenarioIndex}`);
            if (!targetItem) return;
            const targetRes = _.get(targetItem, `response.${responseIndex}`);
            if (!targetRes) return;

            if (_.get(targetItem, 'history', []).length === 0) targetItem.history = [];
            targetItem.history.push(targetRes);

            _.set(
              newScenario,
              `${scenarioIndex}.response.${responseIndex}`,
              {
                updated_at: moment()
                  .toISOString(),
                text: value,
              },
            );

            dispatch({
              type: 'app/updateState',
              payload: { scenario: newScenario }
            });
            dispatch({ type: 'app/putAnnotation' });

            this.setState({ editModal: this.getInitialEditModal() });
          }}
          close={() => {
            this.setState({ editModal: this.getInitialEditModal() });
          }}
        />
        <div className={styles.row1}>
          <div className={styles.board}>
            <Board
              title={title}
              body={body}
              highlightText={highlight_text}
            />
          </div>
          <div className={styles.chat}>
            <div
              ref={(el) => {
                this.bubbles = el;
              }}
              className={styles.bubbles}
            >
              {messages.map((msg, index) => {
                return (
                  <Bubble
                    loading={index === messages.length - 1 && isBotTyping && !msg.is_user}
                    key={index}
                    text={msg.text}
                    alignLeft={!msg.is_user}
                    editable={!!msg.edit_path}
                    openEditModal={() => {
                      if (!msg.edit_path) return;
                      this.setState({
                        editModal: {
                          visible: true,
                          editPath: msg.edit_path,
                          originalValue: msg.text,
                        }
                      });
                    }}
                  />
                );
              })}
            </div>
            {this.renderInput()}
          </div>
        </div>
        {/*<div className={styles.row2}>*/}
        {/*<JsonEditor*/}
        {/*value={app.scenario}*/}
        {/*onChange={(scenario) => {*/}
        {/*dispatch({*/}
        {/*type: 'app/updateState',*/}
        {/*payload: { scenario },*/}
        {/*});*/}
        {/*}}*/}
        {/*/>*/}
        {/*</div>*/}
      </div>
    );
  }
}

Main.propTypes = {};

function mapStateToProps(state) {
  return {
    app: state.app,
  };
}

export default connect(mapStateToProps)(Main);
