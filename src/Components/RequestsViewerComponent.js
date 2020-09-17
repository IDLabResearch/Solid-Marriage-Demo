import React, { useState } from 'react'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button } from 'react-bootstrap'

import MarriageRequestComponent from './MarriageRequestComponent'



const RequestsViewerComponent = (props) => {
  const [state, setstate] = useState(false)
  if (!state) {
    return (
      <div id="documentsviewercomponent" className='container'>
        <h4> Requests </h4>
        <br />
        <li className='propertyview' key={"Nationality"}>
          <label className='propertylabel'>Nationality</label>
          <Button className='valuebuttonhalf' disabled={true}>Initiate nationality request</Button>
        </li>
  
        <li className='propertyview' key={"Nationality"}>
          <label className='propertylabel'>Residence</label>
          <Button className='valuebuttonhalf' disabled={true}>Declare new residence</Button>
        </li>
  
        <li className='propertyview' key={"Marriage"}>
          <label className='propertylabel'>Marriage</label>
          <Button className='valuebuttonhalf' onClick={() => setstate(true)} >Request marriage</Button>
        </li>
      </div>  
    )
  } else {
    return (
      <MarriageRequestComponent webId={props.webId} setstate={setstate}></MarriageRequestComponent>
    )
  }
}

export default RequestsViewerComponent
