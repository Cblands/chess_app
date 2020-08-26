import React from 'react';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Home from './home';

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Home/>
      </div>
    );
  }
}

export default App;
