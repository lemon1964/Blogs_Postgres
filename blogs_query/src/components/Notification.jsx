import { useNotificationValue } from '../context/NotificationContext'
import { Alert } from '@mui/material'

const Notification = () => {
  const notification = useNotificationValue()

  if (!notification) return null

  if (!notification.message) return null

  const style = {
    backgroundColor:
      notification.type === 'create'
        ? 'lightgreen'
        : notification.type === 'like'
          ? 'lightblue'
          : notification.type === 'delete'
            ? 'lightyellow'
            : notification.type === 'error'
              ? 'lightpink'
              : 'lightgray',
    padding: '1rem',
    borderRadius: '5px'
  }

  return (
    <div className="notification-wrapper notification-enter" style={style}>
      {notification.message && (
        <Alert severity="success">{notification.message}</Alert>
      )}
    </div>
  )
}

export default Notification
