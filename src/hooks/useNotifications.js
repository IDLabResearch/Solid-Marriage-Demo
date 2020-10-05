import { useState, useEffect } from 'react';
import { getNotificationMetadata, getNotification, checkNewNotifications } from '../util/notifications';
import { getNotificationTypes, getProfileContracts, getContractData } from '../util/Util';
import ns from '../util/NameSpaces';
import { addContractPatch, patchProfileWithContract } from '../util/MarriageController';
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
      setNotifications(updatedNotifications)
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
    await fireUpdateEvents(notifications)
    return notifications
  }

  /**
   * This function is responsible to update the contracts status of the current user based on the incoming notifications.
   * This should be placed somewhere else in the future
   */
  async function fireUpdateEvents(notifications){
    const currentContracts = await getProfileContracts(webId)
    for (const notification of notifications) {
      const contractId = notification.type === ns.as('Announce') ? notification.object && notification.object.object : notification.target
      console.log(contractId , await checkMarriageProposal(contractId) , currentContracts, currentContracts.indexOf(contractId) === -1)
      if(contractId && await checkMarriageProposal(contractId) && currentContracts.indexOf(contractId) === -1) {
        // patch profile with contract
        await patchProfileWithContract(webId, contractId)
      }
    }
  }

  async function checkMarriageProposal(proposalId){
    const proposal = await getContractData(proposalId)
    return proposal && proposal.type === ns.demo('MarriageProposal')
  }
}

export default useNotifications