import React, { FC } from "react";
import { ReactNode } from "react";
import styles from "./layout.module.css"; // Import the CSS module

interface Props {
  children: ReactNode;
}

// This is the Layout that will wrapp all of our pages
export const Layout: FC<Props> = (props) => {
  return (
    <React.Fragment>
      <div className={styles.layout}>
        <div>{props.children}</div>
      </div>
    </React.Fragment>
  );
};
