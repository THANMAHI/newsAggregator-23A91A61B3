import React from 'react';
import sumBy from 'lodash/sumBy';

function StatsPanel({ articles }) {
  const totalScore = sumBy(articles, 'score') || 0;
  const averageScore = articles.length ? (totalScore / articles.length).toFixed(1) : 0;
  
  return (
    <div className="stats-panel">
      <h3>Aggregate Story Metrics</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Score</h4>
          <p>{totalScore}</p>
        </div>
        <div className="stat-card">
          <h4>Average Score</h4>
          <p>{averageScore}</p>
        </div>
        <div className="stat-card">
          <h4>Total Articles Loaded</h4>
          <p>{articles.length}</p>
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;
