import { Layout } from "@/components/layout/layout";
import { ReactElement, useEffect } from "react";
import type { NextPageWithLayout } from "./_app";
import React, { useState } from "react";
import { EmotionSummaryModule } from "@/components/modules/emotionSummaryModule";
import { TaskInfoModule } from "@/components/modules/taskInfoModule";
import { NavigationBar } from "@/components/navigationBar/navigationBar";
import { ProjectSelector } from "@/components/ProjectSelector/projectSelector";
import { Project, TrelloCard } from "@prisma/client";
import MetricGraphs from '@/components/GraphByLevel/MetricGraphs';



export interface ProjectPlus extends Project {
  trelloCards: Task[];
}
export interface Task {
  id: string;
  taskName: string;
}


//dummy data for metricsGraphp
const metric = {
  emo1: {
    level1: 10,
    level2: 20,
    level3: 15,
  },
  emo2: {
    level1: 10,
    level2: 20,
    level3: 15,
  },
  emo3: {
    level1: 10,
    level2: 20,
    level3: 15,
  },
  emo4: {
    level1: 10,
    level2: 20,
    level3: 15,
  },
  emo5: {
    level1: 10,
    level2: 20,
    level3: 15,
  },
  emo6: {
    level1: 10,
    level2: 2,
    level3: 15,
  },
};
// dummy data for selectors
const tasks = ["Task 1", "Task 2", "Task 3"];
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
      <div className="metricGraph">
        <MetricGraphs metric={metric} />
        <MetricGraphs metric={metric} />
        <MetricGraphs metric={metric} />
      </div>
  </div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
