import React from 'react'
import ReactLoading from 'react-loading';
import '../css/VCardComponent.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import { Button } from 'react-bootstrap'

import useProfile from '../hooks/useProfile'
import { availableViews } from '../util/Util';

const UNKNOWNVALUE = 'Value not set'

const ProfileViewerComponent = (props) => {
  const profile = useProfile(props.webId)

  if (! profile){
    return (
      <div id="profileviewercomponent" className='container'>
        <h4> Profile </h4>
        <br />
        <ReactLoading type={"cubes"}/>
      </div>
    )
  } 

  return (
    <div id="profileviewercomponent" className='container'>
      <h4> Profile </h4>
      <br />
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
      <Button onClick={() => props.setview(availableViews.profileeditor)}>Edit</Button>
    </div>
  )
}

const profileProps = {
  name: "Name",
  bdate: "BirthDate",
  location: "Country",
  cstatus: "Civil Status",
}

export default ProfileViewerComponent
