import { DataFactory, Writer, Quad } from "n3";
import createnamespaces from "../util/NameSpaces"

const { default: data } = require('@solid/query-ldflex');

const ns = createnamespaces()
const { namedNode, literal, quad } = DataFactory;

export async function createDeleteInsertProfileDataQuery(webId, oldprofile, newprofile) {
  const deleteClause = []
  // const insertClause = []
  
  const insertClause = [
    quad(namedNode(webId), namedNode(ns.foaf('name')), literal(newprofile.name)),
    quad(namedNode(webId), namedNode(ns.dbo('birthDate')), literal(newprofile.bdate, namedNode(ns.xsd('date')))),
    quad(namedNode(webId), namedNode(ns.dbo('location')), literal(newprofile.location)),
    quad(namedNode(webId), namedNode(ns.demo('civilstatus')), literal(newprofile.cstatus)),
  ]

  if (oldprofile.name) {
    deleteClause.push(quad(namedNode(webId), namedNode(ns.foaf('name')), literal(oldprofile.name)))
  } if (oldprofile.bdate) {
    deleteClause.push(quad(namedNode(webId), namedNode(ns.dbo('birthDate')), literal(oldprofile.bdate, namedNode(ns.xsd('date')))))
  } if (oldprofile.location) {
    deleteClause.push(quad(namedNode(webId), namedNode(ns.dbo('location')), literal(oldprofile.location)))
  } if (oldprofile.cstatus) {
    deleteClause.push(quad(namedNode(webId), namedNode(ns.demo('civilstatus')), literal(oldprofile.cstatus)))
  }

  const deleteClauseString = deleteClause.length ? `DELETE { ${await quadListToTTL(deleteClause)} }` : ''
  const insertClauseString = insertClause.length ? `INSERT { ${await quadListToTTL(insertClause)} }` : ''
  const whereClauseString = deleteClause.length ? `WHERE { ${await quadListToTTL(deleteClause)} }` : ''


  return(`
    ${deleteClauseString}
    ${insertClauseString}
    ${whereClauseString}
  `)
}


/**
 * 
 * @param {*} publicOrganisation An object containing the id, label and location of a public organisation
 * @param {*} proposalId The identifier of the marriage proposal that is to be confirmed
 */
export async function createMarriageConfirmation(publicOrganisation, proposalId){
  const quadList = [ 
    quad(namedNode(publicOrganisation.id), namedNode(ns.rdf('type')), namedNode(ns.demo('publicOrganisation'))), 
    quad(namedNode(publicOrganisation.id), namedNode(ns.rdfs('label')), literal(publicOrganisation.label)), 
    quad(namedNode(publicOrganisation.id), namedNode(ns.dbo('location')), namedNode(publicOrganisation.location)), 
    quad(namedNode(publicOrganisation.id), namedNode(ns.demo('confirms')), namedNode(publicOrganisation.location)), 
  ]
  return await quadListToTTL(quadList);
}

export async function isConfirmedMarriageProposal(webId, proposalId){
  const quadList = [ quad(namedNode(proposalId), namedNode(ns.demo('isConfirmedBy')), namedNode(webId)) ]
  return await quadListToTTL(quadList);
}

export async function confirmMarriageProposal(webId, proposalId){
  const quadList = [ quad(namedNode(webId), namedNode(ns.demo('confirms')), namedNode(proposalId)) ]
  return await quadListToTTL(quadList);
}


export async function createMarriagePropsalAcceptedNotification(webId, proposalId){
  const quadList = [
    quad(namedNode(''), namedNode(ns.as('summary')), literal("Acceptance of marriage proposal")),
    quad(namedNode(''), namedNode(ns.as('type')), namedNode(ns.as('Accept'))),
    quad(namedNode(''), namedNode(ns.as('actor')), namedNode(webId)),
    quad(namedNode(''), namedNode(ns.as('object')), namedNode(proposalId)),
  ]
  return await quadListToTTL(quadList);
}



export async function quadListToTTL(quadList) { 
  return new Promise((resolve, reject) => {
    const writer = new Writer();
    writer.addQuads(quadList)
    writer.end((error, result) => {
      if (error || !result) reject(error || "Could not generate ttl file from quads")
      resolve(result)
    });
  })
}