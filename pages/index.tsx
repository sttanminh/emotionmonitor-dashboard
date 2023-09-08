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
import { css } from "@emotion/react"; // Import css from react-spinners
import { ClipLoader } from "react-spinners"; // Import the ClipLoader component



export interface ProjectPlus extends Project {
  trelloCards: Task[];
}
export interface Task {
  id: string;
  taskName: string;
}
const availableEmojis = ["😔", "😢", "😐", "😊", "😀", "🤔"];

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
  const [ratings, setRatings] = useState([]);
  const [metricGraphData, setMetricGraphData] = useState({metric});

  const [allMetrics, setAllMetrics] = useState<any[]>([]); // Define a state variable to store all metrics

  // Add a new useEffect block to fetch all metrics
  useEffect(() => {
    fetch(`/api/metrics`) // Assuming this is the endpoint to fetch all metrics
      .then((response) => response.json())
      .then((data) => {
        setAllMetrics(data); // Set the fetched metrics in the state variable
        console.log(data)
      })
      .catch((error) => {
        console.error("Error fetching all metrics:", error);
      });
  }, []); 

  useEffect(() => {
    if (activeProject) {
     let projectId = activeProject.id
     let trelloCards = activeProject.trelloCards
     console.log(trelloCards)
     console.log(projectId) 
      fetch(`/api/ratings?getRatingsByProject=${projectId}`)
        .then((response) => response.json())
        .then((data) => {
          setRatings(data.ratings);
          console.log(ratings)
          
          // Initialize an empty object to store the aggregated metric
        const metric: Record<
        string,
        Record<string, Record<string, number>>
      > = {};

      // Loop through the ratings and aggregate the values and count
      ratings.forEach((rating) => {
        const { metricId, emoScore, level } = rating;
        if (!metric[metricId]) {
          metric[metricId] = {};
        }
        if (!metric[metricId][`emo${emoScore + 1}`]) {
          metric[metricId][`emo${emoScore + 1}`] = {};
        }
        metric[metricId][`emo${emoScore + 1}`][`level${level + 1}`] =
          (metric[metricId][`emo${emoScore + 1}`][`level${level + 1}`] || 0) + 1;
      });

      // Fill in missing levels and emojis with 0
      for (const metricId in metric) {
        for (let emoScore = 0; emoScore < 6; emoScore++) {
          if (!metric[metricId][`emo${emoScore + 1}`]) {
            metric[metricId][`emo${emoScore + 1}`] = {};
          }
          for (let level = 1; level <= 3; level++) {
            if (!metric[metricId][`emo${emoScore + 1}`][`level${level}`]) {
              metric[metricId][`emo${emoScore + 1}`][`level${level}`] = 0;
            }
          }
        }
      }

      console.log(metric);
        
          
          setMetricGraphData(metric);
}
        )
        .catch((error) => {
          console.error("Error fetching ratings:", error);
        });
    }
  }, [activeProject]);






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
      {Object.keys(metricGraphData).map((cardName) => (
        <MetricGraphs key={cardName} metricName={cardName} metric={metricGraphData[cardName]} allMetric={allMetrics} />
      ))}
    </div>
      {/* Emoji indicators */}
      <div className="emoji-indicators" style={{ marginLeft:'190px',marginTop: '-50px',display: 'flex', background: 'transparent', padding: '5px 0' }}>
        {Object.keys(availableEmojis).map((emoji,i) => (
          <div key={emoji} className="emoji-indicator" style={{ marginLeft: '13px',flex: '1', textAlign: 'center',maxWidth: '200px' }}>
            {availableEmojis[i]}
          </div>
        ))}
      </div>
  </div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
