import React from 'react';
import './App.css';
import {Button, Segment} from 'semantic-ui-react'

import Game from './ChessBoard';

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Segment compact padded='very' color='grey' inverted size='massive'>
          <Game/>
        </Segment>
      </div>
    );
  }
}

export default App;
