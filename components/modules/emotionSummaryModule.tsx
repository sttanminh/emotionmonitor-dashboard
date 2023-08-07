import { FC } from "react";
import { HorizontalBarGraph } from "../graph/horizontalBarGraph";

export type GraphData = {
    emotionName: string
    emotionAv: number
}
interface Props {
  data: GraphData[];

}

export const EmotionSummaryModule: FC<Props> = ({data}) => {
return (
<div className="graph-container">
  <HorizontalBarGraph data={data} />
</div>)
}
