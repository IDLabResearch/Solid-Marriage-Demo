import React, { useState, useEffect } from 'react'

import Input from '@material-ui/core/Input';

import useProfile from '../hooks/useProfile'
import ProfileCardComponent from './ProfileCardComponent';
import { Row, Col } from 'react-bootstrap';

const ProfileCardSelectorComponent = (props) => {
  const [webIdInput, setWebIdInput] = useState(props.person.webId)

  const profile = useProfile(webIdInput)

  const webIdChangeHandler = (event) => {
    setWebIdInput(event.target.value)
  }
  useEffect(() => {
    if (profile && isProfile(profile)) props.setvalue(profile.webId); 
  }, [profile])

  const isComplete = (profile) => profile.name && profile.bdate && profile.location && profile.cstatus
  const isProfile = (profile) => profile.name
  const isOfAge = (profile) => profile.bdate && new Date(profile.bdate) && getAge(new Date(profile.bdate)) >= 18

  function getAge(DOB) {
    var today = new Date();
    var birthDate = new Date(DOB);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }    
    return age;
  }

  const warningStyle = {
    color: 'red',
  };

  function getWarnings(profile) {
    if(!profile || !isProfile(profile)) return webIdInput ? "Please enter a valid webId" : undefined
    if (!isOfAge(profile) || !isComplete(profile))
      return "The chosen profile is not complete or is not 18 years or older. Please select a person that is 18 years or older."
  }

  const warnings = getWarnings(profile)

  return (
    <div id="ProfileCardSelectorComponent">
      <Row className='propertyview ' key={props.person.id}>
        <Col md={3}><label className="leftaligntext"><b>{props.person.label}</b></label></Col>
        <Col md={9}><Input className="leftaligntext" value={webIdInput || ""} name="location" onChange={webIdChangeHandler}/></Col>
      </Row>
      {warnings && <b style={warningStyle}>{warnings}</b>}

      <Row className='propertyview ' key={props.person.id}>
        <Col md={3}></Col>
        <Col md={9}><ProfileCardComponent webId={webIdInput} key={webIdInput}></ProfileCardComponent></Col>
      </Row>
    </div>
  )
}

export default ProfileCardSelectorComponent
