import { FC } from "react";
import { HorizontalBarGraph } from "../graph/horizontalBarGraph";
import { Project } from "@prisma/client";
import { Task } from "@/pages";

interface Props {
  project: Project;
  card?: Task;
}

export const EmotionSummaryModule: FC<Props> = ({ project, card }) => {
  return (
    <div className="graph-container">
      <HorizontalBarGraph project={project} card={card} />
    </div>
  );
};
