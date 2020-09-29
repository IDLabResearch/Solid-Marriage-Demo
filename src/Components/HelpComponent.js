import React from 'react'
import { Col } from 'react-bootstrap'


const HelpComponent = (props) => {
  return (
    <div id="InProgressViewerComponent" className='container'>
      <h4> About this Demo </h4>
      <br />
      This screen will provide information on how the steps for this demo, and how they can be performed (with images preferably)
      I also would like to make this not a single page app, so I can link people to the help page (or even make this the landing screen)
      But I have not yet worked with the routing options for react, but that would be a nice to have
      <br />

      <Row className='propertyview pageheader'>
        <Col><b>TODOS</b></Col>
        <Col>Complete help component</Col>
        <Col>Finish implementation delete mariage proposal</Col>
        <Col>Button to resend notification on pending</Col>
        <Col>Mark notifications as read</Col>
        <Col>Delete (read) notifications</Col>
        <Col>Highlight hovered notification</Col>
        <Col>Highlight active component left bar</Col>
        <Col>Encryption and signing for accepting invitation and for certificate</Col>
        <Col>What to do with the official? Allow it to be anyone and give input field?</Col>
        <Col>Update civil status on certification (of both spouses, possibly via a notification)</Col>
        <Col>Make all contracts visible for all actors involved</Col>
        <Col>Only load notifications that were not load last time</Col>
        <Col>Is it okay to use this demo vocabulary?</Col>
        <Col>What to do with default storage locations?</Col>
        <Col>Use Solid file clients to recursively create folders if a specified storage location does not yet exist?</Col>
        <Col>More error handling for missing data fields in files</Col>
        <Col><b>If data not yet retrieved, dont show pending!</b></Col>
        <Col>Unify internal naming scheme: proposal and certificate</Col>
        <Col>Provide delete proposal for intermediary steps</Col>
        <Col>JSDoc all functions</Col>
        <Col>convert components to have logic for data retrieval somewhere else?</Col>
      </Row>
      
      
    

          set all created data to a specific name and provide delete button at the end to remove all demo data (except for name?) so that if people use their real data pod it wont get that messy?

      SET LEFT BAR SELECTED ITEM HIGHLIGHT

      set other key items in lists in case of duplicate subjects

      code comments

      convert large components - save additional logic in a controller file?
    </div>
  )
}

export default HelpComponent
