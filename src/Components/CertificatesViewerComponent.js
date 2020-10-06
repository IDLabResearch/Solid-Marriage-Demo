import React, {useState, useEffect} from 'react'
import useContracts from '../hooks/useContracts'
import { availableViews } from '../util/Util'
import { Row, Col, Button } from 'react-bootstrap'
import ns from "../util/NameSpaces"



const CertificatesViewerComponent = (props) => {

  const userContracts = useContracts(props.webId) || []
  const contracts = userContracts.filter(e => e.status && e.status === ns.demo('accepted'))

  async function showCertificateViewer(contractId) {
    const view = availableViews.certificateview
    view.args = {proposalId: contractId}
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
      { contracts.length // certifiedContacts.length
        ? 
          contracts.map((contract, index) => { //certifiedContacts.map((contract, index) => {
            if(contract.status === ns.demo('accepted')) return (
              <Row className='propertyview' key={contract.id}>
                {index === 0 ? <Col md={3}><label className="leftaligntext"><b>Marriage</b></label></Col> : <Col md={3} /> }
                <Col md={5}><label className="leftaligntext">Certificate available</label></Col>
                <Col md={3}><Button onClick={(() => showCertificateViewer(contract.id))}>View certificate</Button></Col>
              </Row>
            )
            if (contract.status === ns.demo('rejected')) return (
              <Row className='propertyview' key={contract.id}>
                {index === 0 ? <Col md={3}><label className="leftaligntext"><b>Marriage</b></label></Col> : <Col md={3} /> }
                <Col md={5}><label className="leftaligntext">Proposal rejected</label></Col>
              </Row>
            )
          })
        :
          <Row className='propertyview' key={'Marriage'}>
            <Col md={3}><label className="leftaligntext"><b>Marriage</b></label></Col>
            <Col md={5}><label className="leftaligntext">No certificate available</label></Col>
          </Row>
      }     
    </div>
  )
}

export default CertificatesViewerComponent