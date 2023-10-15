import { FC } from "react";
import { VictoryBar, VictoryChart, VictoryTheme } from "victory";
import { Ratings } from "@/pages";
import Typography from "@mui/material/Typography";

interface Props {
  ratings: Ratings;
  isLoading: boolean;
  availableEmojis: string[];
}

interface GraphData {
  x: string;
  y?: number;
}

const getGraph = (graphData: GraphData[], emojis: string[]) => {
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
                  case emojis[4]:
                    return "#785EF0";
                  case emojis[3]:
                    return "#648FFF";
                  case emojis[2]:
                    return "#FFB000";
                  case emojis[1]:
                    return "#DC267F";
                  case emojis[0]:
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

export const HorizontalBarGraph: FC<Props> = ({
  ratings,
  isLoading,
  availableEmojis,
}) => {
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
  return <>{getGraph(graphData, availableEmojis)}</>;
};
