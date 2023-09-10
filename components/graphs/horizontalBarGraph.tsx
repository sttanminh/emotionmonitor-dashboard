import { FC, useEffect } from "react";
import { VictoryBar, VictoryChart, VictoryTheme } from "victory";
import { Rating, availableEmojis } from "@/pages";

interface Props {
  ratings: Rating[];
  isLoading: boolean;
}

interface GraphData {
  x: string;
  y?: number;
}

export const HorizontalBarGraph: FC<Props> = ({ ratings, isLoading }) => {
  console.log("ratings", ratings);

  const graphData = availableEmojis.map((emoji, index) => ({
    x: emoji,
    y: ratings.filter((rating: Rating) => rating.emoScore === index).length,
  }));
  console.log("graphData", graphData);

  if (isLoading) return <p>Loading...</p>;
  if (!ratings || ratings.length < 1)
    return <p>No rating for this time period</p>;
  return (
    <>
      {!isLoading && (
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={10}
          width={800}
          padding={{ left: 60, bottom: 20 }}
        >
          <VictoryBar
            horizontal={true}
            animate={true}
            cornerRadius={7.5}
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
            data={graphData}
          />
        </VictoryChart>
      )}
    </>
  );
};
