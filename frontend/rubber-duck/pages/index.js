import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Button from '../components/Button'
import AudioRecorder from '../components/AudioRecorder'

export default function Home() {
  return (
    <div className={styles.container}>
      <main>
        <div class="flex flex-col items-center mt-16">
        <h1 class="text-4xl text-center">
          Read the <Link href="/faq"> FAQ!</Link>
        </h1>
        </div>
      <AudioRecorder />
      </main>
    </div>
  )
}
