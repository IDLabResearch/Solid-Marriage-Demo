const auth = require('solid-auth-client')
const ORIGIN = 'http://localhost:3000'

export async function patchProfile(URI, body) {
  console.log("patching", URI, "with", body)
  return await auth.fetch(URI, {
    method: "PATCH",
    headers: {
      Origin: ORIGIN,
      "Content-Type": "application/sparql-update"
    },
    body: body
  });
}