import { useState, useEffect } from 'react';
import { getNotificationMetadata, getNotification, checkNewNotifications } from '../util/notifications';
import { getNotificationTypes } from '../util/Util';

const useNotifications = function(webId) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    updateNotifications(webId, notifications)
    const interval = setInterval(() => { 
      updateNotifications(webId, notifications)
    }, 15000);
    return () => {
      clearInterval(interval);
    }
  }, [webId, notifications])  

  return notifications

  // TODO:: dont fetch notifications that have already been fetched

  async function updateNotifications(webId, currentNotifications){
    if(webId && await checkNewNotifications(webId, currentNotifications)) {
      const updatedNotifications = await fetchNotifications(webId)
      setNotifications(updatedNotifications)
    }
  }

  async function fetchNotifications(webId){ 
    const notificationsMetadata = await getNotificationMetadata(webId)
    if(!notificationsMetadata) return []
    const notificationList = []
    for await (const metadata of notificationsMetadata){
      const notification = await getNotification(metadata.id)
      metadata.types = await getNotificationTypes(notification)
      notification.metadata = metadata
      notificationList.push(notification)
    }
    return notificationList
  }  
}

export default useNotifications