import React, { useState } from 'react'
import ReactLoading from 'react-loading';
import { clearCache } from '../singletons/Cache';

const viewsWithoutWebId = ['help', 'login']

const MainScreenComponent = (props) => {

  const [view, setview] = useState(props.selectedView)

  if (!view || view.id !== props.selectedView.id) {
    clearCache()
    setview(props.selectedView)
  }

  const args = { webId: props.webId, setview: props.setSelectedView }
  for (let prop in view.args || []){
    args[prop] = view.args[prop]
  }

  const showLoadingOrView = (view) => {
    if (viewsWithoutWebId.indexOf(view.id) !== -1) {
      return view.generation(args)
    }
    return <ReactLoading type={"cubes"}/> 

  }

  return (
    <div id="mainscreencontainer" className='container'>
      { props.webId ? view.generation(args) : showLoadingOrView(view) }
    </div>
  )
}

export default MainScreenComponent
