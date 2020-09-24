import React, { useState, useEffect } from 'react'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import Input from '@material-ui/core/Input';

import useProfile from '../hooks/useProfile'
import ProfileCardComponent from './ProfileCardComponent';

const ProfileCardSelectorComponent = (props) => {
  const [webIdInput, setWebIdInput] = useState(props.person.webId)
  const [selectedWebId, setSelectedWebId] = useState(props.person.webId)

  const profile = useProfile(selectedWebId)

  const webIdChangeHandler = (event) => {
    setWebIdInput(event.target.value)
  }

  const onKeyDownHandler = (event) => {
    if (event.key === 'Enter') setSelectedWebId(webIdInput)
  }
  
  useEffect(() => {
    props.setvalue(selectedWebId);
  }, [selectedWebId])

  const isComplete = (profile) => profile.name && profile.bdate && profile.location && profile.cstatus
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
    if(!profile) return webIdInput ? "Please enter a valid webId" : undefined
    if (!isComplete(profile)) 
      return "The given WebId is invalid or the profile is not complete. Please provide a valid WebId where all profile information is filled in."
    if (!isOfAge(profile))
      return "The chosen profile is not 18 years or older. Please select a person that is 18 years or older."
  }

  const warnings = getWarnings(profile)

  return (
    <div id="ProfileCardSelectorComponent">
      <li className='propertyview'>
        <label className='propertylabel'>{props.person.label}</label>
        <Input id='webIdInput' className='valuelabel' value={webIdInput || ""} name="location" onKeyDown={onKeyDownHandler} onChange={webIdChangeHandler}/>
      </li>
      {warnings && <b style={warningStyle}>{warnings}</b>}
      <li> Selected Profile:</li>
      <ProfileCardComponent webId={selectedWebId} key={selectedWebId}></ProfileCardComponent>
    </div>
  )
}

const profileProps = {
  name: "Name",
  bdate: "BirthDate",
  location: "Country",
  cstatus: "Civil Status",
}

export default ProfileCardSelectorComponent
