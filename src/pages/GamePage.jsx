import React, { useEffect, useRef, useState } from 'react';
import Knight from '../components/characters/Knight';
import Mage from '../components/characters/Mage';
import { gameSocket } from '../socket';

const users = [{userId: 0, type: 'mage'}, {userId: 1, type: 'mage'}]

function GamePage() {
    const [gameWidth, setGameWidth] =useState(0)
    const [initPositions, setInitPositions] = useState(null)
  
    const gameRef = useRef(null)
  
    useEffect(()=>{
      gameSocket.connect() 
      // gameSocket.emit("joinRoom", "room1")
      gameSocket.on("getPosition", (position, opponent)=> {
        
        console.log(position, opponent)
      })
      gameSocket.on("getVelocity", (velocity, opponent)=> {
        console.log(velocity, opponent)
      })
      gameSocket.on("getAction", (action, opponent)=> {
        console.log(action, opponent)
      })
      gameSocket.on("getDirection", (direction, opponent)=> {
        console.log(direction, opponent)
      })
      return () => {
        gameSocket.disconnect();
      }
    }, [])
  
    useEffect(()=>{
      setGameWidth(gameRef.current.offsetWidth)
      
      if(gameWidth) {
        const updatePosition = [{ top: 450, left: 100 }, {top: 450, left: gameWidth-250}]
        console.log(updatePosition)
        setInitPositions(updatePosition)
      } 
      
    }, [gameRef, gameWidth])
  
  
    const knight = () => {
      return <Knight num={0} initPosition={initPositions[0]} initDirection={1} />
    }
    const mage = () => {
      return <Mage num={1} initPosition={initPositions[1]} initDirection={-1} />
    }
    
  
    return (
      <div id="game" ref={gameRef}>
        { initPositions && <>
        <Knight num={0} initPosition={initPositions[0]} initDirection={1} />
        <Mage num={1} initPosition={initPositions[1]} initDirection={-1} /> 
        </>}
      </div>
    );
  
}

export default GamePage
