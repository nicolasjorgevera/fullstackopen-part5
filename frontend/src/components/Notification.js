import React from 'react'

const Notification = ({ message , successful }) => {
  if (message === null) {
    return null
  }
  return (
    <div className={(successful) ? 'successful' : 'error'}>
      {message}
    </div>
  )
}

export default Notification