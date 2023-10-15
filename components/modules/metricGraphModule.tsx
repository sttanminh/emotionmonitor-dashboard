import { FC } from "react";
import { Ratings } from "@/pages";
import MetricGraphs from "../graphs/MetricGraphs";
import Typography from "@mui/material/Typography";
import { Level } from "@prisma/client";

interface Props {
  ratings: Ratings;
  activeMetrics: {
    id: string;
    name: string;
    active: boolean;
    projectId: string;
    levels: Level[];
  }[];
  isLoading: boolean;
  availableEmojis: string[];
}

export const MetricGraphModule: FC<Props> = ({
  ratings,
  activeMetrics,
  isLoading,
  availableEmojis,
}) => {
  // Initialize an empty object to store the aggregated metric
  const metricData: Record<string, Record<string, Record<string, number>>> = {};
  const usedLevels: { [key in string]: Level[] } = {};
  // Loop through the ratings and aggregate the values and count
  ratings.forEach((rating) => {
    const { metric: ratingMetric, emoScore, level } = rating;
    const metricName = ratingMetric.name;
    const emoLabel = availableEmojis[emoScore];
    const thisLevel =
      level > 0
        ? ratingMetric.levels.find(
            (metricLevel) => metricLevel.id == rating.levelId
          )
        : undefined;
    const levelLabel = thisLevel?.levelLabel;
    if (levelLabel) {
      if (!metricData[metricName]) {
        metricData[metricName] = {};
      }
      if (!metricData[metricName][emoLabel]) {
        metricData[metricName][emoLabel] = {};
      }
      if (!metricData[metricName][emoLabel][levelLabel]) {
        usedLevels[metricName]
          ? !usedLevels[metricName].find(
              (level) => level.id === thisLevel.id
            ) && usedLevels[metricName].push(thisLevel)
          : (usedLevels[metricName] = [thisLevel]);
      }
      metricData[metricName][emoLabel][levelLabel] =
        (metricData[metricName][emoLabel][levelLabel] || 0) + 1;
    }
  });
  // Fill in missing levels and emojis with 0
  activeMetrics.forEach((metric) => {
    if (!metricData[metric.name]) metricData[metric.name] = {};
  });
  for (const metricName in metricData) {
    const ratingLevels = ratings.find(
      (rating) => rating.metric.name == metricName
    );
    const activeMetricLevels = activeMetrics.find(
      (metric) => metric.name == metricName
    );
    const metricLevels =
      (ratingLevels &&
        ratingLevels.metric.levels.filter((level) => level.active)) ??
      (activeMetricLevels && activeMetricLevels.levels);
    if (!metricLevels) {
      console.error("something is very wrong with your metric data");
      break;
    }
    for (let emoScore = 0; emoScore < availableEmojis.length; emoScore++) {
      const emoLabel = availableEmojis[emoScore];
      if (!metricData[metricName][emoLabel]) {
        metricData[metricName][emoLabel] = {};
      }
      metricLevels.forEach((level) => {
        if (!metricData[metricName][emoLabel][level.levelLabel]) {
          usedLevels[metricName]
            ? !usedLevels[metricName].find(
                (usedLevel) => level.id === usedLevel.id
              ) && usedLevels[metricName].push(level)
            : (usedLevels[metricName] = [level]);
          metricData[metricName][emoLabel][level.levelLabel] = 0;
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
          <Typography data-testid="metricGraph" variant="h2" margin={"20px"}>
            Metric Summary
          </Typography>
          {Object.keys(metricGraphData).map((metricName, index) => (
            <MetricGraphs
              key={metricName}
              metricName={metricName}
              metricData={metricGraphData[metricName]}
              orderedLevels={usedLevels[metricName]
                .sort((a, b) => a.levelOrder - b.levelOrder)
                .map((level) => level.levelLabel)}
              displayEmojis={index === Object.keys(metricGraphData).length - 1}
              availableEmojis={availableEmojis}
            />
          ))}
        </>
      )}
    </div>
  );
};
