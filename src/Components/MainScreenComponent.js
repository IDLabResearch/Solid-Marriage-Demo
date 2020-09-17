import React, { useState } from 'react'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import { withWebId } from '@inrupt/solid-react-components';
import ReactLoading from 'react-loading';

import '../css/MainScreenComponent.css'

// @prefix dbo: <http://dbpedia.org/ontology/>. dbo:birthDate, dbo:birthPlace
const MainScreenComponent = withWebId((props) => {

  const [view, setview] = useState(props.selectedView)
  const [selectedWebId, setselectedWebId] = useState(null)

  if (!selectedWebId && props.webId) setselectedWebId(props.webId);
  if (!view || view.id !== props.selectedView.id) setview(props.selectedView)

  return (
    <div id="mainscreencontainer" className='container'>
      { selectedWebId ? view.generation(selectedWebId) : <ReactLoading type={"cubes"}/> }
    </div>
  )
})

export default MainScreenComponent
