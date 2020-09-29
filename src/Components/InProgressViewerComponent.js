import React from 'react'
import { Button, Row, Col } from 'react-bootstrap'

import ns from "../util/NameSpaces"
import '../css/InProgressViewerComponent.css'
import useContracts from '../hooks/useContracts'
import { availableViews } from '../util/Util'

const InProgressViewerComponent = (props) => {

  const userContracts = useContracts(props.webId)
  const contracts = userContracts.filter(e => !e.status || e.status === ns.demo('proposal'))

  const viewMarriage = function(contract){
    const view = availableViews.marriageview
    view.args = {contract: contract}
    props.setview(view)
  }

  return (
    <div id="InProgressViewerComponent" className='container'>
      <h4>In Progress</h4>
      <br />
      <Row className='propertyview pageheader' key={'header'}>
        <Col md={3}><label className="leftaligntext"><b>Contract type</b></label></Col>
        <Col md={5}><label className="leftaligntext">Current status</label></Col>
        <Col md={2}><label className="centeraligntext">Action</label></Col>
      </Row>
      {contracts.map(contract => {
        return (  
          <Row className='propertyview ' key={contract.id}>
            <Col md={3}><label className="leftaligntext"><b>marriage proposal</b></label></Col>
            <Col md={5}><label className="leftaligntext">in progress</label></Col>
            <Col md={2}><Button onClick={() => viewMarriage(contract)} className='centeraligntext'>see progress</Button></Col>
          </Row>
        )
      })}
     
    </div>
  )
}

export default InProgressViewerComponent
