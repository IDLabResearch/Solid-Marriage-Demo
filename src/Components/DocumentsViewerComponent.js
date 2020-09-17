import React from 'react'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button } from 'react-bootstrap'

import '../css/DocumentsViewerComponent.css'

const DocumentsViewerComponent = (props) => {
  return (
    <div id="documentsviewercomponent" className='container'>
      <h4> Running Requests </h4>
      <br />
      <li className='propertyview' key={"Nationality"}>
        <label className='propertylabel'>Marriage</label>
        <label className='valuelabelhalf'>Marriage requested</label>
        <Button className='valuebutton'> See progress </Button>
      </li>
    </div>
  )
}

export default DocumentsViewerComponent
