import React from 'react'
import { Row, Col } from 'react-bootstrap'


const HelpComponent = (props) => {
  return (
    <div id="InProgressViewerComponent" className='container'>
      <h4> About this Demo </h4>
      <br />
      This screen will provide information on how the steps for this demo, and how they can be performed (with images preferably)
      I also would like to make this not a single page app, so I can link people to the help page (or even make this the landing screen)
      But I have not yet worked with the routing options for react, but that would be a nice to have
      <br />

      <Row>
        
      </Row>

      <div >
        <p><b>TODOS</b></p>
        <p>Complete help component</p>
        <p>Button to resend notification on pending</p>
        <p>Delete (read) notifications</p>
        <p>Have notification actions fire on receive and not on looking at specific view</p>
        <p>Highlight active component left bar</p>
        <p>Make left bar subtractable</p>
        <p>Finish implementation delete mariage proposal</p>
        <p>Mark notifications as read</p>
        <p>Highlight hovered notification</p>
        <p>Encryption and signing for accepting invitation and for certificate</p>
        <p>What to do with the official? Allow it to be anyone and give input field?</p>
        <p>Update civil status on certification (of both spouses, possibly via a notification)</p>
        <p>Make all contracts visible for all actors involved</p>
        <p>Only load notifications that were not load last time</p>
        <p>Is it okay to use this demo vocabulary?</p>
        <p>What to do with default storage locations?</p>
        <p>Use Solid file clients to recursively create folders if a specified storage location does not yet exist?</p>
        <p>More error handling for missing data fields in files</p>
        <p><b>If data not yet retrieved, dont show pending!</b></p>
        <p>Unify internal naming scheme: proposal and certificate</p>
        <p>Provide delete proposal for intermediary steps</p>
        <p>JSDoc all functions</p>
        <p>convert components to have logic for data retrieval somewhere else?</p>
      </div>
      
      
    

          set all created data to a specific name and provide delete button at the end to remove all demo data (except for name?) so that if people use their real data pod it wont get that messy?

      SET LEFT BAR SELECTED ITEM HIGHLIGHT

      set other key items in lists in case of duplicate subjects

      code comments

      convert large components - save additional logic in a controller file?
    </div>
  )
}

export default HelpComponent
