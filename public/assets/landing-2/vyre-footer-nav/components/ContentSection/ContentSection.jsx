import React from 'react';
import styles from './ContentSection.module.css';

import JournalCarousel from '../JournalCarousel/JournalCarousel';
import DailyTaskCarousel from '../DailyTaskCarousel/DailyTaskCarousel';
import DailyQuoteCard from '../DailyQuoteCard/DailyQuoteCard';
import BottomImage from '../BottomImage/BottomImage';
import FooterNav from '../FooterNav/FooterNav';

export default function ContentSection() {
  return (
    <section className={styles.contentSection}>

      <article className={styles.article}>
        <JournalCarousel />
      </article>

      <article className={styles.article}>
        <DailyTaskCarousel />
      </article>

      <article className={styles.article}>
        <DailyQuoteCard />
      </article>

      <div className={styles.visual}>
        <BottomImage />
      </div>

      <FooterNav />

    </section>
  );
}
