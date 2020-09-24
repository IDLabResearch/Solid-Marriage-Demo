import React, { useState, useEffect } from 'react'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button } from 'react-bootstrap'
import createnamespaces from "../util/NameSpaces"

import '../css/InProgressViewerComponent.css'
import useContracts from '../hooks/useContracts'
import { availableViews } from '../util/Util'

const ns = createnamespaces()
const { default: data } = require('@solid/query-ldflex');

const InProgressViewerComponent = (props) => {

  const contracts = useContracts(props.webId)

  const viewMarriage = function(contract){
    const view = availableViews.marriageview
    view.args = {contract: contract}
    props.setview(view)
  }

  return (
    <div id="InProgressViewerComponent" className='container'>
      <h4> Running Requests </h4>
      <br />
      {contracts.inprogress.map(contract => {
        return (  
          <li className='propertyview' key={contract.id}>
            <label className='propertylabel'>Marriage</label>
            <label className='valuelabelhalf'>Marriage requested</label>
            <Button onClick={() => viewMarriage(contract)} className='valuebutton' > See progress </Button>
          </li>
        )
      })}
     
    </div>
  )
}

export default InProgressViewerComponent
