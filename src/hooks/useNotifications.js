import { useState, useEffect } from 'react';
import { getNotificationMetadata, getNotification } from '../util/notifications';

const useNotifications = function(webId) {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    let mounted = true
    async function fetchNotifications(webId){ 
      const notificationsMetadata = await getNotificationMetadata(webId)
      if(!notificationsMetadata) return []
      const notificationList = []
      for await (const metadata of notificationsMetadata){
        const notification = await getNotification(metadata.id)
        notification.metadata = metadata
        notificationList.push(notification)
      }
      if(mounted) setNotifications(notificationList)
    }
    if(webId) fetchNotifications(webId)
    return () => {
      mounted = false
    }
  }, [webId])  
  return notifications
}

export default useNotifications