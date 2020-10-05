import { DataFactory, Writer, Quad, Variable } from "n3";
import { putFile, patchFile, deleteFile } from "./FileUtil";
import { quadListToTTL, createContractStatusPatch, createCertifiedProposalPatch, createCertifiedByPatch } from "./QueryUtil";
import ns from "../util/NameSpaces"
import notify from "./notifications";
import { getContractData } from "./Util";

const { namedNode, blankNode, literal, quad, variable} = DataFactory;

/**
 * 
 * @param {*} proposalContacts : [{ label: "Spouse" | "Witness", type: "spouse" | "witness", webID: string, id: number}]
 */
export async function createMarriageProposal(proposalContacts, storageLocation, webId) {
  let proposalId = storageLocation.endsWith('/') ? storageLocation : storageLocation + '/'
  proposalId = proposalId + getProposalName()
  if (proposalContacts.filter(e => e.type === 'spouse').length !== 2) throw new Error('A proposal requires 2 spouses to be specified.')
  if (proposalContacts.filter(e => e.type === 'witness').length < 1) throw new Error('A proposal requires at least one witness to be specified.')
  
  // Create file with proposal on proposalId
  const postbody = await createMarriagePropsalBody(proposalContacts, webId)
  const post = await putFile(proposalId, postbody)

  // Patch profile with information on created proposal
  const patchbody = await addContractPatch(webId, proposalId)
  const patch = await patchFile(webId, patchbody)

  // Create and send notifications to all parties involved
  const sentContacts = [];
  for (let contact of proposalContacts){
    if (sentContacts.indexOf(contact.webId) === -1){
      sendContactInvitation(webId, contact.webId, proposalId)
      sentContacts.push(contact.webId)
    }
  }
}

export async function sendContactInvitation(webId, contactId, proposalId){
  return notify(await createMarriageContractInvitation(webId, contactId, proposalId), [contactId])
}

export async function deleteProposal(proposalId, webId) {
  // Remove proposal and patch profile to remove reference.
  const patchbody = await deleteMarriageProfilePatch(webId, proposalId)
  const result = await deleteFile(proposalId)
  const patch = await patchFile(webId, patchbody)
}

/**
 * Accept the invitation of the marriage proposal to be a spouse / witness
 * @param {string} webId - The WebId of the invitee
 * @param {string} proposalId - The URI of the proposal
 */
export async function acceptProposal(webId, proposalId, authorId) {
  const patchbody = 'INSERT {' + await quadListToTTL([quad(namedNode(webId), namedNode(ns.demo('accepted')), namedNode(proposalId))]) + ' }';
  const patch = await patchFile(webId, patchbody)
  console.log('PATCH', patch)
  const notification = await createAcceptanceNotification(webId, proposalId, authorId)
  notify(notification, [authorId])
}

/**
 * Refuse the invitation of the marriage proposal to be a spouse / witness
 * @param {string} webId - The WebId of the invitee
 * @param {string} proposalId - The URI of the proposal
 */
export async function refuseProposal(webId, proposalId, authorId) {
  const patchbody = 'INSERT {' + await quadListToTTL([quad(namedNode(webId), namedNode(ns.demo('refused')), namedNode(proposalId))]) + ' }';
  const patch = await patchFile(webId, patchbody)
  const notification = await createRejectionNotification(webId, proposalId, authorId)
  notify(notification, [authorId])
}

export async function submitProposal(webId, contractId, officialId) {
  // Create submission notification
  const notification = createMarriageContractSubmissionNotification(webId, contractId, officialId)
  await notify(notification, [officialId])

  // update marriage contract proposal to submitted
  await updateMarriageContractStatus(contractId, "submitted")
}

/**
 * 
 * @param {string} webId - webId of the official 
 * @param {string} proposalId - URI of the marriage certification proposal
 * @param {string} storageLocation - Location where the certification needs to be stored
 */
