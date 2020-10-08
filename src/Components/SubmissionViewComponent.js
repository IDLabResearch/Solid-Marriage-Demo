import React, { useState, useEffect } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import styles from '../css/components/marriageview.module.css'

import ns from "../util/NameSpaces"
import ProfileCardComponent from './ProfileCardComponent'
import { certifyProposal, rejectProposal } from '../util/MarriageController'
import { availableViews, getContractData } from '../util/Util'
import { parseURL } from 'url-toolkit'
import { getValArray } from '../singletons/QueryEngine'

const INVITATIONACCEPTED = ns.demo('accepted')
const INVITATIONREFUSED = ns.demo('refused')

// TODO:: remove marriage button only for creator
// TODO:: If spouse if 2 times the same person it will only show once (same for witnesses) because of ldflex => update this to use N3 in usecontracts?

/**
 * 
 * @param {spouse: {id: string}[], witness: {id: string}[]} props.contacts 
 */
const SubmissionViewComponent = (props) => {
  
  const [contract, setcontract] = useState(undefined);
  let allcontacts = [];
  if (contract){
    allcontacts =  contract.spouse.map(e => { e.type='spouse'; return e})
    allcontacts = allcontacts.concat(contract.witness.map(e => { e.type='witness'; return e}))
    allcontacts = allcontacts.map(e => { e['status'] = e['status'] || 'loading' ; return e})
  }
  const [contacts, setContacts] = useState(allcontacts)

  const parsedURI = parseURL(props.webId)
  const storageLocation = parsedURI.scheme + parsedURI.netLoc + '/public/'

  // Load in contract data
  useEffect(() => {
    let mounted = true
    getContractData(props.contractId).then(contract => {
      if (mounted) setcontract(contract || null)
    })
    return () => mounted = false;
  }, [props.contractId])

  // Set contacts status
  useEffect(() => {
    if (!contract) return;
    let mounted = true
    async function refreshContacts() {
      updateContacts(allcontacts).then(updatedContacts => {
        if(mounted) setContacts(updatedContacts)
      })
    }
    refreshContacts();
    return () => {
      mounted = false;
    }
  }, [contract])

  async function getContactStatus(contactWebId){
    let accepted, refused; 
    for await (const acceptedEvent of await getValArray(contactWebId, INVITATIONACCEPTED) ) {
      if (`${await acceptedEvent}` === props.contractId) accepted = true;
    }
    for await (const refusedEvent of await getValArray(contactWebId, INVITATIONREFUSED) ){
      if (`${await refusedEvent}` === props.contractId) refused = true;
    }
    return accepted ? 'accepted' : (refused ? 'refused' : 'pending')
  }

  async function updateContacts(contactsToUpdate) {
    const contacts = []
    for (let contact of contactsToUpdate){
      contact['status'] = await getContactStatus(contact.id)
      contacts.push(contact)
    }
    return contacts
  }


  function showContactStatus(contact){
    switch (contact.status) {
      case 'accepted':
        return "Accepted"
      case 'refused':
        return "Refused"
      case 'loading':
        return "Loading"
      case 'pending':
        return "Pending"
    }
    return "Loading"
  }


  function isComplete() {
    for (let contact of contacts) {
      if (contact.status !== "accepted") return false
    }
    return true 
  }

  function accept() {
    certifyProposal(props.webId, props.contractId, storageLocation)
    props.setview(availableViews.official)
  }

  function reject() {
    // Todo:: set as certified so additional requests are not shown as needed to be validated
    rejectProposal(props.webId, props.contractId)
    props.setview(availableViews.official)
  }

  if (contract === undefined) {
    return (
      <div id="marriageViewContainer" className='container'>
        <h4> Marriage Proposal </h4>
        <br />
        <h6>Loading Marriage proposal.</h6>
      </div>
    )
  } else if (!contract) {
    return (
      <div id="marriageViewContainer" className='container'>
        <h4> Marriage Proposal </h4>
        <br />
        <h6>The requested proposal could not be retrieved. The resource has been removed or does not exist.</h6>
      </div>
    )
  }
  return (
    <div id="marriageViewContainer" className='container'>
      <h4> Submission </h4>
      <br />
      <Row className='propertyview pageheader' key={'header'}>
        <Col md={2}><label className="leftaligntext"><b>Function</b></label></Col>
        <Col md={6}><label className="leftaligntext">Person webId</label></Col>
        <Col md={2}><label className="centeraligntext">Status</label></Col>
      </Row>
      {contacts.map((contact, index) => {
        return (
          <Row className='propertyview' key={contact.id + '-' + index}>
            <Col md={2}><label className="leftaligntext"><b>{contact.type}</b></label></Col>
            <Col md={6}><ProfileCardComponent webId={contact.id} key={contact.id} /></Col>
            <Col md={2}>{showContactStatus(contact)}</Col>
          </Row>
        )})}
        <br />
        <br />
        <br />
        { isComplete()
          ? <Row>
              <Col md={2} />
              <Col md={3}>
                <Button className={`${styles.accept} valuebutton`} onClick={() => accept()}> Approve Proposal </Button> 
              </Col>
              <Col md={4}>
                <Button className={`${styles.delete} valuebutton`} onClick={() => reject()}> Reject Proposal </Button>
              </Col>
            </Row>
          : <Row>
              <Col md={5} />
              <Col md={4}>
                <Button className={`${styles.delete} valuebutton`} onClick={() => reject()}> Reject Proposal </Button>
              </Col>
            </Row>
        }
    </div>
  )
}
export default SubmissionViewComponent