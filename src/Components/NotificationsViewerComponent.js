import React from 'react'
import useNotifications from '../hooks/useNotifications'

// import { Col, Row, Grid } from 'react-flexbox-grid'
import styles from '../css/components/notificationcard.module.css'
import { Button, Row, Col } from 'react-bootstrap'
import { Value } from '@solid/react';

import ns from "../util/NameSpaces"

import { availableViews, getContractData, getNotificationTypes } from '../util/Util'

const NotificationsViewerComponent = (props) => {

  const notifications = useNotifications(props.webId)
  // Sort on notification modified (= created normally) in reverse order to get newest first
  const sortednotifications = notifications.sort( (a, b) => new Date(b.metadata.modified) - new Date(a.metadata.modified))
  return (
    <div id="notificationsviewercomponent" className='container'>
      <h4> Notifications </h4>
      <br />
      <Row className='propertyview pageheader' key={'header'}>
        <Col md={1}><label className="leftaligntext"><b>Type</b></label></Col>
        <Col md={2}><label className="leftaligntext">Sender</label></Col>
        <Col md={2}><label className="leftaligntext">Time received</label></Col>
        <Col md={5}><label className="leftaligntext">Summary</label></Col>
        <Col md={2}><label className="centeraligntext">Action</label></Col>
      </Row>
      {notifications.map(notification => {
        return ( <NotificationCard notification={notification} {...props} key={notification.metadata.id}/> )
      })}
      
    </div>
  )
}

export default NotificationsViewerComponent

const NotificationCard = (props) => {
  const notification = props.notification
  // TODO;; this will fail if you have no view access to the contract
  function getButton() {
    switch (notification.type) {
      case ns.as('Accept'):
        return (<Button className={'centeraligntext'} onClick={() => viewmarriage(notification.target)}>See progress</Button>)
      case ns.as('Reject'):
        return (<Button className={'centeraligntext'} onClick={() => viewmarriage(notification.target)}>See progress</Button>)
      case ns.as('Offer'):
        return (<Button className={'centeraligntext'} onClick={() => viewmarriage(notification.target)}>See offer</Button>)
      case ns.as('Announce'):
        return (<Button className={'centeraligntext'} onClick={() => viewsubmission(notification.object.object)}>See submission</Button>)
      default:
        return (<div />)
    }
  }

  return (
    <div className={`NotificationCard`}>
      <Row className='propertyview' key={notification.metadata.id}>
        <Col md={1}><label className='leftaligntext'><b>{notification.type && notification.type.split('#')[1]}</b></label></Col>
        <Col md={2}><label className='leftaligntext'><a href={notification.actor}><Value src={`[${notification.actor}].name`}/></a></label></Col>
        <Col md={2}><label className='leftaligntext'><b>{notification.metadata.modified && notification.metadata.modified.toLocaleString()}</b></label></Col>
        <Col md={5}><label className='leftaligntext'>{notification.summary}</label></Col>
        <Col md={2}>{getButton()}</Col>
      </Row>
    </div>
  )

  async function viewmarriage(marriageId) {
    const contract = await getContractData(marriageId) 
    const view = availableViews.marriageview
    view.args = {contract: contract}
    props.setview(view)
  }

  async function viewsubmission(submissionId) {
    const contract = await getContractData(submissionId) 
    const view = availableViews.submissionview
    view.args = {contract: contract}
    props.setview(view)
  }
}