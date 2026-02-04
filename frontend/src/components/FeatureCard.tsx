import React from 'react';
import * as LucideIcons from 'lucide-react';
import { FlowchartData } from '@/data/flowcharts';

interface FeatureCardProps {
  data: FlowchartData;
  isActive: boolean;
  onClick: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ data, isActive, onClick }) => {
  const iconName = data.icon as keyof typeof LucideIcons;
  const IconComponent = LucideIcons[iconName] || LucideIcons.Zap;

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-lg border transition-all text-left group ${
        isActive
          ? `bg-gradient-to-br ${data.color} text-white border-current shadow-lg scale-105`
          : 'border-border hover:border-primary/50 hover:shadow-md bg-card'
      }`}
    >
      <div className="flex items-start gap-3">
        <IconComponent 
          size={24} 
          className={`flex-shrink-0 mt-0.5 ${isActive ? 'text-white' : 'text-primary'}`} 
        />
        <div className="min-w-0 flex-1">
          <h3 className={`font-semibold text-sm truncate ${
            isActive ? 'text-white' : 'text-foreground'
          }`}>
            {data.title}
          </h3>
          <p className={`text-xs mt-1 line-clamp-2 ${
            isActive ? 'text-white/90' : 'text-muted-foreground'
          }`}>
            {data.description}
          </p>
        </div>
      </div>
    </button>
  );
};

export default FeatureCard;
