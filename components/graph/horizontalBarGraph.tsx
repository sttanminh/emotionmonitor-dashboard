import { FC } from "react";
import { VictoryBar, VictoryChart, VictoryTheme } from "victory";

export type GraphData = {
    emotionName: string
    emotionAv: number
}
interface Props {
  data: GraphData[];
}

export const HorizontalBarGraph: FC<Props> = ({data}) => {
return <VictoryChart
  theme={VictoryTheme.material}
  domainPadding={10}
  width={800}
  padding={{left: 60, bottom: 20}}
>
  <VictoryBar
    horizontal={true}
    animate={true}
    cornerRadius={7.5}
    style={{ 
        data: { fill: ({ datum }) => 
            {switch(datum.x){
                case "excited": return("#785EF0")
                case "neutral": return("#648FFF")
                case "anxious": return("#FFB000")
                case "happy": return("#DC267F")
                case "angry": return("#FE6100")
                default: return("#000000")
                }
            } 
        }
    }}
    data={data.map(graphData => ({x: graphData.emotionName, y: graphData.emotionAv}))}
  />
</VictoryChart>
}