import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  code: string;
  isDark?: boolean;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ code, isDark = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mermaidId = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (!containerRef.current || !code) return;

    const renderDiagram = async () => {
      try {
        mermaid.initialize({
          startOnLoad: true,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: 'Inter, system-ui, sans-serif',
          flowchart: {
            padding: 20,
            useMaxWidth: true,
            htmlLabels: true,
          },
          themeVariables: {
            primaryColor: isDark ? '#475569' : '#f8fafc',
            primaryTextColor: isDark ? '#f8fafc' : '#1e293b',
            primaryBorderColor: isDark ? '#64748b' : '#334155',
            lineColor: isDark ? '#64748b' : '#475569',
            secondaryColor: isDark ? '#334155' : '#e2e8f0',
            tertiaryColor: isDark ? '#1e293b' : '#f1f5f9',
          }
        });

        const element = document.createElement('div');
        element.id = mermaidId.current;
        element.className = 'mermaid';
        element.textContent = code;

        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(element);
          
          await mermaid.contentLoaded();
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="text-red-500 p-4 text-center">Error rendering diagram: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
        }
      }
    };

    renderDiagram();
  }, [code, isDark]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-auto rounded-lg bg-card border border-border p-6 min-h-[400px] flex justify-center items-center"
      style={{ 
        background: isDark ? 'rgb(2 8 23)' : 'rgb(248 250 252)',
      }}
    />
  );
};

export default MermaidDiagram;
