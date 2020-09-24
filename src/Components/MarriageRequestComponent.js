import React, {useState, useEffect} from 'react'
import '../css/VCardComponent.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

// import { useForm, Controller } from 'react-hook-form'
import { Button } from 'react-bootstrap'
import ProfileCardSelectorComponent from './ProfileCardSelectorComponent'
import { createMarriagePropsalNotification } from '../util/QueryUtil'
import { Input } from '@material-ui/core'
import { createMarriageProposal } from '../util/MarriageController';
import { parseURL } from 'url-toolkit';

const MarriageRequestComponent = (props) => {

  const parsedURI = parseURL(props.webId)
  const [storageLocation, setStorageLocation] = useState(parsedURI.scheme + parsedURI.netLoc + '/public/')
  const [state, setState] = useState([
    {
      label: "Spouse",
      type: "spouse",
      webId: props.webId,
      id: 0,
    },
    {
      label: "Spouse",
      type: "spouse",
      webId: "https://bob.localhost:8443/profile/card#me",
      id: 1,
    },
    {
      label: "Witness",
      type: "witness",
      webId: "https://carol.localhost:8443/profile/card#me",
      id: 2,
    }
  ])

  const handleSubmit = async event => {
    console.log('submitting', state)
    if (!validateSubmission(state)) return;
    const proposal = createMarriageProposal(state, storageLocation, props.webId)
    console.log('proposal', await proposal)
  }

  const setvalue = (id, value) => {
    const stateCopy = state.slice()
    for (let obj of stateCopy) {
      if (obj.id === id) {
        obj.webId = value
      }
    }
    setState(stateCopy)
  }

  const addWitness = () => {
    const stateCopy = state.slice()  
    stateCopy.push({
        label: "Witness",
        type: "witness",
        webId: null,
        id: state.length + 1,
      })
    setState(stateCopy)
  } 


  const validateSubmission = () => {
    // TODO::
    console.error('IMPLEMENT VALIDATION FOR MARRIAGE SUBMISSIONS')
    return true;
  }

  const updateStorageLocation = (e) => {
    setStorageLocation(e.target.value)
  }

  return (
    <div id='ProfileEditorComponent'>
      <form>
        {state.map(person => {
          return ( <ProfileCardSelectorComponent setvalue={(value) => setvalue(person.id, value)} person={person} key={person.id}></ProfileCardSelectorComponent> )
        })}
        <Button onClick={() => addWitness()}> Add Witness </Button>
        <br/>
        <br/>
        <li className='propertyview'>
          <label className='propertylabel'>{"Storage Location"}</label>
          <Input className='storageLocation valuelabel' value={storageLocation} onChange={updateStorageLocation}/>
        </li>
        <Button onClick={() => handleSubmit()}>Submit</Button>
      </form>
    </div>
  )
}

export default MarriageRequestComponent
