const auth = require('solid-auth-client')
const ORIGIN = 'http://localhost:3000'

export async function getFile(URI) {
  // console.log("getting", URI)
  return await auth.fetch(URI, {
    method: "GET",
    headers: {
      Origin: ORIGIN,
      "Content-Type": "text/turtle"
    },
  });
}

export async function patchFile(URI, body) {
  // console.log("patching", URI, "with", body)
  return await auth.fetch(URI, {
    method: "PATCH",
    headers: {
      Origin: ORIGIN,
      "Content-Type": "application/sparql-update"
    },
    body: body
  });
}

// TODO: automatically create directories using solid-file-client
export async function putFile(URI, body) {
  // console.log("putting to", URI, "with", body)
  return await auth.fetch(URI, {
    method: "PUT",
    headers: {
      Origin: ORIGIN,
      "Content-Type": "text/turtle"
    },
    body: body
  });
}


// TODO: automatically create directories using solid-file-client
export async function postFile(URI, body) {
  // console.log("posting to", URI, "with", body)
  return await auth.fetch(URI, {
    method: "POST",
    headers: {
      Origin: ORIGIN,
      "Content-Type": "text/turtle"
    },
    body: body
  });
}

// TODO: automatically create directories using solid-file-client
export async function deleteFile(URI) {
  // console.log("deleting ", URI)
  return await auth.fetch(URI, {
    method: "DELETE",
    headers: {
      Origin: ORIGIN,
    },
  });
}