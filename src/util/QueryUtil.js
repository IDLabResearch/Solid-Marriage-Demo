export function createDeleteInsertProfileDataQuery(webId, oldprofile, newprofile) {
  const deleteClause = []
  const insertClause = []
  
  insertClause.push(`<${webId}> foaf:name "${newprofile.name}".`)
  insertClause.push(`<${webId}> dbo:birthDate "${newprofile.bdate}".`)
  insertClause.push(`<${webId}> dbo:location "${newprofile.country}".`)
  insertClause.push(`<${webId}> ex:civilstatus "${newprofile.cstatus}".`)

  if (oldprofile.name) {
    deleteClause.push(`<${webId}> foaf:name "${oldprofile.name}".`)
  } if (oldprofile.bdate) {
    deleteClause.push(`<${webId}> dbo:birthDate "${oldprofile.bdate}".`)
  } if (oldprofile.country) {
    deleteClause.push(`<${webId}> dbo:location "${oldprofile.country}".`)
  } if (oldprofile.cstatus) {
    deleteClause.push(`<${webId}> ex:civilstatus "${oldprofile.cstatus}".`)
  }

  const deleteClauseString = deleteClause.length ? `DELETE { ${deleteClause.join('\n')} }` : ''
  const insertClauseString = insertClause.length ? `INSERT { ${insertClause.join('\n')} }` : ''
  const whereClauseString = deleteClause.length ? `WHERE { ${deleteClause.join('\n')} }` : ''


  return(`
    @prefix foaf:  <http://xmlns.com/foaf/0.1/> .
    @prefix dbo: <http://dbpedia.org/ontology/>.
    @prefix ex: <http://example.com/>.
    ${deleteClauseString}
    ${insertClauseString}
    ${whereClauseString}
  `)
}

