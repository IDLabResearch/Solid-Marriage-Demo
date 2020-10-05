import React, {useState, useEffect} from 'react'
import useContracts from '../hooks/useContracts'
import { availableViews, getNotificationTypes } from '../util/Util'
import { Row, Col, Button } from 'react-bootstrap'
import ns from "../util/NameSpaces"
import useNotifications from '../hooks/useNotifications'
import { setProposalValidatedBy } from '../util/MarriageController'



const CertificatesViewerComponent = (props) => {

  // Retrieve notifications

  const notifications = useNotifications(props.webId)
  const contracts = useContracts(props.webId)
  const [certifiedContacts, setCertifiedContracts] = useState([])
  console.log('notifications', notifications)

  useEffect(() => {
    let mounted = true;

    // This function updates the present submissions in case of a notification indicating that a certificate has been created
    const updateProposals = async (submittedContracts) => {
      const certificationNotices = notifications.filter(notification => 
        notification.type === ns.as('Announce')
        && notification.object 
        && notification.object.object
        && notification.metadata.types.object.object === ns.demo('Certificate'))
        
      // TODO:: inblude if rejected, and move this more elaborate code to a separate controller.
      for (let contract of submittedContracts){
        const contractNotifications = certificationNotices.filter(n => n.object.target === contract.id)
        if (contractNotifications.length > 0) {
          const certificateId = contractNotifications[0].object.object
          const contractId = contractNotifications[0].object.target
          await setProposalValidatedBy(contractId, certificateId, "accepted")
          contract.status = "accepted"
          alreadyCertifiedContracts.push(contract)
        }
      }
      setCertifiedContracts(alreadyCertifiedContracts)
    }

    const alreadyCertifiedContracts = contracts.filter(c => c.status === ns.demo('accepted')).concat(contracts.filter(c => c.status === ns.demo('rejected')))
    const submittedContracts = contracts.filter(c => c.status === ns.demo('submitted'))
    if (submittedContracts.length) { // check if submitted contract has been certified
      updateProposals(submittedContracts)
    } else {
      setCertifiedContracts(alreadyCertifiedContracts)
    }
    return () => {
      mounted = false;
    }
  }, [notifications, contracts])


  async function showCertificateViewer(contractId) {
    const view = availableViews.certificateview
    view.args = {proposalId: contractId}
    console.log('setting view', view)
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
      { certifiedContacts.length
        ? 
          certifiedContacts.map((contract, index) => {
            return (
              <Row className='propertyview' key={contract.id}>
                {index === 0 ? <Col md={3}><label className="leftaligntext"><b>Marriage</b></label></Col> : <Col md={3} /> }
                <Col md={5}><label className="leftaligntext">Certificate available</label></Col>
                <Col md={3}><Button onClick={(() => showCertificateViewer(contract.id))}>View certificate</Button></Col>
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

// {contracts.map(contract => {
//   return (  
//     <Row className='propertyview' key={contract.id}>
//       <Col md={3}><label className="leftaligntext"><b>Marriage</b></label></Col>
//       <Col md={5}><label className="leftaligntext">certificate available</label></Col>
//     </Row>
//   )
// })}