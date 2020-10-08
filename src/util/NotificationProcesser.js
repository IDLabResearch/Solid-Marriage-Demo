import ns from "./NameSpaces";
import { getProfileContracts, getProfileCertified, getContractData, getCertificateData } from "./Util";
import { updateMarriageContractStatus, patchProfileWithContract, setProposalValidatedBy } from "./MarriageController";
import { clearCache } from "../singletons/Cache";

export default class NotificationProcesser {
  constructor(webId) {
    this.webId = webId;
  }

  process(notification) {
    fireUpdateEvents(this.webId, notification)
  }
}



/**
 * This function is responsible to update the contracts status of the current user based on the incoming notifications.
 * This should be placed somewhere else in the future
 */
async function fireUpdateEvents(webId, notification){
  clearActivity(notification);
  const currentContracts = await getProfileContracts(webId)
  const itemId = notification.type === ns.as('Announce') ? notification.object.id && notification.object.object.id : notification.target.id
  const proposal = await checkMarriageProposal(itemId)
  const certificate = await checkCertificate(itemId)
  if(proposal && proposal.creator===webId && notification.object.id && notification.object.type && notification.object.type === ns.as('Reject')) {
    // set proposal status to rejected
    if (await checkContractSubmittedStatus(proposal.id)){
      const result = await updateMarriageContractStatus(proposal.id, "rejected") 
    }
    
  } else if(proposal && currentContracts.indexOf(itemId) === -1) {
    // patch profile with contract
    await patchProfileWithContract(webId, itemId)
  } else if(certificate) {
    // set proposal status to accepted
    if (await checkContractSubmittedStatus(certificate.certifies, webId)) {
      await updateProposalStatus(itemId, certificate.certifies, 'accepted')
    }
  }
}

function clearActivity(activity){
  if (!activity || !activity.id) return;
  clearCache(activity.id)
  if (activity.actor) clearActivity(activity.actor)
  if (activity.object) clearActivity(activity.object)
  if (activity.target) clearActivity(activity.target)

}

async function checkContractSubmittedStatus(proposalId, webId) {
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


async function updateProposalStatus(certificateId, proposalId, status){
  if(! await checkProposalCertified(proposalId)){
    await setProposalValidatedBy(proposalId, certificateId, status)
  }
}