import { Layout } from '@/components/layout';
import { ReactElement, Suspense } from 'react';
import type { NextPageWithLayout } from './_app';
import React, {useState} from 'react';
import {HorizontalBarGraph, GraphData} from '@/components/horizontalBarGraph';


// using this home made mod function because % doesn't play well with negatives
function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

// dummy data for selectors
const tasks = ["Task 1", "Task 2", "Task 3"];
const weeks = ["Week 1", "Week 2", "Week 3"];

// dummy data for graphs
const data: {[key in string]: GraphData[]} = {
  "Task 1": [
    {
      emotionName: "anxious",
      emotionAv: 20
    },
    {
      emotionName: "angry",
      emotionAv: 9
    }, 
    {
      emotionName: "neutral",
      emotionAv: 2
    },
    {
      emotionName: "happy",
      emotionAv: 13
    },
    {
      emotionName: "excited",
      emotionAv: 1
    },
  ],
  "Task 2": [
    {
      emotionName: "anxious",
      emotionAv: 2
    },
    {
      emotionName: "angry",
      emotionAv: 5
    }, 
    {
      emotionName: "neutral",
      emotionAv: 7
    },
    {
      emotionName: "happy",
      emotionAv: 20
    },
    {
      emotionName: "excited",
      emotionAv: 19
    },
  ],
  "Task 3": [
    {
      emotionName: "anxious",
      emotionAv: 10
    },
    {
      emotionName: "angry",
      emotionAv: 11
    }, 
    {
      emotionName: "neutral",
      emotionAv: 12
    },
    {
      emotionName: "happy",
      emotionAv: 9
    },
    {
      emotionName: "excited",
      emotionAv: 10
    },
  ],
  "Overall": [
    {
      emotionName: "anxious",
      emotionAv: 23
    },
    {
      emotionName: "angry",
      emotionAv: 40
    }, 
    {
      emotionName: "neutral",
      emotionAv: 23
    },
    {
      emotionName: "happy",
      emotionAv: 19
    },
    {
      emotionName: "excited",
      emotionAv: 30
    },
  ]
}

