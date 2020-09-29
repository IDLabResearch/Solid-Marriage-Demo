import React, { useState, useEffect } from 'react'

import Input from '@material-ui/core/Input';

import useProfile from '../hooks/useProfile'
import styles from '../css/components/profilecard.module.css'
import { Col, Row } from 'react-bootstrap';

const ProfileCardComponent = (props) => {

  const profile = useProfile(props.webId)
  if(!profile || !profile.name) return(<div />);
  return (
    <div id="ProfileCardComponent" className={styles.container}>
      {profile && Object.keys(profileProps).map(property => {
        return (
          <Row className={`propertyview ${styles.profilecardrow}`} key={property}>
            <Col sm={12} md={4}><label className="leftaligntext"><b>{profileProps[property]}</b></label></Col>
            {property === 'name'
            ?<Col sm={12} md={8}><label className="leftaligntext"><a href={props.webId}>{profile[property]}</a></label></Col>
            :<Col sm={12} md={8}><label className="leftaligntext">{profile[property]}</label></Col>}
          </Row>
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
