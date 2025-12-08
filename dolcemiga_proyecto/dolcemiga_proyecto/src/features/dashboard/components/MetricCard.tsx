interface MetricCardProps {
    title: string
    value: string | number
    icon: string
    color: 'primary' | 'green' | 'blue' | 'orange' | 'purple' | 'red'
    change?: string
  }
  
  const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, change }) => {
    const colorClasses = {
      primary: 'bg-primary text-white',
      green: 'bg-green-500 text-white',
      blue: 'bg-blue-500 text-white',
      orange: 'bg-orange-500 text-white',
      purple: 'bg-purple-500 text-white',
      red: 'bg-red-500 text-white'
    }
  
    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {change && (
              <p className="text-xs text-green-600 mt-1">{change}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <span className="text-xl">{icon}</span>
          </div>
        </div>
      </div>
    )
  }
  
  export default MetricCard