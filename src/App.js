import React from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { LoggedIn, LoggedOut } from '@solid/react'
import ClippedDrawer from './Components/ClippedDrawer'
import EmptyDrawer from './Components/EmptyDrawer'
function App () {
  return (
    <div className="App">
      <LoggedIn>
        <ClippedDrawer></ClippedDrawer>
      </LoggedIn>
      <LoggedOut>
        <EmptyDrawer></EmptyDrawer>
      </LoggedOut>
    </div>
  )
}

export default App
