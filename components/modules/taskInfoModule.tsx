import { Typography } from "@mui/material";
import { TrelloCard } from "@prisma/client";
import { FC, useEffect, useState } from "react";

interface Props {
  id?: string;
}

export const TaskInfoModule: FC<Props> = ({ id }: Props) => {
  const [data, setData] = useState<TrelloCard | undefined>(undefined);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/trelloCard?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.trelloCard);
        setLoading(false);
      });
  }, [id]);

  if (isLoading) return <Typography variant="body1">Loading...</Typography>;
  if (!data) return <Typography variant="body1">No profile data</Typography>;
  return (
    data && (
      <div className="task-info-container">
        <Typography variant="h2">{data.taskName}</Typography>
        <Typography variant="body1">{`${data.description}`}</Typography>
      </div>
    )
  );
};
