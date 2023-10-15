import { Layout } from "@/components/layout/layout";
import { ReactElement, useEffect } from "react";
import type { NextPageWithLayout } from "./_app";
import React, { useState } from "react";
import { EmotionSummaryModule } from "@/components/modules/emotionSummaryModule";
import { TaskInfoModule } from "@/components/modules/taskInfoModule";
import { ProjectSelector } from "@/components/ProjectSelector/projectSelector";
import { Level, Metric, Project, Rating } from "@prisma/client";
import "react-datepicker/dist/react-datepicker.css";
import DateRangeSelector from "@/components/datePicker";
import { MetricGraphModule } from "@/components/modules/metricGraphModule";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import SettingsIcon from "@mui/icons-material/Settings";
import HamsterLoader from "@/components/hamsterLoader";
import AIPopup from "@/components/AIPopUp";
import Search from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import ButtonGroup from "@mui/material/ButtonGroup";
import ListSubheader from "@mui/material/ListSubheader";

export interface ProjectPlus extends Project {
  trelloCards: Task[];
  metrics: {
    id: string;
    name: string;
    active: boolean;
    projectId: string;
    levels: Level[];
  }[];
}
export interface Task {
  id: string;
  taskName: string;
}

export type Ratings = (Rating & { metric: Metric & { levels: Level[] } })[];

const Page: NextPageWithLayout = () => {
  const [projects, setprojects] = useState<ProjectPlus[] | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isRatingsLoading, setRatingsLoading] = useState(true);
  const [activeProject, setActiveProject] = useState<ProjectPlus>();
  const [availableEmojis, setAvailableEmojis] = useState<string[]>([]);
  const [summaryTypeSelection, setSummaryTypeSelection] = useState("Overall");
  const [activeTask, setActiveTask] = useState<Task>();
  const [ratings, setRatings] = useState<Ratings>();
  const [showPopup, setShowPopup] = useState(false);

  const handleAIButtonClick = () => {
    setShowPopup(true);
  };

  const closePopUp = () => {
    setShowPopup(false);
  };

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
  };

  useEffect(() => {
    if (activeProject) {
      setRatingsLoading(true);
      const projectId = activeProject.id;
      const cardId = activeTask?.id;
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
      setAvailableEmojis(projects[0].emojis);
    }
  }, [projects]);

  if (isLoading || !activeProject)
    return (
      <div className="page-container background">
        <Typography variant="body1">Loading...</Typography>
      </div>
    );
  if (!projects || !activeProject) {
    return (
      <div className="page-container background">
        <Typography variant="body1">No profile projects</Typography>
      </div>
    );
  }

  return (
    <div className="page-container background">
      <div className="settings-button-container">
        <Link href={`/config?data=${activeProject.id}`}>
          <SettingsIcon
            data-testid="configButton"
            fontSize="large"
            color="primary"
          />
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
            data-testid="byTaskButton"
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
            data-testid="overallButton"
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
        <DateRangeSelector onSelectDateRange={handleDateRangeSelect} />
        {summaryTypeSelection !== "Overall" && (
          <>
            {
              //Select component with searchable input inspired by this codesandbox codehttps://codesandbox.io/s/react-mui-searchable-select-nm3vw?file=/src/App.js:777-807
            }
            <Select
              value={activeTask?.id}
              data-testid="taskSelector"
              label={"Task"}
              variant="filled"
              onChange={(event) => {
                const taskId = event.target.value;
                setActiveTask(
                  activeProject.trelloCards.find((card) => card.id == taskId)!
                );
              }}
              style={{ padding: "12px", width: "400px", marginLeft: "10px" }}
              fullWidth={true}
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
            {activeTask && (
              <button className="AIButton" onClick={handleAIButtonClick}>
                {" "}
                AI
              </button>
            )}
          </>
        )}
      </div>
      {!isRatingsLoading && ratings && (
        <div>
          <div className="flex-container">
            <EmotionSummaryModule
              ratings={ratings}
              isLoading={isRatingsLoading}
              availableEmojis={availableEmojis}
            />
            {activeTask && <TaskInfoModule id={activeTask?.id} />}
          </div>
          <MetricGraphModule
            ratings={ratings}
            activeMetrics={activeProject.metrics}
            isLoading={isRatingsLoading}
            availableEmojis={availableEmojis}
          />
        </div>
      )}
      {showPopup && ratings && (
        <AIPopup
          ratings={ratings}
          taskName={activeTask?.taskName!}
          onClose={closePopUp}
        />
      )}
    </div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
