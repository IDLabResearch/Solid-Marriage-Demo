import { validStatusCodes } from './Util'
import { delCache } from './Cache';
const auth = require('solid-auth-client')
const { default: data } = require('@solid/query-ldflex');
const DEFAULTSHOWPOPUPS = false;

// TODO: automatically create directories using solid-file-client

export async function getFile(URI, showPopups = DEFAULTSHOWPOPUPS) {
  return doRequest('GET', URI, null, null, showPopups)
}

export async function patchFile(URI, body, showPopups = true) {
  data.clearCache(URI);
  delCache(URI);
  return doRequest('PATCH', URI, body, { "Content-Type": "application/sparql-update" }, showPopups)
}

export async function putFile(URI, body, showPopups = DEFAULTSHOWPOPUPS) {
  data.clearCache(URI);
  delCache(URI);
  return doRequest('PUT', URI, body, { "Content-Type": "text/turtle" }, showPopups)
}

export async function postFile(URI, body, showPopups = DEFAULTSHOWPOPUPS) {
  data.clearCache(URI);
  delCache(URI);
  return doRequest('POST', URI, body, { "Content-Type": "text/turtle" }, showPopups)
}

export async function deleteFile(URI, showPopups = DEFAULTSHOWPOPUPS) {
  data.clearCache(URI);
  delCache(URI);
  return doRequest('DELETE', URI, null, null, showPopups)
}

async function doRequest(requestType, URI, body, headers, showPopups) {
  const options = {method: requestType}
  if (body) options.body = body
  if (headers) options.headers = headers
  const response = await auth.fetch(URI, options);
  const code = (await response).status
  if (validStatusCodes.indexOf(code) === -1) {
    showErrorPopup(URI, code, requestType, showPopups)
  }
  return response;
}

function showErrorPopup(URI, statusCode, requestType, showPopups) {
  let alert = null
  if ([401, 403].indexOf(statusCode) !== -1) {
    alert =`Incorrect authorization during ${requestType} request to resource on ${URI}. Please double check the permissions set in your solid pod!`
  } else if ([404].indexOf(statusCode) !== -1) {
    alert =`Could not do ${requestType} request to resource at ${URI}, as it has been removed or does not exist.`
  } else {
    alert =`Could not do ${requestType} request to resource at ${URI}. Please double check the permissions set in your solid pod!`
  }
  if (alert && showPopups) window.alert(alert)
  else if (alert) console.error(alert)
}