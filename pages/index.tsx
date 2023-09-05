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
  projectid: string,
  metrics: { metricId: string; metricName: string; levels: {
    levelLabel: string,
    levelOrder: Number
  }[] }[]
}
// dummy projects for selectors
const weeks = ["Week 1", "Week 2", "Week 3"];

const Page: NextPageWithLayout = () => {
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

export async function getServerSideProps() {
  var projectId = '643d2f9487baeec2c1c0c2d1'
  var projectData: ProjectProps = {
    projectid: '643d2f9487baeec2c1c0c2d1',
    metrics: [
      {
        metricName: 'Complexity',
        levels: [
          {
            levelLabel: "Low",
            levelOrder: 1
          }, {
            levelLabel: "Medium",
            levelOrder: 2
          }, {
            levelLabel: "High",
            levelOrder: 3
          }
        ],
        metricId: '64f6c424d4c684fa3223598d'
      },
      {
        metricName: 'Teamwork',
        levels: [
          {
            levelLabel: "Low",
            levelOrder: 1
          }, {
            levelLabel: "Medium",
            levelOrder: 2
          }, {
            levelLabel: "High",
            levelOrder: 3
          }
        ],
        metricId: ''
      },
      {
        metricName: 'Difficulty',
        levels: [
          {
            levelLabel: "Low",
            levelOrder: 1
          }, {
            levelLabel: "Medium",
            levelOrder: 2
          }, {
            levelLabel: "High",
            levelOrder: 3
          }
        ],
        metricId: ''
      }
    ]
  }
  await configureProject(projectData)
  console.log('Done')
  // var project = await getProject(projectId)
  // var projectData: ProjectProps = {
  //   projectid: projectId,
  //   metrics: []
  // }
  // var metricArray = []
  // var metricsObject: {
  //   [metricId: string]: {
  //     metricName: string,
  //     levels: {}[]
  //   }
  // } = {}

  // project?.metrics.forEach(metric => metricsObject[metric.id] = {
  //   metricName: metric.name,
  //   levels: []
  // })
  // project?.levels.forEach(level => {
  //   metricsObject[level.metricId].levels.push({
  //     levelLabel: level.levelLabel,
  //     levelOrder: level.levelOrder
  //   })
  // })
  // for (let key in metricsObject) {
  //   metricArray.push({...metricsObject[key], metricId: key})
  // }
  // projectData.metrics = metricArray
  return {
    props: {
      // data: projectData
    }
  }
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
