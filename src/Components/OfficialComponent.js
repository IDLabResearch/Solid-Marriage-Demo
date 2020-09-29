import React, { useState, useEffect } from 'react'
import useNotifications from '../hooks/useNotifications'
import ns from '../util/NameSpaces'
import { Col, Row, Button } from 'react-bootstrap'
import { getContractData, availableViews } from '../util/Util'

const { default: data } = require('@solid/query-ldflex');

const OfficialComponent = (props) => {

  const notifications = useNotifications(props.webId)
  const [submissions, setSubmissions] = useState([])

  useEffect(() => {
    let mounted = true;
    async function filterSubmissions() {
      const submissions = notifications.filter(notification => 
        notification.type === ns.as('Announce')
        && notification.object 
        && notification.object.object
        && notification.metadata.types.object.object === ns.demo('MarriageProposal'))
    
      const certifiedProposals = await filterCertifiedSubmissions(submissions)
      if (mounted) setSubmissions(submissions.filter(s => s.object && certifiedProposals.indexOf(s.object.object) === -1 && certifiedProposals.indexOf(s.object.target) === -1))
    }

    async function filterCertifiedSubmissions(submissions) {
      const certifiedProposals = []
      for await (const certifiedProposalId of await (data[props.webId][ns.demo('certified')])) {
        if (mounted && `${certifiedProposalId}`) certifiedProposals.push(`${certifiedProposalId}`)
      }
      return certifiedProposals
    }
    
    filterSubmissions();
    
    return () => {
      mounted = false;
    }
    
  }, [notifications])


  const viewsubmission = async (submissionContractId) => {
    const contract = await getContractData(submissionContractId)
    const view = availableViews.submissionview
    view.args = {contract: contract}
    props.setview(view)
  }

  return (
    <div className="container">
    <h4>Certification Requests</h4>
    <br />
    <Row className='propertyview pageheader' key={'header'}>
      <Col md={3}><label className="leftaligntext"><b>Submission type</b></label></Col>
      <Col md={5}><label className="leftaligntext">Current status</label></Col>
      <Col md={2}><label className="centeraligntext">Action</label></Col>
    </Row>
    {submissions.map(submission => {
      return (
        <Row className='propertyview ' key={submission.object}>
          <Col md={3}><label className="leftaligntext"><b>marriage proposal</b></label></Col>
          <Col md={5}><label className="leftaligntext">submitted for review</label></Col>
          <Col md={2}><Button onClick={() => viewsubmission(submission.object.object)} className='centeraligntext'>Evaluate</Button></Col>
        </Row>
      )
    })}

    </div>
    )
 
}

export default OfficialComponent