import Image from "next/image";
import styles from "./page.module.css";
import TransactionsPage from "@/Components/Transaction/Transaction";
import StatisticsPage from "@/Components/Statistics/StatisticsPage";
import ChartsPage from "@/Components/Charts/ChartsPage";

export default function Home() {
  return (
    <main className={styles.main}>
      <TransactionsPage />
    </main>
  );
}