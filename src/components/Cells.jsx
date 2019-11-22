import React from 'react'

const Cells = props => {
  return (
    <td
      className="active"
      onClick={props.leftClick}
      onContextMenu={event => {
        event.preventDefault()
        props.rightClick()
      }}
    >
      {props.display}
    </td>
  )
}

export default Cells
