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
  const {user} = useContext(AuthContext)
  const username = user.username

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
        setScores(scores)
      })()
    }

  }, [params])
  
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
          <div>
          {scores. map((s, index) => <TableRow index={index+1} player1={s.player1} player2={s.player2} score={`${s.player1Score}/${s.player2Score}`}/>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Category
