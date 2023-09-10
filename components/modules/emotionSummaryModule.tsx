import { FC } from "react";
import { HorizontalBarGraph } from "../graphs/horizontalBarGraph";
import { Rating } from "@/pages";

interface Props {
  ratings: Rating[];
  isLoading: boolean;
}

export const EmotionSummaryModule: FC<Props> = ({ ratings, isLoading }) => {
  console.log("module ratings", ratings);

  return (
    <div className="graph-container">
      <HorizontalBarGraph ratings={ratings} isLoading={isLoading} />
    </div>
  );
};
