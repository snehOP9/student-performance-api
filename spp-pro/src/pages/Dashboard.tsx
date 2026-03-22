import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MetricCard, ChartCard, ProgressBar } from '../components/cards';
import { Button, Card } from '../components/ui';
import { AlertTriangle, TrendingUp, BookOpen, Moon, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();

  // Mock data
  const riskTrendData = [
    { month: 'Jan', low: 40, moderate: 30, high: 20 },
    { month: 'Feb', low: 38, moderate: 32, high: 22 },
    { month: 'Mar', low: 35, moderate: 35, high: 25 },
    { month: 'Apr', low: 32, moderate: 38, high: 28 },
    { month: 'May', low: 38, moderate: 35, high: 22 },
    { month: 'Jun', low: 42, moderate: 32, high: 18 },
  ];

  const performanceData = [
    { name: 'Attendance', value: 85 },
    { name: 'Study\nConsistency', value: 72 },
    { name: 'Sleep\nQuality', value: 68 },
    { name: 'Resource\nEngagement', value: 78 },
  ];

  const riskDistribution = [
    { name: 'Low', value: 42, fill: '#10b981' },
    { name: 'Moderate', value: 35, fill: '#f59e0b' },
    { name: 'High', value: 23, fill: '#ef4444' },
  ];

  const recentPredictions = [
    { id: 1, name: 'Alex Johnson', risk: 'Moderate', score: 58, date: 'Today' },
    { id: 2, name: 'Sarah Williams', risk: 'Low', score: 25, date: '2 days ago' },
    { id: 3, name: 'Mike Davis', risk: 'High', score: 78, date: '1 week ago' },
    { id: 4, name: 'Emma Wilson', risk: 'Moderate', score: 52, date: '2 weeks ago' },
  ];

  const getRiskColor = (risk: string) => {
    const colors = {
      Low: 'text-green-400',
      Moderate: 'text-yellow-400',
      High: 'text-red-400',
    };
    return colors[risk as keyof typeof colors] || 'text-slate-400';
  };

  const getRiskBg = (risk: string) => {
    const colors = {
      Low: 'bg-green-500/10 border-green-500/30',
      Moderate: 'bg-yellow-500/10 border-yellow-500/30',
      High: 'bg-red-500/10 border-red-500/30',
    };
    return colors[risk as keyof typeof colors] || 'bg-slate-500/10';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Welcome back! Here's your student performance overview.</p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 flex flex-col sm:flex-row gap-4"
        >
          <Button onClick={() => navigate('/assessment')} className="flex-1 sm:flex-none">
            📊 New Assessment
          </Button>
          <Button variant="secondary" onClick={() => navigate('/analytics')} className="flex-1 sm:flex-none">
            📈 View Analytics
          </Button>
          <Button variant="secondary" onClick={() => navigate('/recommendations')} className="flex-1 sm:flex-none">
            💡 Get Recommendations
          </Button>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid md:grid-cols-5 gap-4"
        >
          <MetricCard
            title="Avg Risk Score"
            value="45.2%"
            color="blue"
            change={-12}
            changeLabel="vs last month"
            icon={<AlertTriangle className="w-6 h-6" />}
          />
          <MetricCard
            title="Attendance Health"
            value="84%"
            color="green"
            change={5}
            changeLabel="Improving"
            icon={<BookOpen className="w-6 h-6" />}
          />
          <MetricCard
            title="Study Consistency"
            value="72%"
            color="purple"
            change={8}
            changeLabel="Strong trend"
            icon={<TrendingUp className="w-6 h-6" />}
          />
          <MetricCard
            title="Sleep Quality"
            value="6.8h"
            unit="avg"
            color="orange"
            change={2}
            changeLabel="Better sleeping"
            icon={<Moon className="w-6 h-6" />}
          />
          <MetricCard
            title="Total Students"
            value="248"
            color="blue"
            change={12}
            changeLabel="Active this month"
            icon={<Zap className="w-6 h-6" />}
          />
        </motion.div>

        {/* Charts Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid lg:grid-cols-2 gap-6"
        >
          {/* Risk Trend Chart */}
          <ChartCard title="Risk Distribution Trend" description="Monthly breakdown of student risk levels">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="low" stackId="a" fill="#10b981" />
                <Bar dataKey="moderate" stackId="a" fill="#f59e0b" />
                <Bar dataKey="high" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Performance Radar */}
          <ChartCard title="Student Wellness Profile" description="Key performance metrics across cohort">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={performanceData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" width={140} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                />
                <Bar dataKey="value" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </motion.div>

        {/* Risk Distribution and AI Insights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 grid lg:grid-cols-3 gap-6"
        >
          {/* Risk Distribution Pie */}
          <ChartCard title="Risk Breakdown" description="Current cohort distribution">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* AI Insights */}
          <Card className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">💡 AI Insights</h3>
            <div className="space-y-4">
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-200">
                  <span className="font-semibold">Attendance Alert:</span> 12 students showing declining attendance patterns. Early intervention recommended.
                </p>
              </div>
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-sm text-green-200">
                  <span className="font-semibold">Positive Trend:</span> Study consistency improved 15% this month. Keep up the momentum!
                </p>
              </div>
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-sm text-yellow-200">
                  <span className="font-semibold">Sleep Quality:</span> Average sleep of 6.2 hours. Recommend 7-9 hours for optimal performance.
                </p>
              </div>
              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <p className="text-sm text-purple-200">
                  <span className="font-semibold">Resource Engagement:</span> Forum activity up 28%. Excellent peer learning behavior.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Predictions Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Recent Predictions</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/analytics')}>
                View All →
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Student</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Risk Level</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Risk Score</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPredictions.map((prediction) => (
                    <tr key={prediction.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-white">{prediction.name}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskBg(
                            prediction.risk
                          )} ${getRiskColor(prediction.risk)}`}
                        >
                          {prediction.risk}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-32">
                            <ProgressBar
                              value={prediction.score}
                              color={
                                prediction.score < 40 ? 'green' : prediction.score < 70 ? 'orange' : 'red'
                              }
                              showValue={true}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-400 text-sm">{prediction.date}</td>
                      <td className="py-4 px-4">
                        <Button variant="ghost" size="sm">
                          View →
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
