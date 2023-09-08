import React, { useEffect, useRef,useState} from 'react';
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import style from 'styled-jsx/style';

Chart.register(...registerables);

interface MetricData {
  [emoji: string]: number;
}

interface MetricGraphsProps {
  metric: Record<string, MetricData>;
  metricName: String
  allMetric: Record<string, any>; 
}

function MetricGraphs({ metric, metricName, allMetric }: MetricGraphsProps) {
  const chartContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [metricActualName, setMetricName] = useState();

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

  useEffect(()=>{
    Object.keys(allMetric).forEach((i,index) => {
      console.log(allMetric[i])
      if (metricName == allMetric[i]['id']){
        console.log("yes")
        setMetricName(allMetric[i]['name'])
      }
    })
  },[])

  useEffect(() => {
    // Calculate the maximum value across all graphs
    let maxMetricValue = 0;
    Object.keys(metric).forEach((emoji) => {
      const levels = Object.keys(metric[emoji]);
      const maxLevelValue = Math.max(...levels.map((level) => metric[emoji][level]));
      maxMetricValue = Math.max(maxMetricValue, maxLevelValue);
    });

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
        indexAxis: 'y' as const,
        scales: {
          x: {
            display: false,
            min: 0,  // Set the minimum value for the y-axis
            max: 5, 
            beginAtZero: true,
          },
          y: {
            min: 0,  // Set the minimum value for the y-axis
            max: 5,  // Set the maximum value for the y-axis
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
          annotation: {  // Add annotation for reference line
            annotations: [
              {
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y',
                value: 2,  // Set the reference value
                borderColor: 'red',  // Color of the reference line
                borderWidth: 2,  // Width of the reference line
              },
            ],
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
    <div style={{ overflow: 'hidden', border: '0px solid black', padding: '10px', height: '150px', width: 'fit-content' }}>
      <div style={{ display: 'flex', overflowX: 'auto' }}>
        {/* New column for card names */}
        <div style={{ display: 'flex', flexDirection: 'column', marginRight: '10px', minWidth: '100px', paddingRight: "20px", marginTop: '10px' }}>
          <h2> {metricActualName}</h2>
        </div>
        {/* New column for level labels */}
        <div style={{ display: 'flex', flexDirection: 'column', marginRight: '10px' }}>
          {[1, 2, 3].map((level) => (
            <div key={level} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '28px' }}>
              <p style={{ margin: '0' }}>{`Level ${level}`}</p>
            </div>
          ))}
        </div>
        {/* Graph containers */}
        {Object.keys(metric).map((emoji) => (
          <div key={emoji} style={{ marginBottom: '20px', margin: '0 10px', paddingRight: '10px' }}>
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
