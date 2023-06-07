import React, { useState } from 'react'
import Navbar from '../components/Navbar';
import { useParams } from "react-router-dom";
import "../App.css"
import "./category.css"
import TableHead from '../components/ScoreTable/TableHead';


const Category = () => {
  const params = useParams();
  
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
          {/* create a condition for each param */}
          <TableHead />
        </div>
      </div>
    </div>
  );
}

export default Category
