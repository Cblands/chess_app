import React from 'react';
import { Segment, Dimmer, Modal, Button, Header, Dropdown } from 'semantic-ui-react'
import { ToastContainer } from 'react-toastify';

import Game from './ChessBoard';

class Home extends React.Component {

  state = {
    dimmerActive: true,
    endGameModal: false,
    winner: '',
    userColor: '',
    message: ''
  }

  colorOptions = [
    { key: 'w', value: 'w', text: 'White' },
    { key: 'b', value: 'b', text: 'Black' },
  ]

  setUserColor = (e, data) => {
    this.setState({ userColor: data.value })
  }

  handleMatchEnd = (response) => {
    let winner = ''
    if (response.match_status === '1-0') {
      winner = 'w';
    } else if (response.match_status === '0-1') {
      winner = 'b';
    } else {
      winner = 'draw';
    }
    this.setState({
      endGameModal: true,
      winner: winner,
      message: response.message,
    })
  }

  handleHeader = (winner) => {
    if (winner === this.state.userColor) {
      return "Congratulations! You bested Harold the Chess Engine";
    } else if (winner === 'b' || winner === 'w') {
      return "Too bad, you were no match for Harold.";
    } else {
      return "Game Over";
    }
  }

  handleReplayClick = () => {
    this.setState({
      dimmerActive: !this.state.dimmerActive,
      userColor: '',
      endGameModal: false,
      winner: '',
      message: ''
    })
  }

  render() {
    const { dimmerActive, userColor, endGameModal, winner, message } = this.state;

    return (
      <div>
        <Segment compact padded='very' color='grey' inverted size='massive'>
          <Dimmer active={dimmerActive} page />
          {dimmerActive ?
            <Modal open={dimmerActive}>
              <Header> Welcome to Harold the Chess Engine </Header>
              <Modal.Content>
                <p>
                  Harold was developed by Julian, Ryan and Conor as part of a term project for ECE 470 at the University of Victoria. Enjoy!
                </p>
                <p>
                  Please select your colour to begin playing:
                </p>
                <Dropdown placeholder='Colour' options={this.colorOptions} onChange={(e, data) => this.setUserColor(e, data)} />
              </Modal.Content>
              <Modal.Actions>
                <Button positive disabled={userColor === ''} onClick={() => this.setState({ dimmerActive: !dimmerActive })}>Play!</Button>
              </Modal.Actions>
            </Modal>
            : <Game userColor={userColor} handleMatchEnd={this.handleMatchEnd} />}
          {endGameModal ?
            <Modal open={endGameModal}>
              <Header> {this.handleHeader(winner)} </Header>
              <Modal.Content>
                <p>
                  {message}
                </p>
                <p>
                  Would you like to play again?
                </p>
              </Modal.Content>
              <Modal.Actions>
                <Button positive onClick={() => this.handleReplayClick()}>Play Again!</Button>
                <Button negative onClick={() => this.setState({ endGameModal: false })}>Close</Button>
              </Modal.Actions>
            </Modal> : ""}
          <ToastContainer />
        </Segment>
      </div>
    );
  }
}

export default Home;