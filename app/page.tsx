'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  timestamp: string;
  count: number;
}

export default function Home() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const TARGET = 5000; // goal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = 'https://raw.githubusercontent.com/Zawaer/moonshot-signup-count/refs/heads/main/data.csv';
        // Add a timestamp query param and no-store to avoid cached responses from the browser
        const response = await fetch(`${baseUrl}?t=${Date.now()}`, { cache: 'no-store' });
        const csvText = await response.text();

        // Parse CSV safely (handle CRLF, empty lines)
        const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        const parsedData: DataPoint[] = [];

        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',');
          const timestamp = parts[0];
          const countStr = parts[1];
          if (timestamp && countStr) {
            parsedData.push({
              timestamp,
              count: parseInt(countStr, 10)
            });
          }
        }

        // Sort by timestamp to ensure the latest is at the end (guard against unordered CSV)
        parsedData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        setData(parsedData);

        // Get the latest count
        if (parsedData.length > 0) {
          const latest = parsedData[parsedData.length - 1];
          setCurrentCount(latest.count);

          // Calculate time difference
          const lastUpdateTime = new Date(latest.timestamp);
          const now = new Date();
          const diffMs = now.getTime() - lastUpdateTime.getTime();
          const diffMins = Math.floor(diffMs / 60000);

          setLastUpdated(diffMins === 0 ? 'just now' : `${diffMins} min ago`);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every minute
    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const percentage = TARGET > 0 ? (currentCount / TARGET) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-gray-800 dark:text-white">
              Current signups
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Live signup counter and history</p>
          </div>
          <div className="text-sm text-right">
            <a className="text-blue-600 hover:underline" href="https://github.com/Zawaer/moonshot-signup-count" target="_blank" rel="noreferrer">View repo</a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="flex-1 text-center sm:text-left">
            <div className="text-6xl sm:text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {currentCount}
            </div>
            <div className="mt-2">
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200 font-medium">{currentCount} out of {TARGET.toLocaleString()}</p>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200 font-medium">We have {percentage.toFixed(1)}% of the required signups!</p>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">Last updated: <span className="font-semibold">{lastUpdated}</span></p>
            </div>
          </div>

          <div className="w-full sm:w-1/2 h-56 sm:h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTime}
                  tick={{ fill: 'currentColor', fontSize: 11 }}
                />
                <YAxis tick={{ fill: 'currentColor', fontSize: 11 }} />
                <Tooltip 
                  labelFormatter={formatTime}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #ccc',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#2563EB" 
                  strokeWidth={3}
                  dot={{ fill: '#2563EB', r: 4 }}
                  activeDot={{ r: 6, stroke: '#2563EB', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