export async function certifyProposal(webId, proposalId, storageLocation){
  // Create certification file
  const body = await createMarriageCertificateBody(webId, proposalId);
  const certificateURI = storageLocation + getCertificateName();
  // Store certification file
  const response = await putFile(certificateURI, body)

  // Update official profile with triple indicating done certification
  const patchbody = await createCertifiedProposalPatch(webId, proposalId)
  const patch = await patchFile(webId, patchbody)

  // Create certification notification
  const contract = await getContractData(proposalId)
  const notificationTargets = contract.spouse.map(e => e.id).concat(contract.witness.map(e => e.id))
  const notification = await createCertificateProposalConfirmationNotification(webId, certificateURI, proposalId, notificationTargets)
  // Send notification to witnesses + spouses
  notify(notification, notificationTargets)
}

/**
 * 
 * @param {string} webId - webId of the official 
 * @param {string} proposalId - URI of the marriage certification proposal
 * @param {string} storageLocation - Location where the certification needs to be stored
 */
export async function rejectProposal(webId, proposalId, storageLocation){
  // Create rejection notification
  createCertificateProposalRejectionNotification()
  // send notification to witnesses + spouses

  // TODO:: Store that has been rejected so no repeat requests can be done?

}

/**
 * Update the status of the marriage contract proposal.
 * @param {'pending' | 'sumitted' | 'accepted' | 'refused'} newStatus 
 */
async function updateMarriageContractStatus(contractId, newStatus) {
  const status = ns.demo(newStatus)
  const patchbody = await createContractStatusPatch(contractId, status);
  const patch = await patchFile(contractId, patchbody)
  return patch.status
}

/**
 * 
 * @param {string} proposalId - id of the proposal
 * @param {string} certificateId - id of the validating official
 * @param {'accepted' | 'refused'} status 
 */
export async function setProposalValidatedBy(proposalId, certificateId, status) {
  // Update contract status
  const result = await updateMarriageContractStatus(proposalId, status)
  // Set certification reference
  const patchBody = await createCertifiedByPatch(proposalId, certificateId)
  const patch = await patchFile(proposalId, patchBody);
  return patch.status
}


export function createAcceptanceNotification(webId, proposalId, authorId){
  return `
    @prefix as: <https://www.w3.org/ns/activitystreams#> .
    <> a as:Accept ;
      as:actor <${webId}> ;
      as:object [ 
        a as:Invite ;
        as:actor <${authorId}> ;
        as:object <${webId}> ;
        as:target <${proposalId}> ;
      ] ;
      as:target <${proposalId}> ;
      as:summary "Acceptance of the offer to participate in the marriage contract" .
  `
}

export function createRejectionNotification(webId, proposalId, authorId){
  return `
    @prefix as: <https://www.w3.org/ns/activitystreams#> .
    <> a as:Reject ;
      as:actor <${webId}> ;
      as:object [ 
        a as:Invite ;
        as:actor <${authorId}>  ;
        as:object <${webId}> ;
        as:target <${proposalId}> ;
      ] ;
      as:target <${proposalId}> ;
      as:summary "Rejection of the offer to participate in the marriage contract" .
  `
}

export function createMarriageContractInvitation(webId, contactId, marriageContractId){
  return `
    @prefix as: <https://www.w3.org/ns/activitystreams#> .
    <> a as:Offer ;
      as:actor <${webId}> ;
      as:object <${contactId}> ;
      as:target <${marriageContractId}> ;
      as:summary "Offer to participate in the marriage contract" .
  `
}

export function createMarriageContractSubmissionNotification(webId, marriageContractId, officialId){
  return `
    @prefix as: <https://www.w3.org/ns/activitystreams#> .
    <> a as:Announce ;
      as:actor <${webId}> ;
      as:object [ 
        a as:Create ;
        as:actor <${webId}>  ;
        as:object <${marriageContractId}> ;
      ] ;
      as:target <${officialId}> ;
      as:summary "Announcement that Marriage Contract Proposal is ready to be evaluated" .
  `
}

