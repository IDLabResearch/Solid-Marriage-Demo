import React from 'react'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import useContracts from '../hooks/useContracts'
import { availableViews } from '../util/Util'


const CertificatesViewerComponent = (props) => {

  const contracts = useContracts(props.webId)

  const viewMarriage = function(contract){
    const view = availableViews.marriageview
    view.args = {contract: contract}
    props.setview(view)
  }

  return (
    <div id="certificatesviewercomponent" className='container'>
      <h4> Certificates </h4>
      <br />
      <li className='propertyview' key={"Nationality"}>
        <label className='propertylabel'>Nationality</label>
        <label className='valuelabel'>No certificate available</label>
      </li>

      <li className='propertyview' key={"Residence"}>
        <label className='propertylabel'>Residence</label>
        <label className='valuelabel'>No certificate available</label>
      </li>

      {contracts.inprogress.map(contract => {
        return (  
          <li className='propertyview' key={contract.id}>
            <label className='propertylabel'>Marriage</label>
            <label className='valuelabel'>No certificate available</label>
          </li>
        )
      })}
     
    </div>
  )
}

export default CertificatesViewerComponent
