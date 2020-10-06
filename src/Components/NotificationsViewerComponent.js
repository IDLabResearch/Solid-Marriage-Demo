import React, { useState } from 'react'
import useNotifications from '../hooks/useNotifications'
import styles from '../css/components/marriageview.module.css'

// import { Col, Row, Grid } from 'react-flexbox-grid'
import { Button, Row, Col } from 'react-bootstrap'
import { Value } from '@solid/react';

import ns from "../util/NameSpaces"

import { availableViews, getContractData } from '../util/Util'
import { deleteFile } from '../util/FileUtil';

const NotificationsViewerComponent = (props) => {

  const notifications = useNotifications(props.webId)
  const [deleted, setDeleted] = useState([])
  // Sort on notification modified (= created normally) in reverse order to get newest first
  const nondeletedNotifications = notifications.filter(n => deleted.indexOf(n.metadata.id) === -1)
  const sortednotifications = nondeletedNotifications.sort( (a, b) => new Date(b.metadata.modified) - new Date(a.metadata.modified))


  async function deleteNotification(notificationId) {
    deleteFile(notificationId);
    setDeleted(deleted.concat(notificationId))
  }

  return (
    <div id="notificationsviewercomponent" className='container'>
      <h4> Notifications </h4>
      <br />
      <Row className='propertyview pageheader' key={'header'}>
        <Col md={1}><label className="leftaligntext"><b>Type</b></label></Col>
        <Col md={2}><label className="leftaligntext">Sender</label></Col>
        <Col md={2}><label className="leftaligntext">Time received</label></Col>
        <Col md={4}><label className="leftaligntext">Summary</label></Col>
        <Col md={2}><label className="centeraligntext">Action</label></Col>
      </Row>
      {sortednotifications.map(notification => {
        return ( <NotificationCard notification={notification} {...props} key={notification.metadata.id} deleteNotification={deleteNotification}/> )
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
        if (notification.object.type && notification.object.type === ns.as('Create') ) { // && notification.metadata.types.object.object === ns.demo('MarriageProposal')) {
          // Filter announcement of the creation of a marriage Proposal
          return (<Button className={'centeraligntext'} onClick={() => viewsubmission(notification.object.object)}>See submission</Button>)
        } else if (notification.object.type && notification.object.type === ns.as('Add')) { // && notification.metadata.types.object.object === ns.demo('Certificate')) {
          // Filter announcement of the creation of a certificate
          return (<Button className={'centeraligntext'} onClick={() => viewCertificate(notification.object.target)}>See certificate</Button>)
        }  else {
          // Filter announcement of the rejection of a certificate
          return (<Button className={'centeraligntext'} onClick={() => viewRejections()}>view</Button>)
        }
        
      default:
        return (<div />)
    }
  }

  return (
    <div className={`NotificationCard`}>
      <Row className='propertyview' key={notification.metadata.id}>
        <Col md={1}><label className='leftaligntext'>{notification.type && notification.type.split('#')[1]}</label></Col>
        <Col md={2}><label className='leftaligntext'><a href={notification.actor}><Value src={`[${notification.actor}].name`}/></a></label></Col>
        <Col md={2}><label className='leftaligntext'>{notification.metadata.modified && notification.metadata.modified.toLocaleString()}</label></Col>
        <Col md={4}><label className='leftaligntext'>{notification.summary}</label></Col>
        <Col md={2}>{getButton()}</Col>
        <Col md={1}><Button className={`${styles.delete} centeraligntext`} onClick={() => props.deleteNotification(notification.metadata.id)}>X</Button></Col>
      </Row>
    </div>
  )

  async function viewmarriage(marriageId) {
    // const contract = await getContractData(marriageId) 
    const view = availableViews.marriageview
    view.args = {contractId: marriageId}
    props.setview(view)
  }

  async function viewsubmission(submissionId) {
    // const contract = await getContractData(submissionId) 
    const view = availableViews.submissionview
    view.args = {contractId: submissionId}
    props.setview(view)
  }

  async function viewCertificate(submissionId) {
    const view = availableViews.certificateview
    view.args = {proposalId: submissionId}
    props.setview(view)
  }

  async function viewRejections() {
    props.setview(availableViews.running)
  }

  async function deleteNotification(notificationId) {
    const result = await deleteFile(notificationId)
  }
}