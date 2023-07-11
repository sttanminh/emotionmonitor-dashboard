import { Layout } from '@/components/layout/layout';
import { ReactElement} from 'react';
import type { NextPageWithLayout } from './_app';
import React, {useState} from 'react';
import {GraphData} from '@/components/graph/horizontalBarGraph';
import { EmotionSummaryModule } from '@/components/modules/emotionSummaryModule';
import { TaskInfoModule } from '@/components/modules/taskInfoModule';
import { NavigationBar } from '@/components/navigationBar/navigationBar';
import { ProjectSelector } from '@/components/ProjectSelector/projectSelector';


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

  

  // const [segmentSelected, setSegmentSelected] = useState(1);

  // const selectSegment = (segment: number) => setSegmentSelected(segment)

  return (
    <div className="page-container">
      <ProjectSelector setActiveProject={setActiveProject} activeProject={{name: activeProject, id: activeProject}} projects={[{name: "Project 1", id: "project1"}, {name: "Project 2", id: "project2"}, {name: "Project 3", id: "project3"}]}/>

      <div className="page-config-container">
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
          <div className="task-selector">
            <NavigationBar activeItem={activeTaskLabel} setActiveItem={setActiveTaskLabel} selectionItems={tasks} labelStyle="label-task"/>
          </div>
        )}

        <div className="time-selector">
          <NavigationBar activeItem={summaryTimeSelector} setActiveItem={setSummaryTimeSelector} selectionItems={weeks} labelStyle="label-week"/>
        </div>
      </div>
      <div className="flex-container">
          <EmotionSummaryModule data={summaryTypeSelection === "Overall" ? data.Overall : data[activeTaskLabel]} />
          <TaskInfoModule data={{taskID: 12345, taskName: activeTaskLabel}} />
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
