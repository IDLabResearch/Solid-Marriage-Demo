import React, {useState, useEffect} from 'react'
import '../css/VCardComponent.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import { useForm, Controller } from 'react-hook-form'
import { patchProfile } from '../util/FileUtil'
import { createDeleteInsertProfileDataQuery } from '../util/QueryUtil'
import { getPromiseValueOrUndefined, availableViews } from '../util/Util'
import { NameSpaces } from '../util/NameSpaces';
import { Select, MenuItem } from '@material-ui/core'
import { Button } from 'react-bootstrap'

const { default: data } = require('@solid/query-ldflex');
const auth = require('solid-auth-client')

const VCardEditorComponent = (props) => {

  const [profile, setProfile] = useState(null);  

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
    },
  })

  const onSubmit = async newprofile => {
    console.log('submitting', profile, newprofile)
    patchProfile(props.webId, createDeleteInsertProfileDataQuery(props.webId, profile, newprofile))
    props.setEdit(false)
  }

  useEffect(() => {
    let mounted = true
    async function fetchProfile(webId){ 
      let profiledata = data[webId];
      const name = await getPromiseValueOrUndefined(profiledata[NameSpaces.foaf + 'name']);
      const bdate = await getPromiseValueOrUndefined(profiledata[NameSpaces.dbp + 'birthDate']);
      const location = await getPromiseValueOrUndefined(profiledata[NameSpaces.dbp + 'location']);
      const cstatus = await getPromiseValueOrUndefined(profiledata[NameSpaces.ex + 'civilstatus']);
      return { name, bdate, location, cstatus }
    }
    auth.currentSession().then(session => {
      let webId = session.webId
      fetchProfile(webId).then(profile => {
        if(mounted) {
          reset(profile)
          setProfile(profile)
        }
      })
    })
    return () => {
      mounted = false
    }
  }, [])


  return (
    <div id='VCardEditorComponent'>
      <form onSubmit={handleSubmit(onSubmit)}>

        <li className='propertyview' key={"name"}>
          <label className='propertylabel'>Name</label>
          <input className='valuelabel' name="name" ref={register({ required: true })} />
        </li>

        <li className='propertyview' key={"bdate"}>
          <label className='propertylabel'>BirthDate</label>
          <input className='valuelabel' name="bdate" ref={register({ required: true })} />
        </li>

        <li className='propertyview' key={"location"}>
          <label className='propertylabel'>Country</label>
          <input className='valuelabel' name="location" ref={register({ required: true })} />
        </li>

        <li className='propertyview' key={"cstatus"}>
          <label className='propertylabel'>Civil Status</label>
          <Controller
            as={
              <Select>
                <MenuItem value={"Single"}>Single</MenuItem>
                <MenuItem value={"Cohabiting"}>Cohabiting</MenuItem>
                <MenuItem value={"Married"}>Married</MenuItem>
                <MenuItem value={"Divorced"}>Divorced</MenuItem>
                <MenuItem value={"Widowed"}>Widowed</MenuItem>
              </Select>
            }
            control={control}
            name="cstatus"
            defaultValue={"Single"}
          />
        </li>
        <br/>
        <br/>
        <Button type="submit"> Submit</Button>
      </form>
    </div>
  )
}

export default VCardEditorComponent

// <h2>All friends</h2>
// <List src="[https://ruben.verborgh.org/profile/#me].friends.firstName"/>

// @prefix dbo: <http://dbpedia.org/ontology/>. dbo:birthDate, dbo:birthPlace