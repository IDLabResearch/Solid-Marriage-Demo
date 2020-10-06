import { useState, useEffect } from 'react';
import { getPromiseValueOrUndefined, getProfileData } from '../util/Util'

import ns from "../util/NameSpaces"

const { default: data } = require('@solid/query-ldflex');

const useProfile = function(webId) {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    let mounted = true
    getProfileData(webId, false).then(profile => {
      if(profile) profile.webId = webId
      if(mounted) setProfile(profile)
    }).catch(
      setProfile(null)
    )
    return () => {
      mounted = false
    }
  }, [webId])  
  return profile
}

// export async function getProfile(webId) {
//   webId = await webId;
//   if(!webId) return null
//   data.clearCache() // data.clearCache(webId)
//   let profiledata = data[webId];
  
//   const name = await getPromiseValueOrUndefined(profiledata[ns.foaf('name')]);
//   const bdate = await getPromiseValueOrUndefined(profiledata[ns.dbo('birthDate')]);
//   const location = await getPromiseValueOrUndefined(profiledata[ns.dbo('location')]);
//   // const cstatus = await getPromiseValueOrUndefined(profiledata[ns.demo('civilstatus')]);
  
//   return { name, bdate, location } // , cstatus }
// }

export default useProfile