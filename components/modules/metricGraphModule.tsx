import { FC } from "react";
import { Rating, Task, availableEmojis } from "@/pages";
import MetricGraphs from "../graphs/MetricGraphs";
import { Typography } from "@mui/material";

interface Props {
  ratings: Rating[];
  isLoading: boolean;
}

export const MetricGraphModule: FC<Props> = ({ ratings, isLoading }) => {
  // Initialize an empty object to store the aggregated metric
  const metricData: Record<string, Record<string, Record<string, number>>> = {};
  // Loop through the ratings and aggregate the values and count
  ratings.forEach((rating) => {
    const { metric: ratingMetric, emoScore, level } = rating;
    const metricName = ratingMetric.name;
    const emoLabel = availableEmojis[emoScore];
    const levelLabel =
      level > 0 &&
      ratingMetric.levels.find((metricLevel) => metricLevel.levelOrder == level)
        ?.levelLabel;
    if (levelLabel) {
      if (!metricData[metricName]) {
        metricData[metricName] = {};
      }
      if (!metricData[metricName][emoLabel]) {
        metricData[metricName][emoLabel] = {};
      }
      metricData[metricName][emoLabel][levelLabel] =
        (metricData[metricName][emoLabel][levelLabel] || 0) + 1;
    }
  });

  // Fill in missing levels and emojis with 0
  for (const metricId in metricData) {
    const metricLevels = ratings.find(
      (rating) => rating.metric.name == metricId
    )?.metric.levels;
    if (!metricLevels) {
      console.error("something is very wrong with your metrict data");
      break;
    }
    for (let emoScore = 0; emoScore < availableEmojis.length; emoScore++) {
      const emoLabel = availableEmojis[emoScore];
      if (!metricData[metricId][emoLabel]) {
        metricData[metricId][emoLabel] = {};
      }
      metricLevels.forEach((level) => {
        if (!metricData[metricId][emoLabel][level.levelLabel]) {
          metricData[metricId][emoLabel][level.levelLabel] = 0;
        }
      });
    }
  }
  const metricGraphData = metricData;
  return (
    <div className="metricGraph">
      {isLoading && <Typography variant="body1">Loading data...</Typography>}
      {!isLoading && ratings.length == 0 && (
        <Typography variant="body1">
          No data for selected time period...
        </Typography>
      )}
      {!isLoading && ratings.length > 0 && (
        <>
          <Typography variant="h2" margin={"20px"}>
            Metric Summary
          </Typography>
          {Object.keys(metricGraphData).map((metricName, index) => (
            <MetricGraphs
              key={metricName}
              metricName={metricName}
              metricData={metricGraphData[metricName]}
              orderedLevels={ratings
                .find((rating) => rating.metric.name == metricName)!
                .metric.levels.sort((a, b) => a.levelOrder - b.levelOrder)
                .map((level) => level.levelLabel)}
              displayEmojis={index === Object.keys(metricGraphData).length - 1}
            />
          ))}
        </>
      )}
    </div>
  );
};
