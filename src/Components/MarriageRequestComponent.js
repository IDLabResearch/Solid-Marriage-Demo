import React, {useState, useEffect} from 'react'
import '../css/VCardComponent.css'

// import { useForm, Controller } from 'react-hook-form'
import { Button, Row, Col } from 'react-bootstrap'
import ProfileCardSelectorComponent from './ProfileCardSelectorComponent'
import { createMarriagePropsalNotification } from '../util/QueryUtil'
import { Input } from '@material-ui/core'
import { createMarriageProposal } from '../util/MarriageController';
import { parseURL } from 'url-toolkit';
import { getProfile } from '../hooks/useProfile'
import { availableViews } from '../util/Util'

const MarriageRequestComponent = (props) => {

  const parsedURI = parseURL(props.webId)
  const [storageLocation, setStorageLocation] = useState(parsedURI.scheme + parsedURI.netLoc + '/public/')
  const [state, setState] = useState([
    {
      label: "Spouse",
      type: "spouse",
      webId: props.webId,
    },
    {
      label: "Spouse",
      type: "spouse",
      webId: "",
    },
    {
      label: "Witness",
      type: "witness",
      webId: "",
    }
  ])

  console.log('PROFILES', state)
  const handleSubmit = async event => {
    if (!await validateSubmission(state)) return;
    const proposal = await createMarriageProposal(state, storageLocation, props.webId)
    props.setview(availableViews.running)
  }

  const setvalue = (index, value) => {
    const stateCopy = state.slice()
    stateCopy[index].webId = value
    console.log('setting value', index, value)
    setState(stateCopy)
  }

  const addWitness = () => {
    const stateCopy = state.slice()  
    stateCopy.push({
        label: "Witness",
        type: "witness",
        webId: null,
      })
    setState(stateCopy)
  } 

  const deleteWitness = (index) => {
    console.log('deleting', index)
    const stateCopy = state.slice()
    const entry = stateCopy.splice(index, 1)[0]
    console.log('deleting', index, entry, stateCopy)
    console.log('deleting', entry.type === 'witness', entry.type)
    if (entry.type === 'witness'){
      console.log('setting state', stateCopy)
      setState(stateCopy)
    }
      
  }

  const validateSubmission = async () => {

    if (state.filter(person => person.type === 'witness').length === 0){
      window.alert('At least one witness must be present to create a marriage proposal');
      return false
    }

    for (let person of state){
      if (!person.webId) {
        window.alert(person.label + ' field does not have a valid webId');
        return false
      }
      const profile = await getProfile(person.webId)
      if (!profile.name) {
        window.alert(person.webId + ' is not a valid webId');
        return false
      } else if (!profile.bdate || !profile.location || !profile.cstatus) {
        window.alert(person.webId + ' does not have a valid profile');
        return false
      } 

      if (person.type === 'spouse' && profile.cstatus === "Married"){
        window.alert('spouse ' + person.webId + ' is already married.');
        return false
      }
    }
    return true
  }

  const updateStorageLocation = (e) => {
    setStorageLocation(e.target.value)
  }


  return (
    <div id='MarriageRequestComponent' className='container'>
      <h4>Construct Marriage Proposal</h4>
      <br />
      <Row className='propertyview pageheader' key={'header'}>
        <Col md={3}><label className="leftaligntext"><b>Function</b></label></Col>
        <Col md={9}><label className="leftaligntext">Person webId</label></Col>
      </Row>
      <form>
        {state.map((person, index) => {
          return ( <ProfileCardSelectorComponent setvalue={(value) => setvalue(index, value)} person={person} key={'cardselector' + index} delete={deleteWitness} index={index}></ProfileCardSelectorComponent> )
        })}
        <Button onClick={() => addWitness()}> Add Witness </Button>
        <br/>
        <br/>
        <Row className='propertyview'>
          <Col md={3}><label className='leftaligntext'>{"Storage Location"}</label></Col>
          <Col md={9}><Input className='storageLocation leftaligntext' value={storageLocation} onChange={updateStorageLocation}/></Col>
        </Row>
        <Button onClick={() => handleSubmit()}>Submit</Button>
      </form>
    </div>
  )
}

export default MarriageRequestComponent
