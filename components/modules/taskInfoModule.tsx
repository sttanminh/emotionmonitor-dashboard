import { FC } from "react";

export type TaskData = {
    taskID: number
    taskName: string
}
interface Props {
  data: TaskData;

}

export const TaskInfoModule: FC<Props> = ({data}: Props) => {
return (
  <div className="task-info-container">
    <h2>{data.taskName}</h2>
    <p>{`${data.taskName} summary!`}</p>
  </div>
  )
}
