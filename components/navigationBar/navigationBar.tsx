import { FC } from "react";
import { NavigationButton } from "./navigationButton";
import React from "react";

// using this home made mod function because % doesn't play well with negatives
function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

interface Props {
  selectionItems: string[]
  activeItem: string
  setActiveItem: (value: React.SetStateAction<string>) => void
  labelStyle: string
}

export const NavigationBar: FC<Props> = ({selectionItems, activeItem, setActiveItem, labelStyle}: Props) => {
  const navigateOptions = (direction: 1 | -1, options: string[], current: string, setter: React.Dispatch<React.SetStateAction<string>>) => () => {
    const currentIndex = options.indexOf(current);
    const nextItem = options[mod((currentIndex + direction), options.length)];
    setter(nextItem);
  };
  return (
  <React.Fragment>
    <NavigationButton direction="left" onClick={navigateOptions(-1, selectionItems, activeItem, setActiveItem)}/>
    <div className={labelStyle}>{activeItem}</div>
    <NavigationButton direction="right" onClick={navigateOptions(1, selectionItems, activeItem, setActiveItem)}/>
  </React.Fragment>
  )
}
