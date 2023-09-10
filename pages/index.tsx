import { Layout } from "@/components/layout/layout";
import { ReactElement, useEffect } from "react";
import type { NextPageWithLayout } from "./_app";
import React, { useState } from "react";
import { EmotionSummaryModule } from "@/components/modules/emotionSummaryModule";
import { TaskInfoModule } from "@/components/modules/taskInfoModule";
import { NavigationBar } from "@/components/navigationBar/navigationBar";
import { ProjectSelector } from "@/components/ProjectSelector/projectSelector";
import { Metric, Project } from "@prisma/client";
import "react-datepicker/dist/react-datepicker.css";
import DateRangeSelector from "@/components/datePicker";
import { MetricGraphModule } from "@/components/modules/metricGraphModule";

export interface ProjectPlus extends Project {
  trelloCards: Task[];
}
export interface Task {
  id: string;
  taskName: string;
}

export interface Rating {
  id: string;
  emoScore: number;
  level: number;
  metric: {
    name: string;
    levels: { levelLabel: string; levelOrder: number }[];
  };
}

export const availableEmojis = ["😔", "😢", "😐", "😊", "😀", "🤔"];

const Page: NextPageWithLayout = () => {
  const [projects, setprojects] = useState<ProjectPlus[] | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isRatingsLoading, setRatingsLoading] = useState(true);
  const [activeProject, setActiveProject] = useState<ProjectPlus>();
  const [summaryTypeSelection, setSummaryTypeSelection] = useState("Overall");
  const [activeTask, setActiveTask] = useState<Task>();
  const [ratings, setRatings] = useState<Rating[]>();

  // Default start date to 1 week ago
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Default end date to today
  const today = new Date();

  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    oneWeekAgo
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(today);

  const handleDateRangeSelect = (startDate: Date, endDate: Date) => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
    console.log(selectedStartDate, selectedEndDate);
  };

  useEffect(() => {
    if (activeProject) {
      setRatingsLoading(true);
      const projectId = activeProject.id;
      const cardId = activeTask?.id;
      console.log("fetching ratings with cardId", cardId);
      fetch(
        `/api/ratings?projectId=${projectId}&startDate=${selectedStartDate}&endDate=${selectedEndDate}${
          cardId ? "&cardId=" + cardId : ""
        }`
      )
        .then((res) => res.json())
        .then((data) => setRatings(data.ratings))
        .catch((error) => {
          console.error("Error fetching ratings:", error);
        });
      setRatingsLoading(false);
    }
  }, [activeProject, activeTask, selectedStartDate, selectedEndDate]);

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
        <DateRangeSelector onSelectDateRange={handleDateRangeSelect} />
      </div>
      {!isRatingsLoading && ratings && (
        <div>
          <div className="flex-container">
            <EmotionSummaryModule
              ratings={ratings}
              isLoading={isRatingsLoading}
            />
            {activeTask && <TaskInfoModule id={activeTask?.id} />}
          </div>
          <MetricGraphModule ratings={ratings} isLoading={isRatingsLoading} />
        </div>
      )}
    </div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
