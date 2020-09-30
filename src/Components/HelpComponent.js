import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { availableViews } from '../util/Util';

const HelpComponent = (props) => {
  return (
    <div id="HelpComponent" className='container leftaligntext'>
      <h4 className='container centeraligntext'>How to get married with SOLID in 10 simple steps</h4>

      
      <Row>
        <Col md={1}>{availableViews.login.icon}</Col>
        <Col md={11}><h4>Preliminaries</h4></Col>
      </Row>

      <Row>
        <Col md={1}></Col>
        <Col md={11}>
          <p>Before starting this demonstration for SOLID, you are expected to have created a SOLID pod.</p>
          <p>In case you do not do not yet have a SOLID pod available, you can create a pod on <a href={'https://solid.community/register'}>solid community</a>.</p>
          <p>(or using login button - choose provider - register account. But this should be explained with pictures)</p>
        </Col>
      </Row>
     
      <br />
      
      
      <Row>
        <Col md={1}>{availableViews.profile.icon}</Col>
        <Col md={11}><h4>Step 1 - Complete user profile</h4></Col>
      </Row>

      <Row>
        <Col md={1}></Col>
        <Col md={11}>
          <p>The first step of this demonstration is to fill out your profile information.</p>
          <p>This ensures that subsequent steps in the demonstration can retrieve some information from your pod to show in the forms.</p>
          <p>You can find (some of) your profile information in the profile tab on the left.</p>
          <p>In this tab, you can edit your profile information by clicking the <Button>Edit</Button> button.</p>
          <p>In the edit screen, you can fill in your profile information in the fields, and submit the using the <Button type="submit">Submit</Button> button.</p>
          <p>All fields are mandatory!</p>
        </Col>
      </Row>
     
      <br />

      <Row>
        <Col md={1}>{availableViews.requests.icon}</Col>
        <Col md={11}><h4>Step 2 - Planning a Wedding</h4></Col>
      </Row>

      <Row>
        <Col md={1}></Col>
        <Col md={11}>
          <p>Now that your profile information is filled in, you can start planning your wedding.</p>
          <p>Tho initiate the marriage procedure, go to the Requests tab.</p>
          <p>Here, the procedure can be initiated by clicking <Button>Initiate procedure</Button> for the Marriage certificate type</p>
          <p>Now, you will find your information already filled out as one of the spouses.</p>
          <p>A marriage requires two spouses to be given, as well as one or more witnesses.</p>
          <p>If a valid webId is filled in, the profile of that person will be filled in automatically.</p>
          <p>In case the given profile is incomplete, an error message will be shown. Please choose a different webId, or wait for the person to complete their profile.</p>
          <p>If all necessary information is filled in, the proposal is ready to be submitted.</p>
          <p>You can use the default storage location to store the created marriage proposal, or select a custom location (please make sure the selected location is valid).</p>
          <p>Now, you can submit the marriage proposal using <Button>Submit</Button></p>
        </Col>
      </Row>
     
      <br />

      <Row>
        <Col md={1}>{availableViews.running.icon}</Col>
        <Col md={11}><h4>Step 3 - Confirming requests</h4></Col>
      </Row>

      <Row>
        <Col md={1}></Col>
        <Col md={11}>
          <p>On submission of a marriage proposal, all parties (spouses and witnesses) are notified of the created proposal.</p>
          <p>These notifications can be found in the inbox of your data pod (the default location is at /inbox).</p>
          TODO :: submissions folder - check notifications and add running proposal for marriage if notification of that.
          TODO :: on accept / rejection - add to hasContracts !


          <p>Now, you can see the marriage proposal, and all people involved in the proposal.</p>
          <p>In this form, you will see a .</p>

        </Col>
      </Row>
    
      <br />




      <h4>Step3: Awaiting confirmations</h4>
      <p>
      </p>
      <br />


      <h4>Step4: Submitting the wedding proposal</h4>
      <p>
      </p>
      <br />

      {availableViews.official.icon} <h4>Step5: Accepting / rejecting a marriage proposal</h4>
      <p>
      </p>
      <br />

      <h4>Preliminaries</h4>
      <p>
      </p>
      <br />
      



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
        <p>make profile edit screen more clear</p>
      </div>
      
      
    

          set all created data to a specific name and provide delete button at the end to remove all demo data (except for name?) so that if people use their real data pod it wont get that messy?

      SET LEFT BAR SELECTED ITEM HIGHLIGHT

      set other key items in lists in case of duplicate subjects

      code comments

      convert large components - save additional logic in a controller file?

      <br />
      This screen will provide information on how the steps for this demo, and how they can be performed (with images preferably)
      I also would like to make this not a single page app, so I can link people to the help page (or even make this the landing screen)
      But I have not yet worked with the routing options for react, but that would be a nice to have
      <br />
    </div>
    
  )
}

export default HelpComponent