export function createCertificateProposalConfirmationNotification(webId, certificateId, marriageContractId, targets){
  // webId == id of the official
  return `
    @prefix as: <https://www.w3.org/ns/activitystreams#> .
    <> a as:Announce ;
      as:actor <${webId}> ;
      as:object [ 
        a as:Create ;
        as:actor <${webId}>  ;
        as:object <${certificateId}> ;
        as:target <${marriageContractId}> ;
      ] ;
      as:target ${targets.map(e => `<${e}>`).join(', ')} ;
      as:summary "Announcement of approval and creation of certificate for Marriage Contract Proposal" .
  `
}

async function createMarriageCertificateBody(webId, proposalId){
  return `
  <> a <${ns.demo('Certificate')}> ;
    <${ns.demo('certifies')}> <${proposalId}> ;
    <${ns.demo('certified_by')}> <${webId}> ;
    <${ns.demo('certification_date')}> "${new Date().toISOString()}"^^<${ns.xsd('dateTime')}> ;
    <${ns.rdfs('comment')}> "This is a certificate for the Marriage proposal ${proposalId} by ${webId}" .
  `
}

export function createCertificateProposalRejectionNotification(webId, marriageContractId, targets){
  // webId == id of the official
  return `
    @prefix as: <https://www.w3.org/ns/activitystreams#> .
    <> a as:Announce ;
      as:actor <${webId}> ;
      as:object [ 
        a as:Reject ;
        as:actor <${webId}>  ;
        as:object <${marriageContractId}> ;
      ] ;
      as:target ${targets.map(e => `<${e}>`).join(', ')} ;
      as:summary "Announcement of rejection for Marriage Contract Proposal" .
  `
}

/**
 * HELPER FUNCTIONS
 */

 /**
  * Get unique proposal file name
  */
const getProposalName = () => {
  const s = "marriageproposal" + new Date().toISOString()
  return encodeURIComponent(s) + '.ttl'
}

const getCertificateName = () => {
  const s = "certificate" + new Date().toISOString()
  return encodeURIComponent(s) + '.ttl'
}

/**
 * Create Marriage Proposal body (ttl)
 * @param {spouse: [], witness: []} marriageInfo required to contain a spouse field with an array of 2 webIds, and a witness field with an array of more than 1 webId
 */
async function createMarriagePropsalBody(proposalData, creatorId){
  const quadList = [ quad(namedNode(''), namedNode(ns.rdf('type')), namedNode(ns.demo('MarriageProposal'))), 
                      quad(namedNode(''), namedNode(ns.dct('creator')), namedNode(creatorId)), 
                      quad(namedNode(''), namedNode(ns.demo('status')), namedNode(ns.demo('proposal'))),]
  for (let spouse of proposalData.filter(e => e.type === 'spouse')) 
    quadList.push(quad(namedNode(''), namedNode(ns.dbo('spouse')), namedNode(spouse.webId)))
  for (let witness of proposalData.filter(e => e.type === 'witness')) 
    quadList.push(quad(namedNode(''), namedNode(ns.demo('witness')), namedNode(witness.webId)))
  return await quadListToTTL(quadList);
}

export async function addContractPatch(webId, proposalId){
  return `INSERT { ${await quadListToTTL( [quad(namedNode(webId), namedNode(ns.demo('hasContract')), namedNode(proposalId))])} } `
}

export async function deleteMarriageProfilePatch(webId, proposalId){
  return `DELETE { ${await quadListToTTL( [quad(namedNode(webId), namedNode(ns.demo('hasContract')), namedNode(proposalId))])} } `
}

export async function createMarriagePropsalNotification(creatorWebId, proposalId){
  const quadList = [
    quad(namedNode(''), namedNode(ns.as('summary')), literal("Invitation to participate in marriage contract.")),
    quad(namedNode(''), namedNode(ns.as('type')), namedNode(ns.as('Offer'))),
    quad(namedNode(''), namedNode(ns.as('actor')), namedNode(creatorWebId)),
    quad(namedNode(''), namedNode(ns.as('object')), namedNode(proposalId)),
  ]
  return await quadListToTTL(quadList);
}

export async function patchProfileWithContract(webId, contractId) {
  const patchbody = await addContractPatch(webId, contractId)
  const patch = await patchFile(webId, patchbody)
}


