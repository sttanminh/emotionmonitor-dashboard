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
    <div className="page-container">
      <div className="select-container">
        <select
          value={activeProject}
          onChange={(e) => setActiveProject(e.target.value)}
        >
          <option value="Option 1">Project 1</option>
          <option value="Option 2">Project 2</option>
        </select>
      </div>

        <div className="selections-container">
    <div className="button-container">
      <button
        className={summaryTypeSelection === "By Task" ? "active" : ""}
        onClick={() => setSummaryTypeSelection("By Task")}
      >
        By Task
      </button>
      <button
        className={summaryTypeSelection === "Overall" ? "active" : ""}
        onClick={() => setSummaryTypeSelection("Overall")}
      >
        Overall
      </button>
    </div>

    {summaryTypeSelection !== "Overall" && (
      <div className="label-container">
        <button
          className="arrow-button"
          onClick={() => navigateOptions(-1, tasks, activeTaskLabel, setActiveTaskLabel)}
        >←</button>
        <div className="label-task">{activeTaskLabel}</div>
        <button
          className="arrow-button"
          onClick={() => navigateOptions(1, tasks, activeTaskLabel, setActiveTaskLabel)}
        >→</button>
      </div>
    )}

    <div className="label-container-2">
      <button
        className="arrow-button"
        onClick={() => navigateOptions(-1, weeks, summaryTimeSelector, setSummaryTimeSelector)}
      >←</button>
      <div className="label-week">{summaryTimeSelector}</div>
      <button
        className="arrow-button"
        onClick={() => navigateOptions(1, weeks, summaryTimeSelector, setSummaryTimeSelector)}
      >→</button>
    </div>
  </div>
      <div className="flex-container">
        <div className="graph-container">
          <HorizontalBarGraph data={summaryTypeSelection === "Overall" ? data.Overall : data[activeTaskLabel]} />
        </div>
        <div className="task-info-container">
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
