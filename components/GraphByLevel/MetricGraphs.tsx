import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import style from 'styled-jsx/style';
Chart.register(...registerables);

interface MetricData {
  [emoji: string]: number;
}

interface MetricGraphsProps {
  metric: Record<string, MetricData>;
}

function MetricGraphs({ metric }: MetricGraphsProps) {
  const chartContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Function to generate random background colors for each graph
  const getBackgroundColor = (): string[] => {
    const color: string[] = [];
    for (let i = 0; i < 3; i++) {
      color.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`);
    }
    return color;
  };

  // Function to generate random border colors for each graph
  const getBorderColor = (): string[] => {
    const color: string[] = [];
    for (let i = 0; i < 3; i++) {
      color.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`);
    }
    return color;
  };

  useEffect(() => {
    // Clear the existing chart containers
    Object.keys(chartContainerRefs.current).forEach((emoji) => {
      const chartContainer = chartContainerRefs.current[emoji];
      if (chartContainer) {
        chartContainer.innerHTML = '';
      }
    });

    // Create new chart instances
    Object.keys(metric).forEach((emoji) => {
      const levels = Object.keys(metric[emoji]);
      const data = {
        labels: levels.map((level) => ''),
        datasets: [
          {
            label: emoji,
            data: levels.map((level) => metric[emoji][level]),
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: 1,
          },
        ],
      };

      const options = {
        indexAxis: 'y' as const, // Set indexAxis to "y"
        scales: {
          x: {
            display: false,
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false, // Hide the legend
          },
          tooltip: {
            callbacks: {
              title: () => '', // Disable tooltip title
            },
          },
        },
      };

      const chartContainer = chartContainerRefs.current[emoji];
      if (chartContainer) {
        const canvas = document.createElement('canvas');
        chartContainer.appendChild(canvas);

        new Chart(canvas, {
          type: 'bar',
          data: data,
          options: options,
        });
      }
    });
  }, [metric]);

  return (
    <div style={{ overflow: 'hidden', border: '0px solid black', padding: '10px', height: '150px', width: "fit-content" }}>
      <div style={{ display: 'flex', overflowX: 'auto' }}>
        {Object.keys(metric).map((emoji) => (
          <div key={emoji} style={{ marginBottom: '20px', margin: '0 10px', paddingRight: '10px' }}>
            <h3>Emoji:</h3>
            <div ref={(ref) => (chartContainerRefs.current[emoji] = ref)} style={{ height: '250px', width: '180px' }}></div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
              <p style={{ margin: '0' }}>Level</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MetricGraphs;
