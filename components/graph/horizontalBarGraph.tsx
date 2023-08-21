import { FC } from "react";
import { VictoryBar, VictoryChart, VictoryTheme } from "victory";
import { useState, useEffect } from "react";
import { Metric, Project, Rating } from "@prisma/client";
import { Task } from "@/pages";

const availableEmojis = ["😔", "😢", "😐", "😊", "😀", "🤔"];
interface Props {
  project: Project;
  card?: Task;
  metric?: Metric;
}

interface GraphData {
  x: string;
  y?: number;
}

export const HorizontalBarGraph: FC<Props> = ({ project, card, metric }) => {
  const [data, setData] = useState<Rating[] | undefined>(undefined);
  const [isLoading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState<GraphData[]>();
  useEffect(() => {
    setLoading(true);
    console.log("fetching ratings with cardId", card?.id);
    fetch(
      `/api/ratings?projectId=${project.id}${card ? "&cardId=" + card.id : ""}${
        metric ? "&metricId=" + metric.id : ""
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        setData(data.ratings);
        setLoading(false);
        const newData = availableEmojis.map((emoji, index) => ({
          x: emoji,
          y: data.ratings?.filter((rating: Rating) => rating.emoScore === index)
            .length,
        }));
        setGraphData(newData);
      });
  }, [project, card, metric]);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
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
  );
};
