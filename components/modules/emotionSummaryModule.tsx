import { FC } from "react";
import { HorizontalBarGraph } from "../graphs/horizontalBarGraph";
import { Rating } from "@/pages";
import { Typography } from "@mui/material";

interface Props {
  ratings: Rating[];
  isLoading: boolean;
}

export const EmotionSummaryModule: FC<Props> = ({ ratings, isLoading }) => {
  console.log("module ratings", ratings);

  return (
    <div className="graph-container">
      <Typography variant="h2">Emotion Summary</Typography>
      <HorizontalBarGraph ratings={ratings} isLoading={isLoading} />
    </div>
  );
};
