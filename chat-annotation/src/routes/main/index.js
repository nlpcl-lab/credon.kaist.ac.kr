import React from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Table, Button, Icon } from 'antd';

import styles from './index.less';
import { Bubble } from '../../components';


class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: '',
      chat: [
        {
          user: 'bot',
          text: 'hello',
        }, {
          user: 'anonymous',
          text: 'hi',
        }
      ],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { chat } = this.state;
    if (chat !== prevState.chat) {
      this.bubbles.scrollTop = this.bubbles.scrollHeight;
    }
  }

  addMessage = () => {
    const { chat, input } = this.state;
    if (!input) return;

    const newChat = _.cloneDeep(chat);
    newChat.push({
      user: 'anonymous',
      text: input,
    });
    this.setState({
      chat: newChat,
      input: '',
    });
  };

  onClickRollback = () => {
    const { chat } = this.state;
    const newChat = _.cloneDeep(chat);
    newChat.pop();
    this.setState({
      chat: newChat,
    });
  };


  render() {
    const { chat, input } = this.state;

    return (
      <div className={styles.main}>
        <div className={styles.board}>
          <div className={styles.title}>Should students be taught to compete or to cooperate?</div>
          <div className={styles.body}>
            It is always said that competition can effectively promote the development of economy.
            In order to survive in the competition, companies continue to improve their products and
            service, and as a result, the whole society prospers. However, when we discuss the issue
            of competition or cooperation, what we are concerned about is not the whole society, but
            the development of an individual's whole life. From this point of view, I firmly believe
            that we should attach more importance to cooperation during primary education.
            First of all, through cooperation, children can learn about interpersonal skills which
            are significant in the future life of all students. What we acquired from team work is
            not only how to achieve the same goal with others but more importantly, how to get along
            with others. During the process of cooperation, children can learn about how to listen
            to opinions of others, how to communicate with others, how to think comprehensively, and
            even how to compromise with other team members when conflicts occurred. All of these
            skills help them to get on well with other people and will benefit them for the whole
            life.
            On the other hand, the significance of competition is that how to become more excellence
            to gain the victory. Hence it is always said that competition makes the society more
            effective. However, when we consider about the question that how to win the game, we
            always find that we need the cooperation. The greater our goal is, the more competition
            we need. Take Olympic games which is a form of competition for instance, it is hard to
            imagine how an athlete could win the game without the training of his or her coach, and
            the help of other professional staffs such as the people who take care of his diet, and
            those who are in charge of the medical care. The winner is the athlete but the success
            belongs to the whole team. Therefore without the cooperation, there would be no victory
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
            {chat.map((msg) => <Bubble text={msg.text} alignLeft={msg.user === 'bot'}/>)}
          </div>
          <div className={styles.inputBox}>
            <input
              value={input}
              onChange={(e) => this.setState({ input: e.target.value })}
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
