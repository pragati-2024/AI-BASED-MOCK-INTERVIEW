import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import React from 'react';
import { useState } from 'react';
const skillData = [
  { name: 'Technical Skills', value: 35, details: [
    { category: 'Data Structures', score: 80 },
    { category: 'Algorithms', score: 75 },
    { category: 'Language Proficiency', score: 90 },
    { category: 'System Design', score: 60 }
  ]},
  { name: 'Problem Solving', value: 25, details: [
    { category: 'Logical Thinking', score: 85 },
    { category: 'Debugging', score: 70 },
    { category: 'Optimization', score: 65 }
  ]},
  { name: 'Communication', value: 20, details: [
    { category: 'Clarity', score: 75 },
    { category: 'Explanation', score: 80 },
    { category: 'Active Listening', score: 90 }
  ]},
  { name: 'Behavioral', value: 15, details: [
    { category: 'Teamwork', score: 85 },
    { category: 'Leadership', score: 70 },
    { category: 'Conflict Resolution', score: 75 }
  ]},
  { name: 'Time Management', value: 5, details: [
    { category: 'Pacing', score: 60 },
    { category: 'Prioritization', score: 70 }
  ]}
];

const COLORS = ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95'];
const SUB_COLORS = ['#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE', '#F5F3FF'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 min-w-[200px]">
        <p className="font-bold text-purple-300 border-b border-gray-700 pb-2 mb-2">{data.name}</p>
        {data.details && (
          <div className="space-y-2">
            {data.details.map((detail, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-gray-300">{detail.category}</span>
                <span className="font-medium text-white">{detail.score}/100</span>
              </div>
            ))}
          </div>
        )}
        <div className="mt-2 pt-2 border-t border-gray-700 flex justify-between">
          <span className="text-gray-400">Overall:</span>
          <span className="font-bold text-white">{data.value}%</span>
        </div>
      </div>
    );
  }
  return null;
};

const InterviewAnalytics = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="space-y-8">
      {/* Main Skills Pie Chart */}
      <div className="bg-gray-800 p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 text-center">Skills Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={skillData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                activeIndex={activeIndex}
                activeShape={{ outerRadius: 90 }}
              >
                {skillData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="#1F2937"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value, entry, index) => (
                  <span className="text-gray-300">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Bar Chart for Selected Skill */}
      {activeIndex !== null && (
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Detailed Analysis: {skillData[activeIndex].name}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={skillData[activeIndex].details}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  stroke="#9CA3AF"
                  tick={{ fill: '#D1D5DB' }}
                />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  width={100}
                  stroke="#9CA3AF"
                  tick={{ fill: '#D1D5DB' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937',
                    borderColor: '#4B5563',
                    borderRadius: '0.5rem'
                  }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Bar 
                  dataKey="score" 
                  fill={SUB_COLORS[activeIndex % SUB_COLORS.length]}
                  radius={[0, 4, 4, 0]}
                  animationDuration={1500}
                >
                  {skillData[activeIndex].details.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={`${SUB_COLORS[activeIndex % SUB_COLORS.length]}${Math.min(90, 50 + index * 10)}`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewAnalytics;