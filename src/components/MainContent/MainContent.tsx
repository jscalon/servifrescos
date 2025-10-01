import styles from "./MainContent.module.css";
import type { ReactNode } from "react";

interface MainContentProps {
  children: ReactNode;
}

function MainContent({ children }: MainContentProps) {
  return <div className={styles.mainContent}>{children}</div>;
}

export default MainContent;
