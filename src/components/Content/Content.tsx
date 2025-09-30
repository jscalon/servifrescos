import styles from "./Content.module.css";
import type { ReactNode } from "react";

interface ContentProps {
  children: ReactNode;
  title: string;
}

function Content({ children, title }: ContentProps) {
  return (
    <div className={styles.content}>
      <h1>{title}</h1>
      {children}
    </div>
  );
}

export default Content;
