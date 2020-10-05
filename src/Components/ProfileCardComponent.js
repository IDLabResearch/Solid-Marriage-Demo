import React from 'react'
import useProfile from '../hooks/useProfile'
import styles from '../css/components/profilecard.module.css'
import { Col, Row } from 'react-bootstrap';
import { formatDate } from '../util/Util';

const ProfileCardComponent = (props) => {

  const profile = useProfile(props.webId)
  if(!profile || !profile.name) return(<div />);
  return (
    <div id="ProfileCardComponent" className={styles.container}>
      {profile && Object.keys(profileProps).map(property => {
        const value = profile[property] && (property === 'bdate' ? formatDate(profile[property]) : profile[property])
        return (
          <Row className={`propertyview ${styles.profilecardrow}`} key={property}>
            <Col sm={12} md={4}><label className="leftaligntext"><b>{profileProps[property]}</b></label></Col>
            <Col sm={12} md={8}>
              <label className="leftaligntext">
                {property === 'name' ? <a href={props.webId}>{value}</a> : <div>{value}</div>}
              </label>
            </Col>
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
  // cstatus: "Civil Status",
}

export default ProfileCardComponent
