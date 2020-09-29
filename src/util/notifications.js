import { postFile } from "./FileUtil";
import { getStore } from "../util/Util"
import ns from "../util/NameSpaces"
const { default: data } = require('@solid/query-ldflex');

export default async function notify(notificationBody, subjects) {
  for (let subject of subjects) {
    const inbox = await getInbox(subject);
    if (inbox) postFile(inbox, notificationBody)
  }
}

async function getInbox(subject){
  const inbox = await data[subject][ns.ldp('inbox')]
  if(!inbox) console.error(subject + ' does not profide an inbox.')
  return inbox && inbox.value
}

export async function checkNewNotifications(webId, currentNotifications) {
  if(!currentNotifications) return true
  const inbox = await getInbox(webId)
  if(!inbox) return false
  const store = await getStore(inbox)
  let notificationsMetadata = await store.getQuads(inbox, ns.ldp('contains'))
  if (notificationsMetadata.length === currentNotifications.length) return false;
  return true
}

export async function getNotificationMetadata(webId) {
  const inbox = await getInbox(webId)
  if(!inbox) return []
  const store = await getStore(inbox)
  let notificationsMetadata = await store.getQuads(inbox, ns.ldp('contains'))
  notificationsMetadata = notificationsMetadata.map(quad => { return ( {id: quad.object.value})})
  for (let metadata of notificationsMetadata ) {
    const modified = await store.getQuads(metadata.id, ns.dct('modified'), null)
    metadata['modified'] = modified && modified[0].object.value
  }
  return notificationsMetadata
}

export async function getNotification(notificationId) {
  const store = await getStore(notificationId)
  return await getRecursiveActivity(store, notificationId)
}

async function getRecursiveActivity(store, id){
  let type = await getStoreEntry(store, id, ns.rdf('type'))
  let actor = await getStoreEntry(store, id, ns.as('actor'))
  let object = await getStoreEntry(store, id, ns.as('object'))
  let target = await getStoreEntry(store, id, ns.as('target'))
  let summary = await getStoreEntry(store, id, ns.as('summary'))
  type = type && type.value
  summary = summary && summary.value
  actor = actor && actor.termType == 'BlankNode' ? await getRecursiveActivity(store, actor.id) : actor && actor.value
  object = object && object.termType == 'BlankNode' ? await getRecursiveActivity(store, object.id) : object && object.value
  target = target && target.termType == 'BlankNode' ? await getRecursiveActivity(store, target.id) : target && target.value
  return { type, actor, object, target, summary }
}

async function getStoreEntry(store, id, predicate){
  const p = await store.getQuads(id, predicate, null)
  return (p && p.length && p[0].object || null)
}
