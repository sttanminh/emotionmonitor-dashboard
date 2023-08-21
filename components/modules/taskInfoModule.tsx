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

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;
  return (
    data && (
      <div className="task-info-container">
        <h2>{data.taskName}</h2>
        <p>{`${data.description ?? "description of " + data.taskName}`}</p>
      </div>
    )
  );
};
