import React, { useEffect, useState } from 'react';
import Actor from "../components/Collision/Actor";
import Attack from "../components/Collision/Attack";
import { gameSocket } from '../socket';
import Player from '../components/characters/Player';

function GamePage() {
  const [playerStats, setPlayerStats] = useState([
  {id: "player0", num: 0, type: "knight", action: "idle", health: 100, position: { top: 275, left: 60 }, velocity: { x: 0, y: 0 }, direction: 1},
  {id: "player1", num: 1, type: "mage", action: "idle", health: 100, position: { top: 220, left: 760 }, velocity: { x: 0, y: 0 }, direction: -1}
  ]);
  const [colObjects, setColObjects] = useState([]);

  function updateStats(statsId, field, newValue) {
    setPlayerStats(prev => {
      const updatedStats = prev.map(stats => {
        if (stats.id === statsId) {
          return { ...stats, [field]: newValue};
        }
        return stats;
      });

      return updatedStats;
    });
  }

  function takeDamage(statsId, damage) {
    setPlayerStats(prev => {
      const updatedStats = prev.map(stats => {
        if (stats.id === statsId) {
          return { ...stats, health: stats.health - damage};
        }
        return stats;
      });

      return updatedStats;
    });
  }

  function addCol(newCol) {
    setColObjects(prev => [...prev, newCol]);
  };

  function deleteCol(colId) {
    setColObjects(prev => prev.filter(col => col.id !== colId));
  }

  function updateColPosition(colId, top, left) {
    setColObjects(prev => {
      const updatedObjects = prev.map(col => {
        if (col.id === colId) {
          return { ...col, top: top, left: left};
        }
        return col;
      });

      return updatedObjects;
    });
  };
    
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


  const knight = () => {
    return <Player type={'knight'} num={0} initPosition={{ top: 275, left: 60 }} initDirection={1} addCol={addCol} deleteCol={deleteCol} updateColPosition={updateColPosition} playerStats={playerStats} updateStats={updateStats} />
  }
  const mage = () => {
    return <Player type={'mage'} num={1} initPosition={{ top: 220, left: 760 }} initDirection={-1} addCol={addCol} deleteCol={deleteCol} updateColPosition={updateColPosition} playerStats={playerStats} updateStats={updateStats} />
  }
  

  return (
    <div id="game">
      {playerStats.map((p) => {
        return <Player type={p.type} num={p.num} position={p.position} direction={p.direction} addCol={addCol} deleteCol={deleteCol} updateColPosition={updateColPosition} playerStats={playerStats} updateStats={updateStats} />
      })}
      {colObjects.map((col) => {
        switch (col.type) {
          case "actor":
            return <Actor key={col.id} col={col} colObjects={colObjects} updateStats={updateStats}/>
          case "attack":
            return <Attack key={col.id} col={col} colObjects={colObjects} updateStats={updateStats} takeDamage={takeDamage}/>
          default:
            return "";
        }
      })}
    </div>
  );
  
}

export default GamePage