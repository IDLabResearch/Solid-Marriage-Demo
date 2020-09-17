import { useState, useEffect } from 'react';
import { getPromiseValueOrUndefined } from '../util/Util'
import { NameSpaces } from '../util/NameSpaces';
const { default: data } = require('@solid/query-ldflex');

const useProfile = function(webId) {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    let mounted = true
    async function fetchProfile(webId){ 
      webId = await webId;
      let profiledata = data[webId];

      const name = await getPromiseValueOrUndefined(profiledata[NameSpaces.foaf + 'name']);
      const bdate = await getPromiseValueOrUndefined(profiledata[NameSpaces.dbp + 'birthDate']);
      const location = await getPromiseValueOrUndefined(profiledata[NameSpaces.dbp + 'location']);
      const cstatus = await getPromiseValueOrUndefined(profiledata[NameSpaces.ex + 'civilstatus']);
      
      return { name, bdate, location, cstatus }
    }
    fetchProfile(webId).then(profile => {
      if(mounted) {
        setProfile(profile)
      }
    })
    return () => {
      mounted = false
    }
  }, [])  
  return profile
}

export default useProfile