const Page: NextPageWithLayout = () => {
  const [activeProject, setActiveProject] = useState("Project 1");
  const [summaryTypeSelection, setSummaryTypeSelection] = useState("By Task");

  const [activeTaskLabel, setActiveTaskLabel] = useState<string>("Task 1");
  const [summaryTimeSelector, setSummaryTimeSelector] = useState("Week 1");

  const navigateOptions = (direction: 1 | -1, options: string[], current: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const currentIndex = options.indexOf(current);
    const nextItem = options[mod((currentIndex + direction), options.length)];
    setter(nextItem);
  };

  // const [segmentSelected, setSegmentSelected] = useState(1);

  // const selectSegment = (segment: number) => setSegmentSelected(segment)

  return (
    
    <div style={{marginLeft: "90px", marginTop: "10px"}}>


      <div style={{ marginBottom: "20px", width: "100%"}}>
        <select value={activeProject} onChange={(e) => setActiveProject(e.target.value)}
        style={{ 
          width: "97%", 
          height: "50px", 
          appearance: "none", 
          borderRadius: "10px",
          borderColor: "black",
          paddingLeft: "0.5rem",
          paddingRight: "1.5rem",
          backgroundColor: "rgb(174, 173, 173)",
          fontSize: '23px',
          backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="black" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 8l5 5 5-5H5z"/></svg>')`,
          backgroundPosition: 'right 10px center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '24px',
        }}
        >
          <option value="Option 1">Project 1</option>
          <option value="Option 2">Project 2</option>
        </select>
      </div>

      <div style={{ marginBottom: "0px", border: "1px solid black", borderRadius: "8px", display: "flex", width: "18%", height: "27px", overflow: "hidden", background: "rgb(174, 173, 173)" }}>
        <button 
          style={{ flex: "1", padding: "10px", backgroundColor: summaryTypeSelection === "By Task" ?  "rgb(153, 204, 255)" : "transparent" , border: "none", color: "white" }}
          onClick={() => setSummaryTypeSelection("By Task")}
        >
          By Task
        </button>
        <button 
          style={{ flex: "1", padding: "10px", backgroundColor: summaryTypeSelection === "Overall" ? "rgb(153, 204, 255)" : "transparent", border: "none", color: "white" }}
          onClick={() => setSummaryTypeSelection("Overall")}
        >
          Overall
        </button>
      </div>


      {summaryTypeSelection !== "Overall" && <div style={{ display: "flex", alignItems: "center", padding: "10px", marginLeft: "250px", marginTop: "-40px" }}>
          <button style={{border: "none", backgroundColor: "transparent"}} onClick={() => navigateOptions(-1, tasks, activeTaskLabel, setActiveTaskLabel)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left" viewBox="0 0 16 16">
          <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z"/>
          </svg>  
          </button>
          <div style={{borderRadius: "5px", border: "1px solid black", padding: "5px", width: "70%", textAlign: "center", background: "rgb(233, 233, 233)"}}>{activeTaskLabel}</div>
          <button style={{border: "none", backgroundColor: "transparent"}} onClick={() => navigateOptions(1, tasks, activeTaskLabel, setActiveTaskLabel)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right" viewBox="0 0 16 16">
  <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
</svg>
          </button>
        </div>}
        <div style={{ display: "flex", alignItems: "center", padding: "10px", marginLeft: "1130px", marginTop: "-51px"}}>
          <button style={{border: "none", backgroundColor: "transparent"}} onClick={() => navigateOptions(-1, weeks, summaryTimeSelector, setSummaryTimeSelector)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-left" viewBox="0 0 16 16">
          <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z"/>
          </svg>  
          </button>
          <div style={{borderRadius: "5px", border: "1px solid black", padding: "5px", width: "50%", textAlign: "center", background: "rgb(233, 233, 233)"}}>{summaryTimeSelector}</div>
          <button style={{border: "none", backgroundColor: "transparent"}} onClick={() => navigateOptions(1, weeks, summaryTimeSelector, setSummaryTimeSelector)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right" viewBox="0 0 16 16">
  <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
</svg>
          </button>
        </div>
      
    <div style={{ display: 'flex', marginTop: '20px'}}>
      <div style={{ flex: '0 0 43%', marginRight: '20px', height: '300px', borderRadius: '10px', background: 'white', padding: '20px' }}>
        {/* Commenting this out to reduce scope for now (also feel like it is possible to use a premade component for this) and because the state management is all inconsistent
        <div style={{ marginBottom: "0px", border: "1px solid black", borderRadius: "8px", display: "flex", width: "40%", height: "27px", overflow: "hidden", background: "rgb(174, 173, 173)", marginLeft: '360px', marginTop: '5px' }}>
            <button onClick={() => selectSegment(1)} style={{ flex: '1', backgroundColor: segmentSelected === 1 ? "rgb(153, 204, 255)" : "transparent" , border: "none", color: "white"  }}>Negative</button>
            <button onClick={() => selectSegment(2)} style={{ flex: '1', backgroundColor: segmentSelected === 2 ? "rgb(153, 204, 255)" : "transparent" , border: "none", color: "white"  }}>Positive</button>
            <button onClick={() => selectSegment(3)} style={{ flex: '1', backgroundColor: segmentSelected === 3 ? "rgb(153, 204, 255)" : "transparent" , border: "none", color: "white"  }}>All</button>
          </div> */}
          <HorizontalBarGraph data={summaryTypeSelection === "Overall" ? data.Overall : data[activeTaskLabel]}/>
      </div>
      <div style={{ flex: '0 0 43%', marginLeft: '10px', marginRight: '10px', height: '300px', borderRadius: '10px', background: 'white', padding: '20px' }}>
        <h2>{activeTaskLabel}</h2>
        <p>{`${activeTaskLabel} summary!`}</p>
      </div>
    </div>

</div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>{page}</Layout>
  );
};

export default Page;
