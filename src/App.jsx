import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import './App.css';

// Expensive calculation in render path (simulates CPU load)
const formatTimestampSlow = (timestamp) => {
  if (!timestamp) return '';
  const start = performance.now();
  // Artificially block the main thread for 1ms per item to simulate complex rendering logic
  while (performance.now() - start < 1.5) {
    // block
  }
  return new Date(timestamp * 1000).toLocaleString();
};

// Sub-component for an individual article item
function ArticleItem({ article }) {
  if (!article) return null;
  
  const formattedDate = formatTimestampSlow(article.time);

  return (
    <div className="article-card" data-testid="article-item">
      <div className="article-header">
        <span className="article-author">Posted by u/{article.by}</span>
        <span className="article-score">★ {article.score} points</span>
      </div>
      <h3 className="article-title">
        {article.url ? (
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        ) : (
          article.title
        )}
      </h3>
      <div className="article-footer">
        <span className="article-date">Published: {formattedDate}</span>
      </div>
    </div>
  );
}

// StatsPanel component to display simulated statistics (to be code-split later)
function StatsPanel({ articles }) {
  // Simulates a heavy dashboard widget that isn't needed for the primary UI
  const totalScore = _.sumBy(articles, 'score') || 0;
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

function App() {
  const [articles, setArticles] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchProgress, setFetchProgress] = useState({ current: 0, total: 0 });
  const [sortByScore, setSortByScore] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Anti-pattern: Network Waterfall (N+1 Serial Requests)
  useEffect(() => {
    const fetchAllStories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        if (!response.ok) throw new Error('Failed to fetch top story IDs');
        const storyIds = await response.json();
        
        // We take the top 500 stories
        const targetIds = storyIds.slice(0, 500);
        setFetchProgress({ current: 0, total: targetIds.length });
        
        const fetchedStories = [];
        
        // Anti-pattern: Sequential loop executing N+1 requests
        for (let i = 0; i < targetIds.length; i++) {
          const id = targetIds[i];
          try {
            const storyResp = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            if (storyResp.ok) {
              const storyData = await storyResp.json();
              if (storyData) {
                fetchedStories.push(storyData);
              }
            }
          } catch (e) {
            console.error(`Failed to fetch story ${id}`, e);
          }
          setFetchProgress({ current: i + 1, total: targetIds.length });
        }
        
        if (fetchedStories.length === 0) {
          throw new Error('No stories could be fetched from the HackerNews API.');
        }
        setArticles(fetchedStories);
      } catch (err) {
        console.warn('HackerNews API fetch failed. Loading local fallback dataset:', err);
        setError('Network DNS block detected. Loaded local offline backup dataset (500 stories).');
        
        // Populate 500 mock stories for evaluation
        const fallbackStories = Array.from({ length: 500 }, (_, i) => ({
          id: 990000 + i,
          title: `HN Backup #${i + 1}: [Slow Version] ${
            i % 5 === 0 ? 'Mastering React 19 Performance with TanStack Virtual' :
            i % 5 === 1 ? 'Why N+1 Network Waterfalls Kill Frontend Responsiveness' :
            i % 5 === 2 ? 'Understanding Core Web Vitals: LCP, CLS, and INP' :
            i % 5 === 3 ? 'A Guide to Cherry-Picking Imports and Code-Splitting in Vite' :
            'Containerizing Web Applications using Multi-Stage Docker Builds'
          }`,
          score: Math.floor(Math.random() * 800) + 15,
          by: `perf_engineer_${i % 12}`,
          time: Math.floor(Date.now() / 1000) - (i * 1800),
          url: 'https://github.com/THANMAHI/newsAggregator-23A91A61B3',
        }));
        setArticles(fallbackStories);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllStories();
  }, []);

  // Filter logic
  const filteredArticles = articles.filter(article => 
    article && article.title && article.title.toLowerCase().includes(filterText.toLowerCase())
  );

  // Anti-pattern: Inefficient dependency usage (full lodash sortBy)
  const displayArticles = sortByScore 
    ? _.sortBy(filteredArticles, (o) => -o.score) 
    : filteredArticles;

  return (
    <div className="app-container">
      {/* Unoptimized Hero Image: Large size, no dimensions/srcset/lazy-loading */}
      <div className="hero-banner">
        <img 
          src="/hero.jpg" 
          alt="News Hero Banner" 
          data-testid="hero-image"
          className="hero-image-raw"
        />
        <div className="hero-overlay">
          <h1>HackerNews Portal</h1>
          <p>Real-time insights and tech news aggregator</p>
        </div>
      </div>

      <main className="content">
        <div className="controls-bar">
          <div className="search-box">
            <input 
              type="text"
              placeholder="Search articles by title..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="action-buttons">
            <button 
              onClick={() => setSortByScore(!sortByScore)} 
              className={`btn ${sortByScore ? 'btn-active' : 'btn-inactive'}`}
            >
              {sortByScore ? 'Sorted by Score ✓' : 'Sort by Score'}
            </button>
            <button 
              onClick={() => setShowStats(!showStats)} 
              className={`btn ${showStats ? 'btn-active' : 'btn-inactive'}`}
            >
              {showStats ? 'Hide Stats' : 'Show Stats'}
            </button>
          </div>
        </div>

        {/* Display Stats Panel */}
        {showStats && <StatsPanel articles={articles} />}

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading news stories sequentially (N+1 Waterfall)...</p>
            <p className="progress-text">Fetched {fetchProgress.current} of {fetchProgress.total} stories</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Render ALL articles directly to the DOM (No virtualization) */}
        {!loading && (
          <div className="articles-list" data-testid="article-list">
            <div className="results-info">
              Showing {displayArticles.length} of {articles.length} stories
            </div>
            {displayArticles.map((article) => (
              <ArticleItem key={article?.id || Math.random()} article={article} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
