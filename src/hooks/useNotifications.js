import { useState, useEffect } from 'react';
import { getNotificationMetadata, getNotification, checkNewNotifications } from '../util/notifications';
import { getNotificationTypes, getProfileContracts, getContractData, getCertificateData } from '../util/Util';
import ns from '../util/NameSpaces';
import { addContractPatch, patchProfileWithContract, setProposalValidatedBy, updateMarriageContractStatus } from '../util/MarriageController';
const POLLINGRATE = 8000

const useNotifications = function(webId) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    updateNotifications(webId, notifications)
    const interval = setInterval(() => { 
      updateNotifications(webId, notifications)
    }, POLLINGRATE);
    return () => {
      clearInterval(interval);
    }
  }, [webId, notifications])  

  return notifications

  // TODO:: dont fetch notifications that have already been fetched

  async function updateNotifications(webId, currentNotifications){
    if(webId && await checkNewNotifications(webId, currentNotifications)) {
      const updatedNotifications = await fetchNotifications(webId)
      fireUpdateEvents(currentNotifications, updatedNotifications)
      if (updatedNotifications.map(n => n.metadata.id) !== currentNotifications.map(n => n.metadata.id)) {
        setNotifications(updatedNotifications)
      }
    }
  }

  async function fetchNotifications(webId){ 
    const notificationsMetadata = await getNotificationMetadata(webId)
    if(!notificationsMetadata) return []
    const notifications = await Promise.all(notificationsMetadata.map(async function(metadata){
      const notification = await getNotification(metadata.id);
      metadata.types = await getNotificationTypes(notification) 
      metadata.modified = metadata.modified && new Date(metadata.modified)
      notification.metadata = metadata;
      return notification
    }))
    return notifications
  }

  /**
   * This function is responsible to update the contracts status of the current user based on the incoming notifications.
   * This should be placed somewhere else in the future
   */
  async function fireUpdateEvents(currentNotifications, updatedNotifications){
    const currentContracts = await getProfileContracts(webId)
    for (const notification of updatedNotifications) {
      if (currentNotifications.map(n=>n.metadata.id).indexOf(notification.metadata.id) === -1){
        const itemId = notification.type === ns.as('Announce') ? notification.object && notification.object.object : notification.target
        const proposal = await checkMarriageProposal(itemId)
        const certificate = await checkCertificate(itemId)
        if(proposal && proposal.creator===webId && notification.object && notification.object.type && notification.object.type === ns.as('Reject')) {
          // set proposal status to rejected
          if (await checkContractSubmittedStatus(proposal.id)){
            const result = await updateMarriageContractStatus(proposal.id, "rejected") 
          }
          
        } else if(proposal && currentContracts.indexOf(itemId) === -1) {
          // patch profile with contract
          await patchProfileWithContract(webId, itemId)
        } else if(certificate) {
          // set proposal status to accepted
          if (await checkContractSubmittedStatus(certificate.certifies)) {
            await updateProposalStatus(webId, itemId, certificate.certifies, 'accepted')
          }
        }
      }
    }
  }

  async function checkContractSubmittedStatus(proposalId) {
    if (!proposalId) return null
    const proposal = await getContractData(proposalId)
    return (proposal && proposal.status === ns.demo('submitted') && proposal.creator === webId)
  }

  async function checkMarriageProposal(proposalId){
    if (!proposalId) return null
    const proposal = await getContractData(proposalId)
    return (proposal && proposal.type === ns.demo('MarriageProposal')) ? proposal : null
  }

  async function checkCertificate(certificateId){
    if (!certificateId) return null
    const certificate = await getCertificateData(certificateId)
    return (certificate && certificate.type === ns.demo('Certificate')) ? certificate : null
  }

  async function checkProposalCertified(proposalId){
    const proposal = await getContractData(proposalId)
    return proposal.certified_by 
  }


  async function updateProposalStatus(webId, certificateId, proposalId, status){
    if(! await checkProposalCertified(proposalId)){
      await setProposalValidatedBy(proposalId, certificateId, status)
    }
  }
}

export default useNotifications