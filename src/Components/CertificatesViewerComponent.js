import React from 'react'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'


const CertificatesViewerComponent = (props) => {
  return (
    <div id="certificatesviewercomponent" className='container'>
      <h4> Certificates </h4>
      <br />
      <li className='propertyview' key={"Nationality"}>
        <label className='propertylabel'>Nationality</label>
        <label className='valuelabel'>No certificate available</label>
      </li>

      <li className='propertyview' key={"Nationality"}>
        <label className='propertylabel'>Residence</label>
        <label className='valuelabel'>No certificate available</label>
      </li>

      <li className='propertyview' key={"Marriage"}>
        <label className='propertylabel'>Marriage</label>
        <label className='valuelabel'>No certificate available</label>
      </li>
    </div>
  )
}

export default CertificatesViewerComponent
