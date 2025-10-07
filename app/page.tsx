'use client';

import { useEffect, useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from 'recharts';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface DataPoint {
  timestamp: string;
  count: number;
}

interface Stats {
  totalSignups: number;
  growthRate: number;
  averagePerHour: number;
  estimatedCompletion: Date | null;
  daysRemaining: number;
  lastDayGrowth: number;
}

export default function Home() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [showDetails, setShowDetails] = useState(true);
  const [timeRange, setTimeRange] = useState<'all' | '7d' | '24h'>('all');
  const TARGET = 5000; // goal

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from Supabase
        const { data: signupData, error } = await supabase
          .from('signups')
          .select('timestamp, count')
          .order('timestamp', { ascending: true });

        if (error) {
          console.error('Error fetching from Supabase:', error);
          setLoading(false);
          return;
        }

        if (!signupData || signupData.length === 0) {
          console.error('No data returned from Supabase');
          setLoading(false);
          return;
        }

        // Transform the data to match our DataPoint interface
        const parsedData: DataPoint[] = signupData.map((item) => ({
          timestamp: item.timestamp,
          count: item.count
        }));

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

          // Calculate statistics
          if (parsedData.length > 1) {
            const first = parsedData[0];
            const timeDiff = lastUpdateTime.getTime() - new Date(first.timestamp).getTime();
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            const signupDiff = latest.count - first.count;
            const avgPerHour = signupDiff / hoursDiff;

            // Calculate last 24 hours growth
            const oneDayAgo = now.getTime() - (24 * 60 * 60 * 1000);
            const recentData = parsedData.filter(d => new Date(d.timestamp).getTime() >= oneDayAgo);
            const lastDayGrowth = recentData.length > 1
              ? recentData[recentData.length - 1].count - recentData[0].count
              : 0;

            // Estimate completion date
            const remaining = TARGET - latest.count;
            let estimatedCompletion = null;
            let daysRemaining = 0;

            if (avgPerHour > 0 && remaining > 0) {
              const hoursRemaining = remaining / avgPerHour;
              daysRemaining = Math.ceil(hoursRemaining / 24);
              estimatedCompletion = new Date(now.getTime() + (hoursRemaining * 60 * 60 * 1000));
            }

            const growthRate = (signupDiff / first.count) * 100;

            setStats({
              totalSignups: latest.count,
              growthRate,
              averagePerHour: avgPerHour,
              estimatedCompletion,
              daysRemaining,
              lastDayGrowth
            });
          }
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const percentage = TARGET > 0 ? (currentCount / TARGET) * 100 : 0;

  // Filter data based on time range
  const getFilteredData = () => {
    if (timeRange === 'all') return data;

    const now = new Date().getTime();
    const msPerDay = 24 * 60 * 60 * 1000;
    const cutoff = timeRange === '7d' ? now - (7 * msPerDay) : now - msPerDay;

    return data.filter(d => new Date(d.timestamp).getTime() >= cutoff);
  };

  const filteredData = getFilteredData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700 dark:text-gray-200">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                    Moonshot Signup Count
                  </h1>
                  </div>
              </div>
              <p className="text-base text-gray-600 dark:text-gray-400 mt-2">
                Comprehensive signup tracking and growth projections
              </p>
            </div>

            {/* Settings Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                {showDetails ? 'Hide details' : 'Show details'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Current Count - Hero Card */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3 font-semibold">Current Signups</p>
              <div className="text-7xl md:text-8xl font-bold text-gray-900 dark:text-white mb-6">
                {currentCount.toLocaleString()}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-2xl h-6 mb-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-6 rounded-lg transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                >
                  <span className="text-white text-[10px] font-semibold">{percentage.toFixed(1)}%</span>
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-4">
                <span>0</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">Goal: {TARGET.toLocaleString()}</span>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last updated: <span className="font-semibold text-gray-700 dark:text-gray-300">{lastUpdated}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Prediction Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-2xl shadow-lg p-8 text-white">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-1">Goal projection</h3>
              <div className="h-px bg-white/20 w-16"></div>
            </div>

            {stats?.estimatedCompletion && stats.daysRemaining > 0 ? (
              <>
                <p className="text-xs opacity-80 mb-2 uppercase tracking-wide">Estimated completion</p>
                <p className="text-lg font-semibold mb-6">{formatDate(stats.estimatedCompletion)}</p>

                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
                  <p className="text-5xl font-bold mb-2">{stats.daysRemaining}</p>
                  <p className="text-sm opacity-90 uppercase tracking-wide">Days remaining</p>
                </div>

                {showDetails && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-xs opacity-75">Based on current growth rate of {stats.averagePerHour.toFixed(1)}/hour</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-xl font-semibold">Goal achieved</p>
            )}
          </div>
        </div>

        {/* Detailed Stats Grid */}
        {showDetails && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold mb-3">Growth Rate</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                +{stats?.growthRate.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total growth since start</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold mb-3">Avg per Hour</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stats?.averagePerHour.toFixed(0)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Average signup rate</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold mb-3">Last 24 Hours</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                +{stats?.lastDayGrowth || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">New signups today</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold mb-3">Remaining</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {(TARGET - currentCount).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">To reach target</p>
            </div>
          </div>
        )}

        {/* Chart Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Signup history
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Historical trend analysis</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Time Range Filter */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setTimeRange('24h')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    timeRange === '24h'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  24 hours
                </button>
                <button
                  onClick={() => setTimeRange('7d')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    timeRange === '7d'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  7 days
                </button>
                <button
                  onClick={() => setTimeRange('all')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    timeRange === 'all'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  All time
                </button>
              </div>

              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg font-medium">
                {filteredData.length} records
              </span>
            </div>
          </div>

          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTime}
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  stroke="#9ca3af"
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  stroke="#9ca3af"
                />
                <Tooltip
                  labelFormatter={formatTime}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                  labelStyle={{
                    color: '#1f2937',
                    fontWeight: '600',
                    marginBottom: '4px',
                    fontSize: '12px'
                  }}
                  itemStyle={{
                    color: '#2563eb',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fill="url(#colorCount)"
                  dot={false}
                  activeDot={{ r: 5, stroke: '#2563eb', strokeWidth: 2, fill: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Info Section */}
        {showDetails && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Key insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Tracking started</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {data.length > 0 ? new Date(data[0].timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Campaign status</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {percentage >= 100 ? 'Completed' : percentage >= 80 ? 'Near completion' : percentage >= 50 ? 'On track' : 'In progress'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Auto refresh</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Every 60 seconds</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}