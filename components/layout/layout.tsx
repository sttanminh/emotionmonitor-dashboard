import React, { FC } from "react";
import { ReactNode } from "react";
import Link from 'next/link';
import styles from "./layout.module.css"; // Import the CSS module
import { FaTrello, FaJira, FaGitAlt } from 'react-icons/fa';
import { FaCog } from 'react-icons/fa';



interface Props {
  children: ReactNode;
}

// This is the Layout that will wrapp all of our pages
export const Layout: FC<Props> = (props) => {
  return (
    <React.Fragment>
      
      <div className={styles.layout}>
        <nav className={styles.navigation}>
        <button className={`${styles.navButton} ${styles.trelloIcon}`}>
            <Link href="/">
              <FaTrello size={30} style={{ color: "#0052CC" }} />
            </Link>
          </button>
          <button className={styles.navButton}>
            <Link href="/">
              <FaJira size={30} style={{ color: "#0052CC" }} />
            </Link>
          </button>
          <button className={styles.navButton}>
            <Link href="/">
              <FaGitAlt size={30} style={{ color: "hsl(0, 0%, 4%)" }} />
            </Link>
          </button>
          <button className={styles.settingsButton}>
            <Link href="/">
              <FaCog size={20} style={{ color: "#423f3f" }} />
            </Link>
          </button>
        </nav>
        <div>{props.children}</div>
      </div>
    </React.Fragment>
  );
};



