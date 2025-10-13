import type { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
  children: ReactNode;
  width?: string;
}

function Card({ children, width }: CardProps) {
  return (
    <div className={styles.card} style={width ? { width: width } : {}}>
      {children}
    </div>
  );
}

export default Card;
