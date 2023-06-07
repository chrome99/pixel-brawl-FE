import React, { useContext, useEffect, useState } from 'react';
import Actor from "../components/Collision/Actor";
import Attack from "../components/Collision/Attack";
import { gameSocket } from '../socket';
import Player from '../components/characters/Player';
import HealthBar from '../components/HealthBar';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { postScore } from '../services/scoreServices';
// {id: user.id, type: "knight", action: "idle", health: 100, position: { top: 275, left: 60 }, velocity: { x: 0, y: 0 }, direction: 1}
  // {id: "player1", num: 1, type: "mage", action: "idle", health: 100, position: { top: 220, left: 760 }, velocity: { x: 0, y: 0 }, direction: -1}

function GamePage() {
  const room = "hello";
  const { user } = useContext(AuthContext)
  const [playerStats, setPlayerStats] = useState([]);
  const [colObjects, setColObjects] = useState([]);
  const [matchWinner, setMatchWinner] = useState("");
  const navigate = useNavigate();

  function matchWon(winnerName) {
    gameSocket.emit("matchWon", {winnerName: winnerName, room: room});
  }

  function onMatchWon(winnerName) {
    setMatchWinner(winnerName);
  }

  function updateStats(id, field, newValue) {
    gameSocket.emit("updatedPlayer", {player: {id, field, newValue}, room: room});
  }

  function onGetAllPlayer(data) {
    const players = Object.values(data.players);
    players.forEach((player) => {
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
    const { playerId } = data;
    setPlayerStats(prev => {
      const updatedStats = prev.filter(stats => stats.id === playerId);
      return updatedStats;
    });
  }


  function addCol(newCol) {
    gameSocket.emit("getAllCol", {col: newCol, room: room});
  };

  function deleteCol(colId) {
    gameSocket.emit("deleteCol", {colId: colId, room: room});
  }

  function updateCol(colId, top, left) {
    gameSocket.emit("updateCol", {colId: colId, top: top, left: left, room: room});
  };

  function onGetAllCol(allCol) {
    const newColObjects = Object.values(allCol);
    setColObjects(newColObjects);
  };

  function onDeleteCol(colId) {
    setColObjects(prev => prev.filter(col => col.id !== colId));
  }

  function onUpdateCol(data) {
    const { colId, top, left } = data;
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

    const player = {id: user.id, username: user.username, type: "knight", action: "idle", score: 0, health: 100, position: { top: 275, left: 60 }, velocity: { x: 0, y: 0 }, direction: 1};
    gameSocket.emit("joinRoom", room);
    gameSocket.emit("getAllPlayers", {player: player, room: room});

    gameSocket.on("getAllPlayers", onGetAllPlayer);
    gameSocket.on("updatedPlayer", onUpdatedPlayer);

    gameSocket.on("getAllCol", onGetAllCol);
    gameSocket.on("deleteCol", onDeleteCol);
    gameSocket.on("updateCol", onUpdateCol);

    gameSocket.on("matchWon", onMatchWon);
    return () => {
      gameSocket.disconnect();
    }
  }, [user])

  useEffect(() => {
    if (matchWinner === "") return;

    async function updateServerScore() {
      const newScore = {
        player1: playerStats[0].username,
        player2: playerStats[1].username,
        player1Score: playerStats[0].score,
        player2Score: playerStats[1].score
      };
      console.log(newScore);
      await postScore(newScore);
    }
    updateServerScore();

    setTimeout(() => {
      navigate("/character");
    }, 5000);
  }, [matchWinner])


  const knight = () => {
    return <Player type={'knight'} num={0} initPosition={{ top: 275, left: 60 }} initDirection={1} addCol={addCol} deleteCol={deleteCol} updateCol={updateCol} playerStats={playerStats} updateStats={updateStats} />
  }
  const mage = () => {
    return <Player type={'mage'} num={1} initPosition={{ top: 220, left: 760 }} initDirection={-1} addCol={addCol} deleteCol={deleteCol} updateCol={updateCol} playerStats={playerStats} updateStats={updateStats} />
  }  

  return (
    <div>
      <Navbar />
      <div id="game">
        {matchWinner === "" ? "" : <div style={{fontSize: "5rem"}}>{matchWinner}</div>}
        {playerStats.length > 0 ? playerStats.map((p, i) => {
          const barPosition = i === 0 ? {top: 0, left: 0} : {top: 0, right: 0};
          const stats = playerStats.find((player) => player.id === p.id);
          const otherPlayer = playerStats.length !== 2 ? undefined : i === 0 ? playerStats[1].id : playerStats[0].id;
          return (
          <>
            <div>{stats.score}</div>
            <HealthBar key={stats.id + "-healthbar" + i} color={"red"} precentage={stats.health} position={barPosition}/>
            <Player thisUser={stats.id === user.id} matchWinner={matchWinner} username={user.username} key={stats.id} otherPlayer={otherPlayer} stats={stats} updateStats={updateStats} addCol={addCol} deleteCol={deleteCol} updateCol={updateCol} />
          </>)
        }): ""}
        {colObjects.length > 0 ? colObjects.map((col) => {
          switch (col.type) {
            case "actor":
              return <Actor key={col.id} col={col} colObjects={colObjects} updateStats={updateStats}/>
            case "attack":
              return <Attack key={col.id} col={col} colObjects={colObjects} matchWon={matchWon} playerStats={playerStats} updateStats={updateStats} />
            default:
              return "";
          }
        }): ""}
      </div>
    </div>
  );
  
}

export default GamePage