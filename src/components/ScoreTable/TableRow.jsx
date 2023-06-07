import React from 'react'
import "./TableRow.css"

function TableRow({index, player1, player2, score}) {

  return (
    <div className='tableRow'>
      <p>#{index}</p>
      <p>{player1}</p>
      <p>vs</p>
      <p>{player2}</p>
      <p>{score}</p>
    </div>
  )
}

export default TableRow
