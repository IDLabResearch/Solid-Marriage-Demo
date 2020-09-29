import { useState, useEffect } from 'react';

import ns from "../util/NameSpaces"
import { getContractData } from '../util/Util';

const { default: data } = require('@solid/query-ldflex');

const useContracts = function(webId) {
  const [contracts, setContracts] = useState([]);
  
  useEffect(() => {
    let mounted = true
    async function fetchInProgress(webId){ 
      webId = await webId;
      data.clearCache() // data.clearCache(webId)
      let contracts = []
      for await (const contractId of data[webId][ns.demo('hasContract')]){
        const contract = await getContractData(contractId && contractId.value)
        contracts.push(contract)
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