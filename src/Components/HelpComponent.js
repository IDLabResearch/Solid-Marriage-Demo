import React from 'react'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'


const HelpComponent = (props) => {
  return (
    <div id="InProgressViewerComponent" className='container'>
      <h4> About this Demo </h4>
      <br />
      This screen will provide information on how the steps for this demo, and how they can be performed (with images preferably)
      I also would like to make this not a single page app, so I can link people to the help page (or even make this the landing screen)
      But I have not yet worked with the routing options for react, but that would be a nice to have
    </div>
  )
}

export default HelpComponent
