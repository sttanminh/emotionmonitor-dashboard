import { ProjectPlus } from "@/pages";
import React, { FC } from "react";

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
  return (
    <div className="select-container">
      <select
        value={activeProject.name}
        onChange={(e) =>
          setActiveProject(
            projects.find((project) => project.id === e.target.value)!
          )
        }
      >
        {projects.map((project) => (
          <option value={project.id}>{project.name}</option>
        ))}
      </select>
    </div>
  );
};
