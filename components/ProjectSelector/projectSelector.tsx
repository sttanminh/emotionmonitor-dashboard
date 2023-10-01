import { ProjectPlus } from "@/pages";
import { Search } from "@mui/icons-material";
import {
  InputAdornment,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { FC, useState } from "react";

type Project = { name: string; id: string };
interface Props {
  activeProject: ProjectPlus;
  setActiveProject: (
    value: React.SetStateAction<ProjectPlus | undefined>
  ) => void;
  projects: ProjectPlus[];
}

// This is the Layout that will wrapp all of our pages
export const ProjectSelector: FC<Props> = ({
  activeProject,
  setActiveProject,
  projects,
}) => {
  const [projectSearchText, setProjectSearchText] = useState("");

  return (
    <div className="select-container">
      <Select
        className="select-container"
        MenuProps={{
          autoFocus: false,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        }}
        value={activeProject?.id}
        label={"Project"}
        variant="filled"
        onChange={(event) => {
          const projectId = event.target.value;
          setActiveProject(
            projects.find((project) => project.id == projectId)!
          );
        }}
        id="project-search-select"
        onClose={() => setProjectSearchText("")}
        // This prevents rendering empty string in Select's value
        // if search text would exclude currently selected option.
        renderValue={() => activeProject!.name}
      >
        {/* TextField is put into ListSubheader so that it doesn't
              act as a selectable item in the menu
              i.e. we can click the TextField without triggering any selection.*/}
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
          onChange={(e) => setProjectSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Escape") {
              // Prevents autoselecting item while typing (default Select behaviour)
              e.stopPropagation();
            }
          }}
        />
        {projects
          .filter((project) =>
            project.name.toLowerCase().includes(projectSearchText)
          )
          .map((project) => (
            <MenuItem value={project.id}>{project.name}</MenuItem>
          ))}
      </Select>
    </div>
  );
};
