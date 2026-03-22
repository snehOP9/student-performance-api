import { useAppStore } from '../store/appStore'
import { Card } from '../components/ui/card'
import { SectionTitle } from '../components/common/SectionTitle'

export function PredictionHistoryPage() {
  const { predictionHistory } = useAppStore()
  return (
    <div className="space-y-6">
      <SectionTitle title="Prediction History" subtitle="Historical runs for auditability and longitudinal tracking" />
      <Card>
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-400"><tr><th>#</th><th>Risk</th><th>Band</th><th>Top insight</th></tr></thead>
            <tbody>
              {predictionHistory.map((item, index) => (
                <tr key={`${item.risk_probability}-${index}`} className="border-t border-white/10 text-slate-200">
                  <td className="py-2">{index + 1}</td>
                  <td>{item.risk_probability.toFixed(1)}%</td>
                  <td>{item.risk_band}</td>
                  <td>{item.explanation[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
