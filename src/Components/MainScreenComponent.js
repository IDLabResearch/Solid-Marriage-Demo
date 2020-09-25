import React, { useState } from 'react'
import ReactLoading from 'react-loading';

import '../css/MainScreenComponent.css'

// @prefix dbo: <http://dbpedia.org/ontology/>. dbo:birthDate, dbo:birthPlace
const MainScreenComponent = (props) => {

  const [view, setview] = useState(props.selectedView)

  if (!view || view.id !== props.selectedView.id) {
    setview(props.selectedView)
  }

  const args = { webId: props.webId, setview: props.setSelectedView }
  for (let prop in view.args || []){
    args[prop] = view.args[prop]
  }

  return (
    <div id="mainscreencontainer" className='container'>
      { props.webId ? view.generation(args) : <ReactLoading type={"cubes"}/> }
    </div>
  )
}

export default MainScreenComponent
