import React, {useEffect} from 'react'
import ReactLoading from 'react-loading';
import '../css/VCardComponent.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import { useForm, Controller } from 'react-hook-form'
import { patchFile } from '../util/FileUtil'
import { createDeleteInsertProfileDataQuery } from '../util/QueryUtil'
import { Select, MenuItem } from '@material-ui/core'
import { Button } from 'react-bootstrap'

import useProfile from '../hooks/useProfile'
import { availableViews } from '../util/Util';


const ProfileEditorComponent = (props) => {

  const profile = useProfile(props.webId)

  const { register, handleSubmit, control, reset } = useForm({ defaultValues: {} })

  const onSubmit = async newprofile => {
    patchFile(props.webId, await createDeleteInsertProfileDataQuery(props.webId, profile, newprofile))
    props.setview(availableViews.profile)
  }

  useEffect(() => {
    reset(profile)
  }, [profile])

  if (! profile){
    return (
      <div id="ProfileEditorComponent" className='container'>
        <h4> Profile </h4>
        <br />
        <ReactLoading type={"cubes"}/>
      </div>
    )
  } 

  return (
    <div id="ProfileEditorComponent" className='container'>
      <h4> Profile </h4>
      <br />
      <form onSubmit={handleSubmit(onSubmit)}>

        <li className='propertyview' key={"name"}>
          <label className='propertylabel'>Name</label>
          <input className='valuelabel' name="name" ref={register({ required: true })} />
        </li>

        <li className='propertyview' key={"bdate"}>
          <label className='propertylabel'>BirthDate</label>
          <input className='valuelabel' type="date" name="bdate" ref={register({ required: true })} />
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

export default ProfileEditorComponent

// <h2>All friends</h2>
// <List src="[https://ruben.verborgh.org/profile/#me].friends.firstName"/>

// @prefix dbo: <http://dbpedia.org/ontology/>. dbo:birthDate, dbo:birthPlace