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


const MarriageRequestComponent = (props) => {

  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      userWebId: props.webId,
      witness1: "https://inrupt.com/witness1/profile/card#me"
    },
  })

  const onSubmit = async newprofile => {
    console.log('submitting', newprofile)
    // patchProfile(props.webId, createDeleteInsertProfileDataQuery(props.webId, profile, newprofile))
    props.setstate(false)
  }

  return (
    <div id='VCardEditorComponent'>
      <form onSubmit={handleSubmit(onSubmit)}>

        <li className='propertyview' key={"name"}>
          <label className='propertylabel'>Name</label>
          <input className='valuelabel' name="userWebId" ref={register({ required: true })} />
        </li>
        <div> This is going to load a small card with the information of person with this WebId</div>

        <li className='propertyview' key={"bdate"}>
          <label className='propertylabel'>BirthDate</label>
          <input className='valuelabel' name="otherWebId" ref={register({ required: true })} />
        </li>
        <div> This is going to load a small card with the information of person with this WebId</div>

        <li className='propertyview' key={"witness1"}>
          <label className='propertylabel'>Witness</label>
          <input className='valuelabel' name="witness1" ref={register({ required: true })} />
        </li>
        <div> This is going to load a small card with the information of person with this WebId</div>

       
        <li className='propertyview' key={"witness2"}>
          <label className='propertylabel'>Withness</label>
          <input className='valuelabel' name="witness2" ref={register({ required: true })} />
        </li>
        <div> This is going to load a small card with the information of person with this WebId</div>

        <Button> Add Witness </Button>
        <br/>
        <br/>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  )
}

export default MarriageRequestComponent
