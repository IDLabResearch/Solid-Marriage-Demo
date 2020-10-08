import { useState, useEffect } from 'react';

import ns from "../util/NameSpaces"
import { getContractData } from '../util/Util';
import { getValArray } from '../singletons/QueryEngine';



const useContracts = function(webId) {
  const [contracts, setContracts] = useState([]);
  
  useEffect(() => {
    let mounted = true
    async function fetchInProgress(webId){ 
      webId = await webId;
      let contracts = []
      for await (const contractId of await getValArray(webId, ns.demo('hasContract'))) {
        const contract = await getContractData(contractId && contractId.value, false)
        if(contract) contracts.push(contract)
      }
      return contracts
    }
    fetchInProgress(webId).then(contracts => {
      setContracts(contracts)
    })
    return () => {
      mounted = false
    }
  }, [webId])  
  return contracts
}

export default useContracts