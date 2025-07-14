import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  bgColor: string
  textColor?: string
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  bgColor, 
  textColor = "text-[var(--text-color)]" 
}: StatsCardProps) {
  return (
    <div className="p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      style={{
        backgroundColor: "var(--card-color)",
        borderColor: "rgba(100, 116, 139, 0.2)",
        color: "var(--text-color)",
      }}    
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${bgColor} mr-4`}>
          <Icon size={24} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        </div>
      </div>
    </div>
  )
}
