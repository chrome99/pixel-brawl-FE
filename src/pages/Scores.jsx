import React from 'react'
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import TableHead from '../components/ScoreTable/TableHead';

const Scores = () => {
  return (
    <div>
      <div>
        <Navbar />
        <div id="scores">
          <TableHead/>
        </div>
      </div>
    </div>
  );
}

export default Scores
