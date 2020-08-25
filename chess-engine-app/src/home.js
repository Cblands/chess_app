import React from 'react';
import { Segment, Dimmer, Modal, Button, Header, Dropdown } from 'semantic-ui-react'

import Game from './ChessBoard';

class Home extends React.Component {

  state = {
    dimmerActive: true,
    userColor: ''
  }

  colorOptions = [
    { key: 'w', value: 'w', text: 'White'},
    { key: 'b', value: 'b', text: 'Black'},
  ]

  setUserColor = (e, data) => {
    this.setState({ userColor: data.value }, () => console.log(this.state.userColor))
  }

  render() {
    const { dimmerActive, userColor } = this.state;

    return (
      <div>
        <Segment compact padded='very' color='grey' inverted size='massive'>
          <Dimmer active={dimmerActive} page />
          {dimmerActive ?
            <Modal open={dimmerActive}>
              <Header> Welcome to the Harold Chess Engine </Header>
              <Modal.Content>
                <p>
                  Please select your colour to begin playing:
                </p>
                <Dropdown placeholder='Colour' options={this.colorOptions} onChange={(e, data) => this.setUserColor(e, data)}/> 
              </Modal.Content>
              <Modal.Actions>
                <Button positive disabled={userColor === ''} onClick={() => this.setState({ dimmerActive: !dimmerActive })}>Play!</Button>
              </Modal.Actions>
            </Modal>
            : <Game userColor={userColor}/>}
          
        </Segment>
      </div>
    );
  }
}

export default Home;