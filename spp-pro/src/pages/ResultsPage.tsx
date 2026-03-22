import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import { ChartCard, ProgressBar } from '../components/cards';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Download, ArrowRight, AlertTriangle, TrendingUp } from 'lucide-react';
import { useStore } from '../store';

export const ResultsPage = () => {
  const navigate = useNavigate();
  const { lastPrediction } = useStore();

  if (!lastPrediction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <Card className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Results Available</h2>
          <p className="text-slate-300 mb-6">
            Please complete an assessment first to see your prediction results.
          </p>
          <Button onClick={() => navigate('/assessment')} className="w-full">
            Start Assessment
          </Button>
        </Card>
      </div>
    );
  }

  const riskProbability = Math.round(lastPrediction.risk_probability * 100);
  const confidence = Math.round(lastPrediction.confidence * 100);

  const riskData = [
    { name: 'Risk', value: riskProbability, fill: '#ef4444' },
    { name: 'No Risk', value: 100 - riskProbability, fill: '#10b981' },
  ];

  const getRiskColor = (band: string) => {
    const colors = {
      Low: 'text-green-400',
      Moderate: 'text-yellow-400',
      High: 'text-red-400',
    };
    return colors[band as keyof typeof colors] || 'text-slate-400';
  };

  const getRiskBg = (band: string) => {
    const colors = {
      Low: 'bg-green-500/10 border-green-500/30',
      Moderate: 'bg-yellow-500/10 border-yellow-500/30',
      High: 'bg-red-500/10 border-red-500/30',
    };
    return colors[band as keyof typeof colors] || 'bg-slate-500/10';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Assessment Results</h1>
          <p className="text-slate-400">Here's your personalized risk assessment and recommendations</p>
        </motion.div>

        {/* Main Result Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left - Risk Gauge */}
              <div className="flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      dataKey="value"
                      startAngle={180}
                      endAngle={0}
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center -mt-4">
                  <p className="text-5xl font-bold text-white">{riskProbability}%</p>
                  <p className="text-slate-400">Risk Probability</p>
                </div>
              </div>

              {/* Right - Details */}
              <div className="flex flex-col justify-center gap-6">
                <div>
                  <p className="text-slate-400 text-sm mb-2">Risk Classification</p>
                  <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${getRiskBg(
                    lastPrediction.risk_band
                  )} ${getRiskColor(lastPrediction.risk_band)}`}>
                    {lastPrediction.risk_band === 'Low' && '✓ Low Risk'}
                    {lastPrediction.risk_band === 'Moderate' && '⚠ Moderate Risk'}
                    {lastPrediction.risk_band === 'High' && '🔴 High Risk'}
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-2">Model Confidence</p>
                  <ProgressBar value={confidence} color="blue" showValue />
                  <p className="text-xs text-slate-500 mt-1">
                    {confidence > 80
                      ? 'Highly confident in prediction'
                      : confidence > 60
                      ? 'Reasonably confident'
                      : 'More data recommended for accuracy'}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-slate-400 text-sm mb-3">Key Factors Influencing Score</p>
                  <div className="space-y-2">
                    {lastPrediction.key_factors.slice(0, 3).map((factor, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{factor.factor}</span>
                        <span className="text-blue-400 font-semibold">
                          {Math.round(factor.impact * 100)}% impact
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Insights Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {/* Recommendations */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              What You Can Do
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <span className="text-blue-400 font-bold mt-0.5">→</span>
                <span className="text-slate-300">Increase daily study consistency</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-blue-400 font-bold mt-0.5">→</span>
                <span className="text-slate-300">Prioritize sleep (7-9 hours/night)</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <span className="text-blue-400 font-bold mt-0.5">→</span>
                <span className="text-slate-300">Engage with peer discussions</span>
              </li>
            </ul>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">📊 Benchmark</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-slate-400 mb-1">Your Risk Score</p>
                <p className="text-2xl font-bold text-white">{riskProbability}th percentile</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Expected Improvement</p>
                <p className="text-xl font-bold text-green-400">-15% risk</p>
                <p className="text-xs text-slate-500">with recommended actions</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">💡 Smart Insights</h3>
            <div className="space-y-2 text-sm">
              <p className="text-slate-300">
                Your attendance is strong, but consistency shows room for improvement. Focus on daily routines.
              </p>
              <p className="text-blue-400 font-semibold text-xs mt-3">
                📈 Potential Improvement: ~25% with interventions
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Detailed Breakdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <ChartCard
            title="Explainable AI Insights"
            description="How each factor contributed to your risk score"
          >
            <div className="space-y-4">
              {lastPrediction.key_factors.map((factor, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300">{factor.factor}</span>
                    <span className="text-blue-400 font-semibold">
                      {Math.round(factor.impact * 100)}%
                    </span>
                  </div>
                  <ProgressBar
                    value={factor.impact * 100}
                    color="blue"
                    showValue={false}
                  />
                </div>
              ))}
            </div>
          </ChartCard>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button onClick={() => navigate('/recommendations')} className="flex-1 sm:flex-none">
            💡 Get Personalized Recommendations
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="secondary" className="flex-1 sm:flex-none">
            <Download className="w-4 h-4" />
            Download PDF Report
          </Button>
          <Button variant="secondary" onClick={() => navigate('/assessment')} className="flex-1 sm:flex-none">
            📊 Retake Assessment
          </Button>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-center text-sm text-slate-400"
        >
          <p>
            This assessment is AI-powered and designed to help identify potential academic risks. 
            Always consult with academic advisors for personalized guidance.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
