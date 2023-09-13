import { Layout } from "@/components/layout/layout";
import { ReactElement, useEffect } from "react";
import type { NextPageWithLayout } from "./_app";
import React, { useState } from "react";
import { EmotionSummaryModule } from "@/components/modules/emotionSummaryModule";
import { TaskInfoModule } from "@/components/modules/taskInfoModule";
import { NavigationBar } from "@/components/navigationBar/navigationBar";
import { ProjectSelector } from "@/components/ProjectSelector/projectSelector";
import { Project, TrelloCard } from "@prisma/client";
import { getProject, configureProject } from "./api/projects";
import { config } from "dotenv";

export interface ProjectPlus extends Project {
  trelloCards: Task[];
}
export interface Task {
  id: string;
  taskName: string;
}

export type ProjectProps = {
  //TODO: Update this to also contain a list of emojis and a reference number
  projectid: string,
  metrics: { metricId: string; metricName: string; levels: {
    levelLabel: string,
    levelOrder: Number
  }[] }[]
}
// dummy projects for selectors
const weeks = ["Week 1", "Week 2", "Week 3"];

function Page(data: ProjectProps) {
  const [projects, setprojects] = useState<ProjectPlus[] | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState<ProjectPlus>();
  const [summaryTypeSelection, setSummaryTypeSelection] = useState("Overall");

  const [activeTask, setActiveTask] = useState<Task>();
  const [summaryTimeSelector, setSummaryTimeSelector] = useState("Week 1");
  useEffect(() => {
    fetch(`/api/projects`)
      .then((res) => res.json())
      .then((projects) => {
        setprojects(projects.projects as ProjectPlus[]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (projects != null) {
      setActiveProject(projects[0]);
    }
  }, [projects]);

  if (isLoading || !activeProject) return <p>Loading...</p>;
  if (!projects || !activeProject) {
    console.log(projects, activeProject);
    return <p>No profile projects</p>;
  }

  return (
    <div className="page-container">
      <ProjectSelector
        setActiveProject={setActiveProject}
        activeProject={activeProject}
        projects={projects}
      />

      <div className="page-config-container">
        <div className="button-container">
          <button
            className={summaryTypeSelection === "By Task" ? "active" : ""}
            onClick={() => {
              setSummaryTypeSelection("By Task");
              setActiveTask(activeProject.trelloCards[0]);
            }}
          >
            By Task
          </button>
          <button
            className={summaryTypeSelection === "Overall" ? "active" : ""}
            onClick={() => {
              setSummaryTypeSelection("Overall");
              setActiveTask(undefined);
            }}
          >
            Overall
          </button>
        </div>

        {summaryTypeSelection !== "Overall" && (
          <div className="task-selector">
            <NavigationBar
              activeItem={activeTask!.taskName}
              setActiveItem={(taskName) =>
                setActiveTask(
                  activeProject.trelloCards.find(
                    (card) => card.taskName == taskName
                  )!
                )
              }
              selectionItems={activeProject.trelloCards.map(
                (task) => task.taskName
              )}
              labelStyle="label-task"
            />
          </div>
        )}

        <div className="time-selector">
          <NavigationBar
            activeItem={summaryTimeSelector}
            setActiveItem={setSummaryTimeSelector}
            selectionItems={weeks}
            labelStyle="label-week"
          />
        </div>
      </div>
      <div className="flex-container">
        <EmotionSummaryModule project={activeProject} card={activeTask} />
        {activeTask && <TaskInfoModule id={activeTask?.id} />}
      </div>
    </div>
  );
};

// This function retrieves data from the DB and returns an object, which will be used to display info in config landing page
// TODO: update this function to also retrieve the string of emojis and the reference number. 
//The type of emojis is an array of string at the moment. If that doesn't work, feel free to update schema.prisma to reflect the right data type
export async function getServerSideProps() {
  var projectId = '643d2f9487baeec2c1c0c2d1'
  var project = await getProject(projectId)
  var projectData: ProjectProps = {
    projectid: projectId,
    metrics: []
  }
  var metricArray = []
  var metricDictionary: any = {}

  project?.metrics.forEach(metric => metricDictionary[metric.id] = {
    metricName: metric.name,
    levels: []
  })
  project?.levels.forEach(level => {
    metricDictionary[level.metricId].levels.push({
      levelLabel: level.levelLabel,
      levelOrder: level.levelOrder
    })
  })
  for (let key in metricDictionary) {
    metricArray.push({...metricDictionary[key], metricId: key})
  }
  projectData.metrics = metricArray
  return {
    props: projectData
  }
}
// An example of the returned project Data right now (without emojis and reference number)
// var projectData: ProjectProps = {
  //   projectid: '643d2f9487baeec2c1c0c2d1',
  //   metrics: [
  //     {
  //       metricName: 'Complexity',
  //       levels: [
  //         {
  //           levelLabel: "Low",
  //           levelOrder: 1
  //         }, {
  //           levelLabel: "Medium",
  //           levelOrder: 2
  //         }, {
  //           levelLabel: "High",
  //           levelOrder: 3
  //         }
  //       ],
  //       metricId: '64f81eb71be0b30d89e77680'
  //     },
  //     {
  //       metricName: 'Difficulty',
  //       levels: [
  //         {
  //           levelLabel: "Low",
  //           levelOrder: 1
  //         }, {
  //           levelLabel: "Medium",
  //           levelOrder: 2
  //         }
  //       ],
  //       metricId: ''
  //     },
  //     {
  //       metricName: 'Research required',
  //       levels: [
  //         {
  //           levelLabel: "Low",
  //           levelOrder: 1
  //         }, {
  //           levelLabel: "Medium",
  //           levelOrder: 2
  //         }, {
  //           levelLabel: "High",
  //           levelOrder: 3
  //         }
  //       ],
  //       metricId: ''
  //     }
  //   ]
  // }

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
