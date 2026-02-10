
import React, { useEffect, useState } from 'react';
import { Option } from '../types';

interface DecisionWheelProps {
  options: Option[];
  spinning: boolean;
  onFinished: (winner: Option) => void;
  targetIndex?: number;
}

const DecisionWheel: React.FC<DecisionWheelProps> = ({ options, spinning, onFinished, targetIndex }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (spinning && targetIndex !== undefined) {
      const sliceDeg = 360 / options.length;
      const extraSpins = 5 + Math.floor(Math.random() * 5);
      // The arrow is at the top (270 degrees typically in unit circle, but let's say 0 is top)
      // We want the winning slice to end at the top (0 deg)
      const targetRotation = (extraSpins * 360) - (targetIndex * sliceDeg) - (sliceDeg / 2);
      setRotation(targetRotation);

      const timer = setTimeout(() => {
        onFinished(options[targetIndex]);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [spinning, targetIndex, options, onFinished]);

  const colors = [
    '#fef9c3', '#fef08a', '#fde047', '#facc15', '#bfdbfe', '#ddd6fe', '#f5d0fe', '#fbcfe8'
  ];

  return (
    <div className="relative flex items-center justify-center w-72 h-72 mx-auto">
      {/* Arrow Indicator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-10 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-yellow-400 shadow-sm" />
      
      {/* Outer Glow */}
      <div className="absolute inset-0 rounded-full border-8 border-white shadow-xl bg-white/50" />

      <svg
        viewBox="0 0 100 100"
        className="w-full h-full wheel-rotate"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <g transform="translate(50, 50)">
          {options.map((opt, i) => {
            const angle = 360 / options.length;
            const startAngle = i * angle;
            const endAngle = (i + 1) * angle;
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const x1 = 45 * Math.cos((Math.PI * (startAngle - 90)) / 180);
            const y1 = 45 * Math.sin((Math.PI * (startAngle - 90)) / 180);
            const x2 = 45 * Math.cos((Math.PI * (endAngle - 90)) / 180);
            const y2 = 45 * Math.sin((Math.PI * (endAngle - 90)) / 180);

            const pathData = `M 0 0 L ${x1} ${y1} A 45 45 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            return (
              <g key={opt.id}>
                <path d={pathData} fill={colors[i % colors.length]} stroke="white" strokeWidth="0.5" />
                <text
                  transform={`rotate(${(startAngle + endAngle) / 2 - 90}) translate(25, 0)`}
                  fontSize="4"
                  fill="#374151"
                  textAnchor="middle"
                  className="font-medium"
                >
                  {opt.label.length > 6 ? opt.label.substring(0, 5) + '..' : opt.label}
                </text>
              </g>
            );
          })}
        </g>
        {/* Center hub */}
        <circle cx="50" cy="50" r="5" fill="white" />
      </svg>
    </div>
  );
};

export default DecisionWheel;
