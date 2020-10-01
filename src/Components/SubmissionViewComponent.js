import React, { useState, useEffect } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import styles from '../css/components/marriageview.module.css'

import ns from "../util/NameSpaces"
import ProfileCardComponent from './ProfileCardComponent'
import { acceptProposal, refuseProposal, deleteMarriageProposal, createMarriageContractSubmissionNotification, submitProposal, certifyProposal, rejectProposal } from '../util/MarriageController'
import { availableViews } from '../util/Util'
import { parseURL } from 'url-toolkit'
const { default: data } = require('@solid/query-ldflex');

const INVITATIONACCEPTED = ns.demo('accepted')
const INVITATIONREFUSED = ns.demo('refused')

// TODO:: remove marriage button only for creator
// TODO:: If spouse if 2 times the same person it will only show once (same for witnesses) because of ldflex => update this to use N3 in usecontracts?

/**
 * 
 * @param {spouse: {id: string}[], witness: {id: string}[]} props.contacts 
 */
const SubmissionViewComponent = (props) => {
  let allcontacts = props.contract.spouse.map(e => { e.type='spouse'; return e})
  allcontacts = allcontacts.concat(props.contract.witness.map(e => { e.type='witness'; return e}))
  allcontacts = allcontacts.map(e => { e['status'] = e['status'] || 'pending' ; return e})
  const [contacts, setContacts] = useState(allcontacts)

  const parsedURI = parseURL(props.webId)
  const storageLocation = parsedURI.scheme + parsedURI.netLoc + '/public/'

  useEffect(() => {
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
  }, [props.contract])

  async function getContactStatus(contactWebId){
    let accepted, refused; 
    data.clearCache() // data.clearCache(contactWebId)
    for await (const acceptedEvent of data[contactWebId][INVITATIONACCEPTED]){
      if (`${await acceptedEvent}` === props.contract.id) accepted = true;
    }
    for await (const refusedEvent of data[contactWebId][INVITATIONREFUSED]){
      if (`${await refusedEvent}` === props.contract.id) refused = true;
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
    }
    return "Pending"
  }


  function isComplete() {
    for (let contact of contacts) {
      if (contact.status !== "accepted") return false
    }
    return true 
  }

  function accept() {
    certifyProposal(props.webId, props.contract.id, storageLocation)
    props.setview(availableViews.certificates)
  }

  function reject() {
    // Todo:: set as certified so additional requests are not shown as needed to be validated
    rejectProposal(props.webId, props.contract.id, storageLocation)
    props.setview(availableViews.certificates)
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
      {contacts.map(contact => {
        return (
          <Row className='propertyview' key={contact.id}>
            <Col md={2}><label className="leftaligntext"><b>{contact.type}</b></label></Col>
            <Col md={6}><ProfileCardComponent webId={contact.id} key={contact.id} /></Col>
            <Col md={2}>{showContactStatus(contact)}</Col>
          </Row>
        )})}
        <br />
        <br />
        <br />
        { props.contract.creator === props.webId
          ? isComplete()
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
          : <Row />
        }
    </div>
  )
}
export default SubmissionViewComponent