import React, { useState, useEffect} from 'react'
import "./GameOver.css"

function GameOver({matchWinner}) {
    
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      setIsVisible(true);
    }, []);

  return (
    <div className={`gameOver ${isVisible ? 'visible' : ''}`}>
        <h1>Game Over</h1>
        <p>{matchWinner} Won</p>
    </div>
  )
}

export default GameOver
