import React, { FC } from "react";

type Project = {name: string, id: string}
interface Props {
  activeProject: Project
  setActiveProject: (value: React.SetStateAction<string>) => void
  projects: Project[]
}

// This is the Layout that will wrapp all of our pages
export const ProjectSelector: FC<Props> = ({activeProject, setActiveProject, projects}) => {
  return (
    <div className="select-container">
        <select
          value={activeProject.name}
          onChange={(e) => setActiveProject(e.target.value)}
        >
          {projects.map(project => <option value={project.name}>{project.name}</option>)}
        </select>
      </div>
  );
};



