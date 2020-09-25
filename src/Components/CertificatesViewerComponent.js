import React from 'react'
import useContracts from '../hooks/useContracts'
import { availableViews } from '../util/Util'
import { Row, Col } from 'react-bootstrap'


const CertificatesViewerComponent = (props) => {

  const contracts = useContracts(props.webId)

  const viewMarriage = function(contract){
    const view = availableViews.marriageview
    view.args = {contract: contract}
    props.setview(view)
  }

  return (
    <div id="certificatesviewercomponent" className='container'>
      <h4> Certificates </h4>
      <br />
      <Row className='propertyview pageheader' key={'header'}>
        <Col md={3}><label className="leftaligntext"><b>Certificate type</b></label></Col>
        <Col md={5}><label className="leftaligntext">Available certificates</label></Col>
        <Col md={3}><label className="centeraligntext">Request certificate</label></Col>
      </Row>

      <Row className='propertyview' key={'Nationality'}>
        <Col md={3}><label className="leftaligntext"><b>Nationality</b></label></Col>
        <Col md={5}><label className="leftaligntext">No certificate available</label></Col>
      </Row>
      <Row className='propertyview' key={'Residence'}>
        <Col md={3}><label className="leftaligntext"><b>Residence</b></label></Col>
        <Col md={5}><label className="leftaligntext">No certificate available</label></Col>
      </Row>

      {contracts.completed.map(contract => {
        return (  
          <Row className='propertyview' key={contract.id}>
            <Col md={3}><label className="leftaligntext"><b>Marriage</b></label></Col>
            <Col md={5}><label className="leftaligntext">certificate available</label></Col>
          </Row>
        )
      })}
     
    </div>
  )
}

export default CertificatesViewerComponent
