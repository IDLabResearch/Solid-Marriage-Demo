import React from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { LoggedIn, LoggedOut } from '@solid/react'
import MiniDrawer from './Components/MiniDrawer'
function App () {
  return (
    <div className="App">
      <LoggedIn>
        <MiniDrawer defaultview='help'></MiniDrawer>
      </LoggedIn>
      <LoggedOut>
        <MiniDrawer defaultview='help' sideBarItems={['login', 'help']} topBarItems={['help']} hidelogout={true}></MiniDrawer>
      </LoggedOut>
    </div>
  )
}

export default App
