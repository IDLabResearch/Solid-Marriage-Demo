import { DataFactory, Writer, Quad } from "n3";
import { putFile, patchFile, deleteFile } from "./FileUtil";
import { quadListToTTL } from "./QueryUtil";
import createnamespaces from "./NameSpaces"
import notify from "./notifications";

const ns = createnamespaces()
const { namedNode, blankNode, literal, quad } = DataFactory;

/**
 * 
 * @param {*} proposalData : [{ label: "Spouse" | "Witness", type: "spouse" | "witness", webID: string, id: number}]
 */
export async function createMarriageProposal(proposalData, storageLocation, webId) {
  let proposalId = storageLocation.endsWith('/') ? storageLocation : storageLocation + '/'
  proposalId = proposalId + getProposalName()
  if (proposalData.filter(e => e.type === 'spouse').length !== 2) throw new Error('A proposal requires 2 spouses to be specified.')
  if (proposalData.filter(e => e.type === 'witness').length < 1) throw new Error('A proposal requires at least one witness to be specified.')
  
  // Create file with proposal on proposalId
  const postbody = await createMarriagePropsalBody(proposalData, webId)
  const post = await putFile(proposalId, postbody)

  // Patch profile with information on created proposal
  const patchbody = await createMarriageProfilePatch(webId, proposalId)
  const patch = await patchFile(webId, patchbody)

  // Create and send notifications to all parties involved
  for (let contact of proposalData){
    const contactId = contact.webId
    const notification = await createMarriageContractInvitation(webId, contactId, proposalId)
    notify(notification, [contactId])
  }
}

export async function deleteMarriageProposal(proposalId, webId) {
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

/**
 * HELPER FUNCTIONS
 */

 /**
  * Get unique proposal file name
  */
const getProposalName = () => {
  const s = "marriageproposal" + new Date().toISOString()
  return s.replace('.', '-') + '.ttl'
}

/**
 * Create Marriage Proposal body (ttl)
 * @param {spouse: [], witness: []} marriageInfo required to contain a spouse field with an array of 2 webIds, and a witness field with an array of more than 1 webId
 */
async function createMarriagePropsalBody(proposalData, creatorId){
  const quadList = [ quad(namedNode(''), namedNode(ns.rdf('type')), namedNode(ns.demo('MarriageProposal'))), 
                      quad(namedNode(''), namedNode(ns.dct('creator')), namedNode(creatorId)), ]
  for (let spouse of proposalData.filter(e => e.type === 'spouse')) 
    quadList.push(quad(namedNode(''), namedNode(ns.dbo('spouse')), namedNode(spouse.webId)))
  for (let witness of proposalData.filter(e => e.type === 'witness')) 
    quadList.push(quad(namedNode(''), namedNode(ns.demo('witness')), namedNode(witness.webId)))
  return await quadListToTTL(quadList);
}

export async function createMarriageProfilePatch(webId, proposalId){
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

















