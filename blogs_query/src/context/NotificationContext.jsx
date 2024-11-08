import { createContext, useReducer, useContext } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'CREATE':
      return {
        message: action.payload.message,
        type: action.payload.type
      }
    case 'CLEAR':
      return null
    default:
      return state
  }
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  )

  const createNotification = (message, type) => {
    notificationDispatch({ type: 'CREATE', payload: { message, type } })

    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR' })
    }, 5000)
  }

  return (
    <NotificationContext.Provider
      value={{ notification, notificationDispatch, createNotification }}
    >
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const context = useContext(NotificationContext)
  if (!context)
    throw new Error(
      'useNotificationValue must be used within a NotificationContextProvider'
    )
  return context.notification
}

export const useNotificationDispatch = () => {
  const context = useContext(NotificationContext)
  if (!context)
    throw new Error(
      'useNotificationDispatch must be used within a NotificationContextProvider'
    )
  return context.notificationDispatch
}

export const useCreateNotification = () => {
  const context = useContext(NotificationContext)
  if (!context)
    throw new Error(
      'useCreateNotification must be used within a NotificationContextProvider'
    )
  return context.createNotification
}

export default NotificationContext
