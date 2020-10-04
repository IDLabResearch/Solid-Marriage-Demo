import React, { useEffect } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { LoggedIn, LoggedOut } from '@solid/react'
import MiniDrawer from './Components/MiniDrawer'
function App () {


  useEffect(() => {
    document.title = "Solid Marriage Demo";
  }, []);


  return (
    <div className="App">
      <LoggedIn>
        <MiniDrawer defaultview='profile'></MiniDrawer>
      </LoggedIn>
      <LoggedOut>
        <MiniDrawer defaultview='login' sideBarItems={['login', 'help']} topBarItems={['help']} hidelogout={true}></MiniDrawer>
      </LoggedOut>
    </div>
  )
}

export default App
