import React from 'react'
import NotificationsViewerComponent from '../Components/NotificationsViewerComponent'
import DocumentsViewerComponent from '../Components/DocumentsViewerComponent'
import CertificatesViewerComponent from '../Components/CertificatesViewerComponent'
import ProfileViewerComponent from '../Components/ProfileViewerComponent'
import RequestsViewerComponent from '../Components/RequestsViewerComponent'
import HelpComponent from '../Components/HelpComponent'

export async function getPromiseValueOrUndefined (promise){
  try { return await promise.value }
  catch { return undefined }
}
export const availableViews = {
  profile: {id:"profile", label:'Profile', generation:(webId) => <ProfileViewerComponent webId={webId}></ProfileViewerComponent>},
  documents: {id:"documents", label:'Running requests', generation:(webId) => <DocumentsViewerComponent webId={webId}></DocumentsViewerComponent>},
  certificates: {id:"certificates", label:'Certificates', generation:(webId) => <CertificatesViewerComponent webId={webId}></CertificatesViewerComponent>},
  notifications: {id:"notifications", label:'Notifications', generation:(webId) => <NotificationsViewerComponent webId={webId}></NotificationsViewerComponent>},
  requests: {id:"requests", label:'Requests', generation:(webId) => <RequestsViewerComponent webId={webId}></RequestsViewerComponent>},
  help: {id:"help", label:'Help', generation:(webId) => <HelpComponent webId={webId}></HelpComponent>},
}