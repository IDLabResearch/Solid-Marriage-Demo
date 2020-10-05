import React from 'react'
import ReactLoading from 'react-loading';
import '../css/VCardComponent.css'

import { Button, Row, Col } from 'react-bootstrap'

import useProfile from '../hooks/useProfile'
import { availableViews, formatDate } from '../util/Util';

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
        const value = profile[property] && (property === 'bdate' ? formatDate(profile[property]) : profile[property])
        return (
          <Row className='propertyview ' key={property}>
            <Col md={3}><label className="leftaligntext"><b>{profileProps[property]}</b></label></Col>
            <Col md={9}><label className="leftaligntext">{value || UNKNOWNVALUE}</label></Col>
          </Row>  
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
