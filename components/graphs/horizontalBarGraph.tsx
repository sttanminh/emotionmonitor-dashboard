import { FC } from "react";
import { VictoryBar, VictoryChart, VictoryTheme } from "victory";
import { Ratings, availableEmojis } from "@/pages";
import { Typography } from "@mui/material";

interface Props {
  ratings: Ratings;
  isLoading: boolean;
}

interface GraphData {
  x: string;
  y?: number;
}

const getGraph = (graphData: GraphData[]) => {
  return (
    <>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={10}
        width={800}
        height={300}
        padding={{ left: 60, bottom: 20 }}
        animate={false}
      >
        <VictoryBar
          horizontal={true}
          animate={false}
          cornerRadius={7.5}
          data-testid="emotionSummaryGraph"
          style={{
            data: {
              fill: ({ datum }) => {
                switch (datum.x) {
                  case "😀":
                    return "#785EF0";
                  case "😐":
                    return "#648FFF";
                  case "😢":
                    return "#FFB000";
                  case "😊":
                    return "#DC267F";
                  case "😔":
                    return "#FE6100";
                  default:
                    return "#000000";
                }
              },
            },
          }}
          data={graphData.map((data) => data)}
        />
      </VictoryChart>
    </>
  );
};

export const HorizontalBarGraph: FC<Props> = ({ ratings, isLoading }) => {
  // Initialize an empty object to store the aggregated metric
  const emojiData: Record<string, number> = {};
  let graphData: { x: string; y: number }[] = [];

  ratings.forEach((rating) => {
    if (!emojiData[availableEmojis[rating.emoScore]]) {
      emojiData[availableEmojis[rating.emoScore]] = 0;
    }
    emojiData[availableEmojis[rating.emoScore]]++;
  });

  availableEmojis.forEach((emoji) =>
    graphData.push({ x: emoji, y: emojiData[emoji] || 0 })
  );

  if (isLoading || !graphData)
    return <Typography variant="body1">Loading...</Typography>;
  if (!ratings || ratings.length < 1)
    return (
      <Typography variant="body1">No rating for this time period</Typography>
    );
  return <>{getGraph(graphData)}</>;
};
