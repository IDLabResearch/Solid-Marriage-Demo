import React from 'react'
import ReactLoading from 'react-loading';
import '../css/VCardComponent.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import { Button } from 'react-bootstrap'

import useProfile from '../hooks/useProfile'
import { availableViews } from '../util/Util';
import { Label } from '@solid/react';

const UNKNOWNVALUE = 'Value not set'

const VCardViewerComponent = (props) => {
  const profile = useProfile(props.webId)

  if (! profile){
    return (
      <div id='VCardEditorComponent'>
        <ReactLoading type={"cubes"}/>
      </div>
    )
  } 

  const profileProps = {
    name: "Name",
    bdate: "BirthDate",
    location: "Country",
    cstatus: "Civil Status",
  }

  return (
    <div id="VCardViewerComponent">
      {Object.keys(profileProps).map(property => {
        return (
        <li className='propertyview' key={property}>
          <label className='propertylabel'>{profileProps[property]}</label>
          <label className='valuelabel'>{profile[property] || UNKNOWNVALUE}</label>
        </li>
        )
      })}
      <br />
      <br />
      <Button onClick={() => props.setEdit(true)}>Edit</Button>
    </div>
  )
}

export default VCardViewerComponent
