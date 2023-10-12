import { FC } from "react";
import { HorizontalBarGraph } from "../graphs/horizontalBarGraph";
import { Ratings } from "@/pages";
import { Typography } from "@mui/material";

interface Props {
  ratings: Ratings;
  isLoading: boolean;
}

export const EmotionSummaryModule: FC<Props> = ({ ratings, isLoading }) => {
  return (
    <div className="graph-container">
      <Typography variant="h2">Emotion Summary</Typography>
      <HorizontalBarGraph ratings={ratings} isLoading={isLoading} />
    </div>
  );
};
