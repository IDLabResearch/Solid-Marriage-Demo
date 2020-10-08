import React, { useState, useEffect } from 'react'
import { Value } from '@solid/react';
import useNotifications from '../hooks/useNotifications'
import ns from '../util/NameSpaces'
import { Col, Row, Button } from 'react-bootstrap'
import { getContractData, availableViews, getProfileCertified } from '../util/Util'
import { getValArray } from '../singletons/QueryEngine';

const OfficialComponent = (props) => {

  const notifications = useNotifications(props.webId)
  const [submissions, setSubmissions] = useState([])

  const [certifiedContracts, setCertified] = useState([])
  const filteredSubmissions = submissions.filter(submission => submission.object && submission.object.object && certifiedContracts.indexOf(submission.object.object) === -1)

  useEffect(() => {
    const getCertifications = async() => setCertified(await getProfileCertified(props.webId))
    getCertifications()
  }, [props.webId])

  useEffect(() => {
    let mounted = true;
    async function filterSubmissions() {
      const newsubmissions = notifications.filter(notification => 
        notification.type === ns.as('Announce')
        && notification.object 
        && notification.object.object)
        // && notification.metadata.types.object.object === ns.demo('MarriageProposal'))
    
      const certifiedProposals = await filterCertifiedSubmissions()
      let filteredSubmissions = newsubmissions.filter(s => s.object && certifiedProposals.indexOf(s.object.object) === -1 && certifiedProposals.indexOf(s.object.target) === -1)
      filteredSubmissions = filteredSubmissions.filter(news => submissions.map(s=>s.metadata.id).indexOf(news.metadata.id) === -1)
      if (filteredSubmissions && filteredSubmissions.length) {
        if (mounted) setSubmissions(submissions.concat(filteredSubmissions))
      }
    }

    async function filterCertifiedSubmissions(submissions) {
      const certifiedProposals = []
      for (const certifiedProposalId of await getValArray(props.webId, ns.demo('certified'))) {
        if (mounted && certifiedProposalId) certifiedProposals.push(`${certifiedProposalId}`)
      }
      return certifiedProposals
    }
    
    filterSubmissions();
    
    return () => {
      mounted = false;
    }
    
  }, [notifications, submissions])


  const viewsubmission = async (submissionContractId) => {
    // const contract = await getContractData(submissionContractId)
    const view = availableViews.submissionview
    view.args = {contractId: submissionContractId}
    props.setview(view)
  }

  return (
    <div className="container">
    <h4>Certification Requests</h4>
    <br />
    <Row className='propertyview pageheader' key={'header'}>
      <Col md={3}><label className="leftaligntext"><b>Submission type</b></label></Col>
      <Col md={2}><label className="leftaligntext">Current status</label></Col>
      <Col md={3}><label className="leftaligntext">Submitted by</label></Col>
      <Col md={2}><label className="centeraligntext">Action</label></Col>
    </Row>
    {filteredSubmissions.map(submission => {
      return (
        <Row className='propertyview ' key={submission.metadata.id || submission.object}>
          <Col md={3}><label className="leftaligntext"><b>marriage proposal</b></label></Col>
          <Col md={2}><label className="leftaligntext">submitted for review</label></Col>
          <Col md={3}><label className="leftaligntext"><a href={submission.actor}><Value src={`[${submission.actor}].name`}/></a></label></Col>
          <Col md={2}><Button onClick={() => viewsubmission(submission.object.object)} className='centeraligntext'>Evaluate</Button></Col>
        </Row>
      )
    })}

    </div>
  )
  
 
}

export default OfficialComponent


/*


  const userContracts = useContracts(props.webId) || []
  const [certified, setCertified] = useState([])
  const allContracts = userContracts.filter(e => e.status && e.status === ns.demo('submitted'))
  const submissions = allContracts.filter(contract => certified.indexOf(contract.id) == -1)

  useEffect(() => {
    async function getCertifications() {
      setCertified(await getProfileCertified(props.webId) || [])
    }
    getCertifications()
  }, [])
*/