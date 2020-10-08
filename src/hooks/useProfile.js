import { useState, useEffect } from 'react';
import { getPromiseValueOrUndefined, getProfileData } from '../util/Util'

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

export default useProfile