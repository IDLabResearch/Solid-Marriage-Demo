import React, { useState } from 'react'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import VCardViewerComponent from './VCardViewerComponent'
import VCardEditorComponent from './VCardEditorComponent'


const ProfileViewerComponent = (props) => {

  const [edit, setEdit] = useState(false)
  
  return (
    <div id="profileviewercomponent" className='container'>
      <h4> Profile </h4>
      <br />
      {!edit 
        ? <VCardViewerComponent webId={props.webId} setEdit={setEdit}></VCardViewerComponent> 
        : <VCardEditorComponent webId={props.webId} setEdit={setEdit}></VCardEditorComponent>
      }
    </div>
  )
}

export default ProfileViewerComponent
