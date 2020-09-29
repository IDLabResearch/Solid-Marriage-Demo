import React, { useState, useEffect } from 'react'
import { getContractData, getCertificateData } from '../util/Util'
import { Row, Col } from 'react-bootstrap'
import ProfileCardComponent from './ProfileCardComponent'


// @prefix dbo: <http://dbpedia.org/ontology/>. dbo:birthDate, dbo:birthPlace
const CertificateViewComponent = (props) => {

  const [state, setstate] = useState({})

  useEffect(() => {
    let mounted = true
    async function fetchData(){
      const proposal = await getContractData(props.proposalId);
      const certificate = await getCertificateData(proposal.certified_by);
      setstate({ proposal, certificate })
    }
    fetchData()
    return () => {
      mounted = false
    }
  }, [])

  console.log('STATE', state)

  if (!state.proposal || !state.certificate) {
    return (
      <div id="marriageViewContainer" className='container' />
    )
  }
  return (
    <div id="marriageViewContainer" className='container'>
      <h4> Marriage Certificate </h4>
      <br />
      <Row className='propertyview pageheader'>
        <Col md={5}></Col>
        <Col md={2}><label className="leftaligntext"><a href={state.proposal.id}><b>Proposal</b></a></label></Col>
      </Row>
      {state.proposal.spouse.map(id => {
        return(
          <Row className='propertyview' key={'spouse' + id}>
            <Col md={2}><label className="leftaligntext"><b>Spouse</b></label></Col>
            <Col md={10}><ProfileCardComponent webId={id}></ProfileCardComponent></Col>
          </Row>
        )
      })}
      {state.proposal.witness.map(id => { 
        return(
          <Row className='propertyview' key={'witness' + id}>
            <Col md={2}><label className="leftaligntext"><b>Witness</b></label></Col>
            <Col md={10}><ProfileCardComponent webId={id}></ProfileCardComponent></Col>
          </Row>
        )
      })}

      <Row className='propertyview pageheader'>
        <Col md={5}></Col>
        <Col md={2}><label className="leftaligntext"><a href={state.certificate.id}><b>Certificate</b></a></label></Col>
      </Row>
      <Row className='propertyview' key={'certified_by'}>
        <Col md={2}><label className="leftaligntext"><b>Certified by</b></label></Col>
        <Col md={10}><label className="leftaligntext">{state.certificate.certified_by}</label></Col>
      </Row>
      <Row className='propertyview' key={'certification_date'}>
        <Col md={2}><label className="leftaligntext"><b>Certified on</b></label></Col>
        <Col md={10}><label className="leftaligntext">{new Date(state.certificate.certification_date).toLocaleString()}</label></Col>
      </Row>
    </div>
  )
}

export default CertificateViewComponent
