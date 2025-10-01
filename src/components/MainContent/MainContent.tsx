import styles from "./MainContent.module.css";
import type { ReactNode } from "react";

interface MainContentProps {
  children: ReactNode;
  title: string;
}

function MainContent({ children, title }: MainContentProps) {
  return (
    <div className={styles.mainContent}>
      <h1>{title}</h1>
      {children}
    </div>
  );
}

export default MainContent;
