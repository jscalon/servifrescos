import styles from "./MainContent.module.css";
import type { ReactNode } from "react";

interface MainContentProps {
  children: ReactNode;
}

function MainContent({ children }: MainContentProps) {
  return <main className={styles.mainContent}>{children}</main>;
}

export default MainContent;
