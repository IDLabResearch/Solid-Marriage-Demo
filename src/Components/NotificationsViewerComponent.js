import React from 'react'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import useNotifications from '../hooks/useNotifications'

// import { Col, Row, Grid } from 'react-flexbox-grid'
import styles from '../css/components/notificationcard.module.css'
import { Button } from 'react-bootstrap'
import { Value } from '@solid/react';

import createnamespaces from "../util/NameSpaces"
import { availableViews, getContractData } from '../util/Util'
const ns = createnamespaces()


const NotificationsViewerComponent = (props) => {

  const notifications = useNotifications(props.webId)
  // Sort on notification modified (= created normally) in reverse order to get newest first
  const sortednotifications = notifications.sort( (a, b) => new Date(b.metadata.modified) - new Date(a.metadata.modified))
  return (
    <div id="notificationsviewercomponent" className='container'>
      <h4> Notifications </h4>
      <br />
      {notifications.map(notification => {
        return ( <NotificationCard notification={notification} {...props} /> )
      })}
      
    </div>
  )
}
// <GridGenerator cols={1}>
//   {sortednotifications.map(notification => {
//     return ( <NotificationCard notification={notification} key={notification.metadata.id}></NotificationCard> )
//   })}
// </GridGenerator>

export default NotificationsViewerComponent


const NotificationCard = (props) => {
  const notification = props.notification
  console.log('PROPS', notification)

  // TODO;; this will fail if you have no view access to the contract
  async function viewmarriage(marriageId) {
    const contract = await getContractData(marriageId) 
    const view = availableViews.marriageview
    view.args = {contract: contract}
    props.setview(view)
  }

  function getButton() {
    switch (notification.type) {
      case ns.as('Accept'):
        return (<Button className={`${styles.actionbutton}`} onClick={() => viewmarriage(notification.target)} > See progress </Button>)
      case ns.as('Reject'):
        return (<Button className={`${styles.actionbutton}`} onClick={() => viewmarriage(notification.target)} > See progress </Button>)
      case ns.as('Offer'):
        return (<Button className={`${styles.actionbutton}`} onClick={() => viewmarriage(notification.target)} > See offer </Button>)
      default:
        return (<div />)
    }
  }

  return (
    <div className={`NotificationCard`}>
      <li className='propertyview' key={notification.metadata.id}>
        <label className={`${styles.typelabel} propertylabel`}>{notification.type.split('#')[1]}</label>
        <label className={`${styles.actorlabel}`}>
          <a href={notification.actor}>
            <Value src={`[${notification.actor}].name`}/>
          </a>
        </label>
        <label className={`${styles.summarylabel} valuelabelhalf`}>{notification.summary}</label>
        { getButton() }
      </li>
    </div>
  )
}

// <ActivityCard activity={notification}></ActivityCard>

// <li className='propertyview' key={contract.id}>
// <label className='propertylabel'>Marriage</label>
// <label className='valuelabelhalf'>Marriage requested</label>
// <Button onClick={() => viewMarriage(contract)} className='valuebutton' > See progress </Button>
// </li>

// const ActivityCard = (props) => {
//   const activity = props.activity
//   const propertyCards = []
//   let index = 1
//   for (let activityProperty of ['type', 'actor', 'object', 'target']){
//     if (activity[activityProperty]) propertyCards.push(<PropertyCard property={activityProperty} value={activity[activityProperty]} key={index++}/>)
//   }
//   return (
//     <div className={`ActivityCard ${styles.activityContainer}`}>
//       {propertyCards}
//     </div>
//   )
// }

// const ActivityCard = (props) => {
//   const activity = props.activity
//   const propertyCards = []
//   let index = 1
//   for (let activityProperty of ['type', 'actor', 'object', 'target']){
//     if (activity[activityProperty]) propertyCards.push(<PropertyCard property={activityProperty} value={activity[activityProperty]} key={index++}/>)
//   }
//   return (
//     <div className={`ActivityCard ${styles.activityContainer}`}>
//       {propertyCards}
//     </div>
//   )
// }

// const PropertyCard = (props) => {
//   const property = props.property
//   const value = props.value
//   if(typeof(value) === 'object') {
//     return (
//       <div className='PropertyCard'>
//         <label className='propertylabel'>{property}</label>
//         <ActivityCard activity={value}></ActivityCard>
//       </div>
//     )
//   } else if(typeof(value) === 'string') {
//     return (
//       <div className='PropertyCard'>
//         <label className='propertylabel'>{property}</label>
//         <label className='valuelabel'>{value}</label>
//       </div>
//     )
//   } else {
//     console.error('incorrect notification property type passed')
//   }
// }

// const GridGenerator = ({ cols, children }) => {
//   const colWidth = 12 / cols
//   const rows = chunk(React.Children.toArray(children), cols)
//   return (
//       <Grid>
//         {rows.map((cols, rowindex) => (
//           <Row key={rowindex}>
//             {cols.map((col, colindex) => (
//               <Col sm={12} md={colWidth} key={colindex}>
//                 {col}
//               </Col>2
//             ))}
//           </Row>
//         ))}
//       </Grid>
//     )
// }

// const chunk = (arr, chunkSize = 1, cache = []) => {
//   const tmp = [...arr]
//   if (chunkSize <= 0) return cache
//   while (tmp.length) cache.push(tmp.splice(0, chunkSize))
//   return cache
// }

