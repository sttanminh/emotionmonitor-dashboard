import React, { FC } from "react";
import { ReactNode } from "react";
import Link from "next/link";
import styles from "./layout.module.css"; // Import the CSS module
import { FaTrello, FaJira, FaGitAlt } from "react-icons/fa";
import { FaCog } from "react-icons/fa";

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
