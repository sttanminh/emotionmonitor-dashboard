import React, { FC } from "react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

// This is the Layout that will wrapp all of our pages
export const Layout: FC<Props> = (props) => {
  return (
    <React.Fragment>
      <div>
        <div>{"NavBar here"}</div>
        <div>{props.children}</div>
      </div>
    </React.Fragment>
  );
};