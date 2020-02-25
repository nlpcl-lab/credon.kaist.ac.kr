import React from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Table, Button, Icon } from 'antd';


import styles from './index.less';
import { Bubble, JsonEditor } from '../../components';


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
    }, 4000);
  }

  componentDidUpdate(prevProps, prevState) {
    const { app } = this.props;
    const { scenario, progress } = app;
    if (progress !== prevProps.app.progress) {
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

    for (let i = 0; i <= progress && i < scenario.length; i++) {
      messages.push({
        is_user: false,
        text: scenario[i].message,
      });
      if (scenario[i].response) {
        messages.push({
          is_user: true,
          text: scenario[i].response,
        });
      }
    }
    return messages;
  };

  render() {
    const { app, dispatch } = this.props;
    const { input } = this.state;

    const messages = this.buildMessages();

    return (
      <div className={styles.main}>
        <div className={styles.row1}>
          <div className={styles.board}>
            <div className={styles.title}>Should students be taught to compete or to cooperate?
            </div>
            <div className={styles.body}>
              It is always said that competition can effectively promote the development of economy.
              In order to survive in the competition, companies continue to improve their products
              and
              service, and as a result, the whole society prospers. However, when we discuss the
              issue
              of competition or cooperation, what we are concerned about is not the whole society,
              but
              the development of an individual's whole life. From this point of view, I firmly
              believe
              that we should attach more importance to cooperation during primary education.
              First of all, through cooperation, children can learn about interpersonal skills which
              are significant in the future life of all students. What we acquired from team work is
              not only how to achieve the same goal with others but more importantly, how to get
              along
              with others. During the process of cooperation, children can learn about how to listen
              to opinions of others, how to communicate with others, how to think comprehensively,
              and
              even how to compromise with other team members when conflicts occurred. All of these
              skills help them to get on well with other people and will benefit them for the whole
              life.
              On the other hand, the significance of competition is that how to become more
              excellence
              to gain the victory. Hence it is always said that competition makes the society more
              effective. However, when we consider about the question that how to win the game, we
              always find that we need the cooperation. The greater our goal is, the more
              competition
              we need. Take Olympic games which is a form of competition for instance, it is hard to
              imagine how an athlete could win the game without the training of his or her coach,
              and
              the help of other professional staffs such as the people who take care of his diet,
              and
              those who are in charge of the medical care. The winner is the athlete but the success
              belongs to the whole team. Therefore without the cooperation, there would be no
              victory
              of competition.
              Consequently, no matter from the view of individual development or the relationship
              between competition and cooperation we can receive the same conclusion that a more
              cooperative attitudes towards life is more profitable in one's success.
            </div>
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
