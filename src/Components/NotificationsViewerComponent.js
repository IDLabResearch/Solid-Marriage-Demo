import React from 'react'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'


const NotificationsViewerComponent = (props) => {
  return (
    <div id="notificationsviewercomponent" className='container'>
      <h4> Notifications </h4>
      <br />
      <p>Zoals op de website Vlaanderen.be met rechthoeken (3 per rij) voor notificaties.</p>
      <p>On click op een notificatie redirecten naar de locatie waarover de notificatie gaat</p>
      <p>Eventueel ook kleinere dropdown voorzien (if time left) </p>
    </div>
  )
}

export default NotificationsViewerComponent
