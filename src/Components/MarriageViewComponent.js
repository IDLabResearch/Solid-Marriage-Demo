import React, { useState, useEffect } from 'react'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button } from 'react-bootstrap'
import styles from '../css/components/marriageview.module.css'

import createnamespaces from "../util/NameSpaces"
import ProfileCardComponent from './ProfileCardComponent'
import { acceptProposal, refuseProposal, deleteMarriageProposal } from '../util/MarriageController'
import { availableViews } from '../util/Util'
const ns = createnamespaces()
const { default: data } = require('@solid/query-ldflex');

const INVITATIONACCEPTED = ns.demo('accepted')
const INVITATIONREFUSED = ns.demo('refused')

// TODO:: remove marriage button only for creator

/**
 * 
 * @param {spouse: {id: string}[], witness: {id: string}[]} props.contacts 
 */
const MarriageViewComponent = (props) => {
  let allcontacts = props.contract.spouse.map(e => { e.type='spouse'; return e})
  allcontacts = allcontacts.concat(props.contract.witness.map(e => { e.type='witness'; return e}))
  const [contacts, setContacts] = useState(allcontacts.map(e => e.accepted=false))

  useEffect(() => {
    let mounted = true
    async function getContactStatus(contactWebId){
      let accepted, refused; 
      for await (const acceptedEvent of data[contactWebId][INVITATIONACCEPTED]){
        if (`${await acceptedEvent}` === props.contract.id) accepted = true;
      }
      for await (const refusedEvent of data[contactWebId][INVITATIONREFUSED]){
        if (`${await refusedEvent}` === props.contract.id) refused = true;
      }
      return accepted ? 'accepted' : (refused ? 'refused' : 'pending')
    }
    async function updateStatus() {
      for (let contact of allcontacts){
        contact['status'] = await getContactStatus(contact.id)
      }
      if(mounted)  setContacts(allcontacts)
    }
    updateStatus()
    return () => {
      mounted = false;
    }
  }, [props.contract])

  function accept() {
    acceptProposal(props.webId, props.contract.id, props.contract.creator)
    resetView()
  }

  function refuse() {
    acceptProposal(props.webId, props.contract.id, props.contract.creator)
    resetView()
  }

  function resetView() {
    const view = availableViews.marriageview
    view.args = {contract: props.contract}
    props.setview(view)
  }

  function getContactButton(contact){
    switch (contact.status) {
      case 'accepted':
        return <Button className={`${styles.accepted} valuebutton`} disabled> Accepted </Button>
    
      case 'refused':
        return <Button className={`${styles.refused} valuebutton`} disabled> Refused </Button>

      case 'pending':
        if (contact.id === props.webId)
          return (
            <div>
              <Button className={`${styles.accept} valuebutton`} onClick={() => accept()}> Accept </Button>
              <Button className={`${styles.refuse} valuebutton`} onClick={() => refuse()}> Refuse </Button>
            </div>
          )
    }
    return <Button className={`${styles.pending} valuebutton`} disabled> Pending </Button>
  }
  
  return (
    <div id="marriageViewContainer" className='container'>
      <h4> Marriage Proposal </h4>
      <br />
      {contacts.map(contact => {
        return (
        <div key={contact.id} className={`${styles.entrycontainer}`}>
          <div className={`${'propertyview'} ${styles.entrycontainer}`} key={contact.id}>
            <label className='propertylabel'>{contact.type}</label>
            <div className='valuelabel'>
              <div className={styles.profilecontainer}>
                <ProfileCardComponent webId={contact.id} key={contact.id} />
              </div>
            </div>
            { getContactButton(contact) }
          </div>
        </div>
        )})}
        {props.contract.creator === props.webId
          ? <Button className={`${styles.refuse} valuebutton`} onClick={() => deleteMarriageProposal(props.contract.id, props.webId)}> Delete Marriage Proposal </Button> 
          : <br />} 
    </div>


  )
  
}

export default MarriageViewComponent
 //onClick={() => viewMarriage(contract)} 