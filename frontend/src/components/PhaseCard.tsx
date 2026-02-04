import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PhaseCardProps {
  phase: {
    title: string;
    description: string;
    features: string[];
    color: string;
    icon: string;
  };
  isActive: boolean;
  onClick: () => void;
}

export const PhaseCard: React.FC<PhaseCardProps> = ({ phase, isActive, onClick }) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isActive ? 'ring-2 ring-primary shadow-lg scale-105' : ''
      }`}
      onClick={onClick}
    >
      <div className={`p-6 bg-gradient-to-br ${phase.color} rounded-t-lg`}>
        <div className="flex items-center gap-3">
          <div className="text-2xl">{phase.icon}</div>
          <div>
            <h3 className="text-white font-bold text-lg">{phase.title}</h3>
            <p className="text-white/90 text-sm">{phase.description}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex flex-wrap gap-2">
          {phase.features.map((feature, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PhaseCard;
