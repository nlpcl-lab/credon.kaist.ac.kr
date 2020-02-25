import React from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Table, Button, Icon, Empty } from 'antd';


import styles from './index.less';
import { Bubble, JsonEditor, Board } from '../../components';


class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: '',
      isTyping: false,
    };
    this.timeoutId = null;
  }

  componentDidMount() {
    setInterval(() => {
      console.log('tick!');
      const { app, dispatch } = this.props;
      const { progress, scenario } = app;
      const { input, isTyping } = this.state;

      if (isTyping) return;

      if (progress + 1 < scenario.length) {
        dispatch({
          type: 'app/updateState',
          payload: {
            progress: progress + 1,
          },
        });
      }
    }, 3000);
  }

  componentDidUpdate(prevProps, prevState) {
    const { app } = this.props;
    const { scenario, progress } = app;
    if (progress !== prevProps.app.progress
      || scenario !== prevProps.app.scenario) {
      this.bubbles.scrollTop = this.bubbles.scrollHeight;
    }
  }


  updateInput = (input) => {
    this.setState({
      input,
      isTyping: true,
    });
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.setState({
        isTyping: false,
      });
      this.timeoutId = null;
    }, 500);
  };


  buildMessages = () => {
    const { app } = this.props;
    const messages = [];
    const { progress, scenario } = app;

    for (let i = 0; i <= progress && i < scenario.length; i += 1) {
      messages.push({
        is_user: false,
        text: scenario[i].message,
      });
      if (_.isArray(scenario[i].response)) {
        scenario[i].response.forEach((text) => {
          messages.push({
            is_user: true,
            text,
          });
        });
      }
    }
    return messages;
  };

  onClickRollback = () => {
    const { app, dispatch } = this.props;
    const { progress, scenario } = app;

    const newScenario = _.cloneDeep(scenario);
    newScenario[progress].response = [];
    dispatch({
      type: 'app/updateState',
      payload: {
        progress: progress >= 1 ? progress - 1 : progress,
        scenario: newScenario,
      },
    });
  };

  addMessage = () => {

  };

  render() {
    const { app, dispatch } = this.props;
    const { title, body, highlightText } = app;
    const { input } = this.state;

    const messages = this.buildMessages();

    return (
      <div className={styles.main}>
        <div className={styles.row1}>
          <div className={styles.board}>
            <Board
              title={title}
              body={body}
              highlightText={highlightText}
            />
          </div>
          <div className={styles.chat}>
            <Button
              className={styles.rollback}
              shape="circle"
              icon="rollback"
              onClick={() => this.onClickRollback()}
            />
            <div
              ref={(el) => {
                this.bubbles = el;
              }}
              className={styles.bubbles}
            >
              {messages.map((msg) => <Bubble text={msg.text} alignLeft={!msg.is_user}/>)}
            </div>
            <div className={styles.inputBox}>
              <input
                value={input}
                onChange={(e) => this.updateInput(e.target.value)}
                className={styles.input}
                placeholder="input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    this.addMessage();
                  }
                }}
              />
              <div
                className={styles.sendButton}
                onClick={() => this.addMessage()}
              >
                Send
              </div>
            </div>
          </div>
        </div>
        <div className={styles.row2}>
          <JsonEditor
            value={app.scenario}
            onChange={(scenario) => {
              dispatch({
                type: 'app/updateState',
                payload: { scenario },
              });
            }}
          />
        </div>
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
