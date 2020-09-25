import React from 'react'
import * as N3 from 'n3'
import NotificationsViewerComponent from '../Components/NotificationsViewerComponent'
import InProgressViewerComponent from '../Components/InProgressViewerComponent'
import CertificatesViewerComponent from '../Components/CertificatesViewerComponent'
import ProfileViewerComponent from '../Components/ProfileViewerComponent'
import ProfileEditorComponent from '../Components/ProfileEditorComponent'
import RequestsViewerComponent from '../Components/RequestsViewerComponent'
import HelpComponent from '../Components/HelpComponent'
import MarriageRequestComponent from '../Components/MarriageRequestComponent'
import MarriageViewComponent from '../Components/MarriageViewComponent'
import OfficialComponent from '../Components/OfficialComponent'
import { getFile } from './FileUtil'

import PersonIcon from '@material-ui/icons/Person';
import NotificationsIcon from '@material-ui/icons/Notifications';
import HelpIcon from '@material-ui/icons/Help';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import CardMembershipIcon from '@material-ui/icons/CardMembership';
import ListIcon from '@material-ui/icons/List';
import GavelIcon from '@material-ui/icons/Gavel';

import createnamespaces from "../util/NameSpaces"
const ns = createnamespaces()
const { default: data } = require('@solid/query-ldflex');



export async function getPromiseValueOrUndefined (promise){
  try { return await promise.value }
  catch { return undefined }
}

export const availableViews = {
  profile:        {id:"profile",          label:'Profile',          generation:(props) => <ProfileViewerComponent {...props} ></ProfileViewerComponent>, icon: <PersonIcon />},
  profileeditor:  {id:"profileedit",      label:'Profile Editor',   generation:(props) => <ProfileEditorComponent {...props} ></ProfileEditorComponent>, icon: <HelpIcon />},
  requests:       {id:"requests",         label:'Requests',         generation:(props) => <RequestsViewerComponent {...props}></RequestsViewerComponent>, icon: <InsertDriveFileIcon />},
  marriagerequest: {id:"marriagerequest", label:'Marriage request', generation:(props) => <MarriageRequestComponent {...props}></MarriageRequestComponent>, icon: <HelpIcon />},
  marriageview:   {id:"marriagerequest",  label:'Marriage view',    generation:(props) => <MarriageViewComponent {...props}></MarriageViewComponent>, icon: <HelpIcon />},
  running:        {id:"running",          label:'In progress',      generation:(props) => <InProgressViewerComponent {...props}></InProgressViewerComponent>, icon: <ListIcon />},
  certificates:   {id:"certificates",     label:'Certificates',     generation:(props) => <CertificatesViewerComponent {...props}></CertificatesViewerComponent>, icon: <CardMembershipIcon />},
  notifications:  {id:"notifications",    label:'Notifications',    generation:(props) => <NotificationsViewerComponent {...props}></NotificationsViewerComponent>, icon: <NotificationsIcon />},
  help:           {id:"help",             label:'Help',             generation:(props) => <HelpComponent {...props}></HelpComponent>, icon: <HelpIcon />},
  official:       {id:"official",         label:'Offical',          generation:(props) => <OfficialComponent {...props}></OfficialComponent>, icon: <GavelIcon />},
}

export async function getStore(URI){
  const response = await getFile(URI)
  const responseData = await response.text()
  const store = new N3.Store()
  store.addQuads(await new N3.Parser({ baseIRI: URI}).parse(responseData))
  return store
}

export async function getContractData(contractId) {
  const contract = {id: contractId, completed: false, spouse: [], witness: []}
  contract.creator = await data[contractId][ns.dct('creator')]
  contract.completed = await data[contractId][ns.demo('isValidatedBy')]
  contract.creator = contract.creator && contract.creator.value
  contract.completed = contract.completed && contract.completed.value
  for await (const spouseId of data[contractId][ns.dbo('spouse')]){
    contract.spouse.push({id: spouseId.value})
  }
  for await (const witnessId of data[contractId][ns.demo('witness')]){
    contract.witness.push({id: witnessId.value})
  }
  return contract
}