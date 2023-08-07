import { FC } from "react";

interface Props {
  onClick: () => void
  direction: "left" | "right"
}

export const NavigationButton: FC<Props> = ({onClick, direction}: Props) => {
return (
  <button
        className="arrow-button"
        onClick={onClick}
      >{direction === "left" ? "←" : "→"}</button>
  )
}
