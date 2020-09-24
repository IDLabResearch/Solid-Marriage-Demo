import React, { useState, useEffect } from 'react'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import Input from '@material-ui/core/Input';

import useProfile from '../hooks/useProfile'
import styles from '../css/components/profilecard.module.css'

const ProfileCardComponent = (props) => {

  const profile = useProfile(props.webId)
  console.log('profile', profile)

  if(!profile) return(<div />);

  return (
    <div id="ProfileCardComponent" className={styles.container}>
      {profile && Object.keys(profileProps).map(property => {
        return (
        <li className={styles.listitem} key={property}>
          <label className={`${styles.propertylabel} ${'propertylabel'}`}><b>{profileProps[property]}</b></label>
          <label className={`${styles.valuelabel} ${'valuelabel'}`}>{profile[property]}</label>
        </li>
        )
      })}
    </div>
  )
}

const profileProps = {
  name: "Name",
  bdate: "BirthDate",
  location: "Country",
  cstatus: "Civil Status",
}

export default ProfileCardComponent
