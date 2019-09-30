import React from 'react'
import ReactDOM from 'react-dom'


import '../styles/base.scss'
import App from './components/App/App'


const rootComponent = (

        <App />
     
  );

ReactDOM.render(
    rootComponent,
  document.getElementById('app')
)