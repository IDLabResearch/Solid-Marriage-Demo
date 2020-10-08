import { postFile } from "./FileUtil";
import { getStore } from "../util/Util"
import ns from "../util/NameSpaces"
import { getVal } from "../singletons/QueryEngine";

export default async function notify(notificationBody, subjects) {
  const distinct = (value, index, self) => self.indexOf(value) === index;
  for (let subject of subjects.filter(distinct)) {
    const inbox = await getInbox(subject);
    console.log('notifying', inbox, subject, notificationBody)
    if (inbox) postFile(inbox, notificationBody)
  }
}

async function getInbox(subject){
  const inbox = await getVal(subject, ns.ldp('inbox'))
  console.log('getting inbox', inbox)
  if(!inbox) console.error(subject + ' does not provide an inbox.')
  return inbox
}

export async function checkNewNotifications(webId, currentNotificationIds) {
  const notificationMetadata = await getNotificationMetadata(webId)
  return notificationMetadata.filter(metadata => currentNotificationIds.indexOf(metadata.id) === -1)
}

/**
 * Get the notification metadata from the inbox folder
 * @param {string} webId 
 */
export async function getNotificationMetadata(webId) {
  const inbox = await getInbox(webId)
  if(!inbox) return []
  const store = await getStore(inbox, false, 0)
  if (!store) return [];
  const notificationsMetadata = await store.getQuads(inbox, ns.ldp('contains'))
  const metadataObjects = notificationsMetadata.map(quad => { return ( {id: quad.object.value})})
  for (let metadata of metadataObjects) {
    const modified = await store.getQuads(metadata.id, ns.dct('modified'), null)
    metadata['modified'] = modified && modified[0].object.value
  }
  return metadataObjects
}

export async function getNotification(notificationId) {
  const store = await getStore(notificationId)
  if (!store) return null
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
