import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import { Table, Button, Icon, Empty } from 'antd';


import styles from './index.less';
import { Bubble, JsonEditor, Board, OptionModal, BounceSpiner } from '../../components';


class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: '',
      isUserTyping: false,
      isBotTyping: false,
    };
    this.userTypingTimeoutId = null;
    this.botTypingTimeoutId = null;
  }

  componentDidMount() {
    setInterval(() => {
      const { app, dispatch } = this.props;
      const { progress, scenario } = app;
      const { isUserTyping } = this.state;

      if (isUserTyping) return;
      if (['TYPING', 'CHOICE'].indexOf(scenario[progress].type) >= 0 && !scenario[progress].response) {
        return;
      }

      if (progress + 1 < scenario.length) {
        this.setState({ isBotTyping: true });
        if (this.botTypingTimeoutId) clearTimeout(this.botTypingTimeoutId);
        this.botTypingTimeoutId = setTimeout(() => {
          this.setState({ isBotTyping: false, });
          this.botTypingTimeoutId = null;
        }, 3000);

        scenario[progress + 1].displayed_at = moment()
          .toISOString();

        const payload = { progress: progress + 1 };

        const scene = scenario[progress + 1];
        if (_.get(scene, 'update_document.title', '')) payload.title = _.get(scene, 'update_document.title');
        if (_.get(scene, 'update_document.body', '')) payload.body = _.get(scene, 'update_document.body');
        if (_.get(scene, 'update_document.highlight_text', '')) payload.highlight_text = _.get(scene, 'update_document.highlight_text');

        dispatch({
          type: 'app/updateState',
          payload,
        });
      }
    }, 4000);
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
        text: scenario[i].message,
      });
      if (_.isArray(scenario[i].response)) {
        scenario[i].response.forEach((item) => {
          messages.push({
            is_user: true,
            text: item.text,
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

  addMessage = (value) => {
    const { app, dispatch } = this.props;
    const { progress, scenario } = app;

    if (!value) return;

    const newScenario = _.cloneDeep(scenario);
    if (!_.isArray(scenario[progress].response)) newScenario[progress].response = [];
    newScenario[progress].response.push({
      updated_at: moment()
        .toISOString(),
      text: value,
    });
    this.setState({
      input: '',
      isUserTyping: false,
    });
    dispatch({
      type: 'app/updateState',
      payload: {
        scenario: newScenario,
      },
    });
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  };


  render() {
    const { app, dispatch } = this.props;
    const { input, isBotTyping } = this.state;
    const {
      title,
      body,
      highlight_text,
      scenario,
      progress
    } = app;

    const messages = this.buildMessages();
    const currentScene = scenario[progress];

    return (
      <div className={styles.main}>
        <div className={styles.row1}>
          <div className={styles.board}>
            <Board
              title={title}
              body={body}
              highlightText={highlight_text}
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
              {messages.map((msg, index) => {
                if (index === messages.length - 1 && isBotTyping && !msg.is_user) {
                  return <BounceSpiner/>;
                }
                return <Bubble key={index} text={msg.text} alignLeft={!msg.is_user}/>;
              })}
            </div>
            {_.get(currentScene, 'type') === 'CHOICE' && _.get(currentScene, 'response', []).length === 0 ?
              <OptionModal
                options={_.get(currentScene, 'options')}
                onSelectValue={(value) => this.addMessage(value)}
              /> :
              <div className={styles.inputBox}>
                <input
                  value={input}
                  onChange={(e) => this.updateInput(e.target.value)}
                  className={styles.input}
                  placeholder="Type a message..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      this.addMessage(input);
                    }
                  }}
                />
                <div
                  className={styles.sendButton}
                  onClick={() => this.addMessage(input)}
                >
                  Send
                </div>
              </div>}
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
