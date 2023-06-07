import React from 'react'
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import TableHead from '../components/ScoreTable/TableRow';

const Scores = () => {
  return (
    <div>
      <div>
        <Navbar />
        <div id="scores">
          <TableRow/>
        </div>
      </div>
    </div>
  );
}

export default Scores
