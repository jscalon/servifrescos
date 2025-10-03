import type { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
  children: ReactNode;
  width?: number;
}

function Card({ children, width }: CardProps) {
  return <div className={styles.card} style={{width: `${width}px`}}>{children}</div>;
}

export default Card;
