import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import React from 'react';

const data = [
  { name: 'Jan', interviews: 3, success: 2 },
  { name: 'Feb', interviews: 5, success: 3 },
  { name: 'Mar', interviews: 7, success: 5 },
  { name: 'Apr', interviews: 2, success: 1 },
  { name: 'May', interviews: 8, success: 6 },
  { name: 'Jun', interviews: 4, success: 3 },
]

const Reports = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Interview Reports</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Performance</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563' }}
                itemStyle={{ color: '#E5E7EB' }}
              />
              <Legend />
              <Bar dataKey="interviews" fill="#8B5CF6" name="Total Interviews" />
              <Bar dataKey="success" fill="#10B981" name="Successful Interviews" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Interviews" value="29" change="+12%" positive />
        <StatCard title="Success Rate" value="68%" change="+5%" positive />
        <StatCard title="Avg. Score" value="7.8/10" change="-0.3" />
      </div>
    </div>
  )
}

const StatCard = ({ title, value, change, positive }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-gray-400 mb-1">{title}</h3>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold">{value}</span>
        <span className={`text-sm ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </span>
      </div>
    </div>
  )
}

export default Reports