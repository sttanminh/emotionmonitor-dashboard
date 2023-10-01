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
import Button from "@mui/material/Button";
import Link from 'next/link';
import SettingsIcon from '@mui/icons-material/Settings'; 
import { Typography } from "@mui/material";
import {
  ButtonGroup,
  InputAdornment,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Search } from "@mui/icons-material";

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

  const [taskSearchText, settaskSearchText] = useState("");

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
    <div className="page-container background">
       <div className="settings-button-container">
        <Link href="/config">
          <SettingsIcon fontSize="large" color="primary" />
        </Link>
      </div>
      <ProjectSelector
        setActiveProject={setActiveProject}
        activeProject={activeProject}
        projects={projects}
      />
      <div className="page-config-container">
        <ButtonGroup variant="contained">
          <Button
            onClick={() => {
              setSummaryTypeSelection("By Task");
              setActiveTask(activeProject.trelloCards[0]);
            }}
            area-disabled={summaryTypeSelection === "By Task"}
            variant={
              (summaryTypeSelection === "By Task" ? "contained" : undefined) ||
              "outlined"
            }
            className="custom-button" 
          >
            By Task
          </Button>
          <Button
            onClick={() => {
              setSummaryTypeSelection("Overall");
              setActiveTask(undefined);
            }}
            area-disabled={summaryTypeSelection === "Overall"}
            variant={
              (summaryTypeSelection === "Overall" ? "contained" : undefined) ||
              "outlined"
            }
            className="custom-button" 
          >
            Overall
          </Button>
        </ButtonGroup>

        {summaryTypeSelection !== "Overall" && (
          <div className="task-selector">
            {
              //Select component with searchable input inspired by this codesandbox codehttps://codesandbox.io/s/react-mui-searchable-select-nm3vw?file=/src/App.js:777-807
            }
            <Select
              value={activeTask?.id}
              label={"Task"}
              onChange={(event) => {
                console.log("active task", activeTask);
                const taskId = event.target.value;
                setActiveTask(
                  activeProject.trelloCards.find((card) => card.id == taskId)!
                );
              }}
              // Disables auto focus on MenuItems and allows TextField to be in focus
              MenuProps={{ autoFocus: false }}
              id="task-search-select"
              onClose={() => settaskSearchText("")}
              // This prevents rendering empty string in Select's value
              // if search text would exclude currently selected option.
              renderValue={() => activeTask?.taskName}
            >
              <ListSubheader>
                <TextField
                  size="small"
                  // Autofocus on textfield
                  autoFocus
                  placeholder="Type to search..."
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => settaskSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== "Escape") {
                      // Prevents autoselecting item while typing (default Select behaviour)
                      e.stopPropagation();
                    }
                  }}
                />
              </ListSubheader>
              {activeProject.trelloCards
                .filter((card) =>
                  card.taskName.toLowerCase().includes(taskSearchText)
                )
                .map((card) => (
                  <MenuItem value={card.id}>{card.taskName}</MenuItem>
                ))}
            </Select>
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
