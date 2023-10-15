import { FC } from "react";
import { HorizontalBarGraph } from "../graphs/horizontalBarGraph";
import { Ratings } from "@/pages";
import Typography from "@mui/material/Typography";

interface Props {
  ratings: Ratings;
  isLoading: boolean;
  availableEmojis: string[];
}

export const EmotionSummaryModule: FC<Props> = ({
  ratings,
  isLoading,
  availableEmojis,
}) => {
  return (
    <div className="graph-container">
      <Typography variant="h2">Emotion Summary</Typography>
      <HorizontalBarGraph
        ratings={ratings}
        isLoading={isLoading}
        availableEmojis={availableEmojis}
      />
    </div>
  );
};
