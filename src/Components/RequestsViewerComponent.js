import React, { useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'

import MarriageRequestComponent from './MarriageRequestComponent'
import { availableViews } from '../util/Util'

const possibleRequests = [{
  typelabel: 'Nationality',
  summary: 'Request nationality',
  action: 'Initiate procedure',
  disabled:true,
}, {
  typelabel: 'Residence',
  summary: 'Declare new residence',
  action: 'Initiate procedure',
  disabled:true,
}, {
  typelabel: 'Marriage',
  summary: 'Request marriage',
  action: 'Initiate procedure',
  disabled:false,
}]

const RequestsViewerComponent = (props) => {
  return (
    <div id="RequestsViewerComponent" className='container'>
      <h4> Requests </h4>
      <br />
      <Row className='propertyview pageheader' key={'header'}>
        <Col md={3}><label className="leftaligntext"><b>Certificate type</b></label></Col>
        <Col md={5}><label className="leftaligntext">Summary</label></Col>
        <Col md={2}><label className="centeraligntext">Create request</label></Col>
      </Row>
      {possibleRequests.map(request => {
        return(
          <Row className='propertyview' key={request.typelabel}>
            <Col md={3}><label className="leftaligntext"><b>{request.typelabel}</b></label></Col>
            <Col md={5}><label className="leftaligntext">{request.summary}</label></Col>
            <Col md={2}><Button className='centeraligntext' onClick={() => props.setview(availableViews.marriagerequest)} disabled={request.disabled}>{request.action}</Button></Col>
          </Row>
        )
      })}
    </div>  
  )
}

export default RequestsViewerComponent
