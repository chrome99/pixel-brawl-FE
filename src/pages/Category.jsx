import React, { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar';
import { useParams } from "react-router-dom";
import "../App.css"
import "./category.css"
import TableRow from '../components/ScoreTable/TableRow';
import { getAllScores, getScoresByUser } from '../services/scoreServices';
import { AuthContext } from '../contexts/AuthContext';


const Category = () => {
  const params = useParams();

  const [scores , setScores] = useState([])
  const [scoreSum , setScoreSum] = useState([])
  const {user} = useContext(AuthContext)
  const username = user?.username

  useEffect(()=>{
    if (params.categoryName === "scores") {
      (async()=>{
        const scores = await getAllScores()
        setScores(scores)
      })()
    }

    if (params.categoryName === "user-scores"){
      (async()=>{
        const scores = await getScoresByUser(username)
        const scoreSum = getPlayerScoreSum(username, scores)
        setScores(scores)
        setScoreSum(scoreSum)
      })()
    }

  }, [params, user])


  function getPlayerScoreSum(playerName, data) {
    let sum = 0;
    
    for (let i = 0; i < data.length; i++) {
      const game = data[i];
      
      if (game.player1 === playerName) {
        sum += game.player1Score;
      } else if (game.player2 === playerName) {
        sum += game.player2Score;
      }
    }
    
    return sum;
  }
  
  return (
    <div>
      <div>
        <Navbar />
        <div id="matches">
          <header>
            <h3 className="pageHeader">
              {params.categoryName === "scores"
                ? "Scores"
                : "My Scores"}
            </h3>
          </header>
          <TableRow index={""} player1={"player1"} player2={"player2"} score={"score"}/>
          <div className='tableBody'>
          {scores. map((s, index) => <TableRow index={index+1} player1={s.player1} player2={s.player2} score={`${s.player1Score}/${s.player2Score}`}/>)}
          </div>
          {params.categoryName === "user-scores" && <p className='userScore'>{`Total Score: ${scoreSum}`}</p>}
        </div>
      </div>
    </div>
  );
}

export default Category
