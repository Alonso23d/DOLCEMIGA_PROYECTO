import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface VentasChartProps {
  data: any[]
  type?: 'line' | 'bar'
}

const VentasChart: React.FC<VentasChartProps> = ({ data, type = 'line' }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Ventas Mensuales</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Ventas']}
                labelFormatter={(label) => `Mes: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="ventas" 
                stroke="#880C48" 
                strokeWidth={2}
                dot={{ fill: '#880C48' }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Ventas']}
                labelFormatter={(label) => `Mes: ${label}`}
              />
              <Bar dataKey="ventas" fill="#880C48" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default VentasChart