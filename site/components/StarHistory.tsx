'use client';
import { useEffect, useState } from 'react';
import { loadRepositoryStars } from '../lib/github';
export function StarHistory() {
  const [stars, setStars] = useState<number>();
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      setUnavailable(true);
    }, 10000);
    loadRepositoryStars(controller.signal)
      .then(setStars)
      .catch(() => {
        if (!controller.signal.aborted) setUnavailable(true);
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);
  return (
    <div className="star-history">
      {stars !== undefined && stars > 0 ? (
        <a href="https://www.star-history.com/#Gurtejhundal/PoMade&Date">
          <img
            src="https://api.star-history.com/svg?repos=Gurtejhundal/PoMade&type=Date"
            alt="PoMade's actual GitHub star history"
            width="900"
            height="500"
            loading="lazy"
          />
        </a>
      ) : (
        <div
          className="star-history-empty"
          role="img"
          aria-label={
            stars === 0
              ? 'PoMade has zero GitHub stars. No growth history yet.'
              : 'GitHub star history is loading or unavailable.'
          }
        >
          <div className="chart-legend">
            <i />
            Gurtejhundal / PoMade
          </div>
          <span className="chart-y-label">GitHub Stars</span>
          <div className="chart-plot">
            <span className="chart-zero">0</span>
            <div className="chart-message">
              {stars === 0 ? (
                <>
                  <strong>Every project starts somewhere.</strong>
                  <span>0 stars. The story starts here.</span>
                </>
              ) : (
                <span>
                  {unavailable
                    ? 'Star history is temporarily unavailable.'
                    : 'Loading GitHub star history…'}
                </span>
              )}
            </div>
          </div>
          <span className="chart-x-label">Date</span>
        </div>
      )}
      <p className="history-caption">
        Real GitHub data.{' '}
        <a href="https://github.com/Gurtejhundal/PoMade/stargazers">
          View stargazers
        </a>{' '}
        ·{' '}
        <a href="https://www.star-history.com/#Gurtejhundal/PoMade&Date">
          Open Star History ↗
        </a>
      </p>
    </div>
  );
}
