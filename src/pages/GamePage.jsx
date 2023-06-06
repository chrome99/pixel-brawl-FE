import React, { useContext, useEffect, useState } from 'react';
import Actor from "../components/Collision/Actor";
import Attack from "../components/Collision/Attack";
import { gameSocket } from '../socket';
import Player from '../components/characters/Player';
import HealthBar from '../components/HealthBar';
import { AuthContext } from '../contexts/AuthContext';
// {id: user.id, type: "knight", action: "idle", health: 100, position: { top: 275, left: 60 }, velocity: { x: 0, y: 0 }, direction: 1}
  // {id: "player1", num: 1, type: "mage", action: "idle", health: 100, position: { top: 220, left: 760 }, velocity: { x: 0, y: 0 }, direction: -1}

function GamePage() {
  const room = "hello";
  const { user } = useContext(AuthContext)
  const [playerStats, setPlayerStats] = useState([]);
  const [colObjects, setColObjects] = useState([]);

  function updateStats(id, field, newValue) {
    console.log("updateStats id: ", id);
    gameSocket.emit("updatedPlayer", {player: {id, field, newValue}, room: room});
  }

  function onGetAllPlayer(data) {
    const players = Object.values(data.players);
    players.forEach((player) => {
      console.log(player.num);
      if (player.num === 0) {
        player.position = { top: 275, left: 60 };
      }
      else {
        player.position = {top: 220, left: 760};
        player.direction = -1;
        player.type = "mage";
      }
    })
    setPlayerStats(players);
  }

  function onUpdatedPlayer(data) {
    const { id, field, newValue } = data.player;
    setPlayerStats(prev => {
      const updatedStats = prev.map(stats => {
        if (stats.id === id) {
          return { ...stats, [field]: newValue};
        }
        return stats;
      });

      return updatedStats;
    });
  }

  function onRemovedPlayer(data) {
    console.log("removing player")
    const { playerId } = data;
    setPlayerStats(prev => {
      const updatedStats = prev.filter(stats => stats.id === playerId);
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
    
  useEffect(()=> {
    if (!user || !user.id) return;

    gameSocket.connect() 

    const player = {id: user.id, type: "knight", action: "idle", health: 100, position: { top: 275, left: 60 }, velocity: { x: 0, y: 0 }, direction: 1};
    gameSocket.emit("joinRoom", room);
    gameSocket.emit("getAllPlayers", {player: player, room: room});

    gameSocket.on("getAllPlayers", onGetAllPlayer);
    gameSocket.on("updatedPlayer", onUpdatedPlayer);
    return () => {
      gameSocket.disconnect();
    }
  }, [user])


  const knight = () => {
    return <Player type={'knight'} num={0} initPosition={{ top: 275, left: 60 }} initDirection={1} addCol={addCol} deleteCol={deleteCol} updateColPosition={updateColPosition} playerStats={playerStats} updateStats={updateStats} />
  }
  const mage = () => {
    return <Player type={'mage'} num={1} initPosition={{ top: 220, left: 760 }} initDirection={-1} addCol={addCol} deleteCol={deleteCol} updateColPosition={updateColPosition} playerStats={playerStats} updateStats={updateStats} />
  }
  

  return (
    <div id="game">
      {playerStats.length > 0 ? playerStats.map((p, i) => {
        const barPosition = i === 0 ? {top: 0, left: 0} : {top: 0, right: 0};
        const stats = playerStats.find((player) => player.id === p.id);
        return (<>
          <HealthBar key={stats.id + "-healthbar" + i} color={"red"} precentage={stats.health} position={barPosition}/>
          <Player thisUser={stats.id === user.id} key={stats.id} stats={stats} updateStats={updateStats} addCol={addCol} deleteCol={deleteCol} updateColPosition={updateColPosition} />
        </>)
      }): ""}
      {/* {colObjects.map((col) => {
        switch (col.type) {
          case "actor":
            return <Actor key={col.id} col={col} colObjects={colObjects} updateStats={updateStats}/>
          case "attack":
            return <Attack key={col.id} col={col} colObjects={colObjects} updateStats={updateStats} takeDamage={takeDamage}/>
          default:
            return "";
        }
      })} */}
    </div>
  );
  
}

export default GamePage