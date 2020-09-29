import React, { useState, useEffect } from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import styles from '../css/components/marriageview.module.css'

import ns from "../util/NameSpaces"
import ProfileCardComponent from './ProfileCardComponent'
import { acceptProposal, refuseProposal, deleteMarriageProposal, createMarriageContractSubmissionNotification, submitProposal } from '../util/MarriageController'
import { availableViews } from '../util/Util'
const { default: data } = require('@solid/query-ldflex');

const INVITATIONACCEPTED = ns.demo('accepted')
const INVITATIONREFUSED = ns.demo('refused')

// TODO:: remove marriage button only for creator
// TODO:: If spouse if 2 times the same person it will only show once (same for witnesses) because of ldflex => update this to use N3 in usecontracts?

/**
 * 
 * @param {spouse: {id: string}[], witness: {id: string}[]} props.contacts 
 */
const MarriageViewComponent = (props) => {
  let allcontacts = props.contract.spouse.map(e => { e.type='spouse'; return e})
  allcontacts = allcontacts.concat(props.contract.witness.map(e => { e.type='witness'; return e}))
  allcontacts = allcontacts.map(e => { e['status'] = e['status'] || 'pending' ; return e})
  const [contacts, setContacts] = useState(allcontacts)

  useEffect(() => {
    let mounted = true
    async function refreshContacts() {
      updateContacts(allcontacts).then(updatedContacts => {
        if(mounted) setContacts(updatedContacts)
      })
    }
    refreshContacts()
    var interval = setInterval(() => { 
      refreshContacts()
    }, 7000);
    return () => {
      mounted = false;
      clearInterval(interval);
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
  
  async function submitMarriageProposal() {
    // For demo purposes outside of the workshop also, we will have the user function as the official also
    const officialId = props.webId
    const submission = await submitProposal(props.webId, props.contract.id, officialId)
    props.setview(availableViews.official)
  }

  function isComplete() {
    for (let contact of contacts) {
      if (contact.status !== "accepted") return false
    }
    return true 
  }

  async function accept() {
    await acceptProposal(props.webId, props.contract.id, props.contract.creator)
    resetView()
  }

  async function refuse() {
    await acceptProposal(props.webId, props.contract.id, props.contract.creator)
    resetView()
  }

  async function resetView() {
    const updatedContacts = await updateContacts(contacts)
    setContacts(updatedContacts)
  }

  function resend() {
    //TODO:: include this
    console.error('TODO')
  }


  function getContactButton(contact){
    switch (contact.status) {
      case 'pending':
        if (contact.id === props.webId) return (
            <div>
              <Button className={`${styles.accept} centeraligntext`} onClick={() => accept()}> Accept </Button>
              <Button className={`${styles.refuse} centeraligntext`} onClick={() => refuse()}> Refuse </Button>
            </div>
          )
        else  return (
          <div>
            <Button className={`${styles.pending} centeraligntext`} onClick={() => resend()}>Resend notification</Button>
          </div>
        )
    }
    return(<div />)
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

  return (
    <div id="marriageViewContainer" className='container'>
      <h4> Marriage Proposal </h4>
      <br />
      <Row className='propertyview pageheader' key={'header'}>
        <Col md={2}><label className="leftaligntext"><b>Function</b></label></Col>
        <Col md={5}><label className="leftaligntext">Person webId</label></Col>
        <Col md={2}><label className="centeraligntext">Status</label></Col>
        <Col md={2}><label className="centeraligntext">Action</label></Col>
      </Row>
      {contacts.map(contact => {
        return (
          <Row className='propertyview' key={contact.id}>
            <Col md={2}><label className="leftaligntext"><b>{contact.type}</b></label></Col>
            <Col md={5}><ProfileCardComponent webId={contact.id} key={contact.id} /></Col>
            <Col md={2}>{showContactStatus(contact)}</Col>
            <Col md={2}>{getContactButton(contact)}</Col>
          </Row>
        )})}
        <br />
        <br />
        <br />
        { props.contract.creator === props.webId
          ? isComplete()
            ? <Row>
                <Col md={6} />
                <Col md={3}>
                  <Button className={`${styles.accept} valuebutton`} onClick={() => submitMarriageProposal(props.contract.id, props.webId)}> Submit Marriage Proposal </Button> 
                </Col>
                <Col md={3}>
                  <Button className={`${styles.delete} valuebutton`} onClick={() => deleteMarriageProposal()}> Delete Marriage Proposal </Button>
                </Col>
              </Row>
            : <Row>
                <Col md={9} />
                <Col md={3}>
                  <Button className={`${styles.delete} valuebutton`} onClick={() => deleteMarriageProposal(props.contract.id, props.webId)}> Delete Marriage Proposal </Button>
                </Col>
              </Row>
          : <Row />
        }
    </div>
  )
}
export default MarriageViewComponent