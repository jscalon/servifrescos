import type { ReactNode } from "react";
import styles from "./Card.module.css";
import BackButton from "../BackButton";

interface CardProps {
  children: ReactNode;
	className?: string;
	showBackButton?: boolean;
}

export default function Card({ children, className = "", showBackButton = true }: CardProps) {
  return (
    <div className={styles.card + " " + className}>
      {showBackButton && <BackButton />}
      {children}
    </div>
  );
}
