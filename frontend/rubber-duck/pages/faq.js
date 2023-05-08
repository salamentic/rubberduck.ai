import Link from "next/link";
import Head from 'next/head';
import Script from 'next/script';
import Layout from '../components/Layout';

export default function FAQ() {
  return (
    <Layout>
      <h1> FAQ </h1>
      <Head>
        <title> Rubber Duck FAQ </title>
      </Head>
      <h2> <Link href="/"> Go Back </Link> </h2>
    </Layout>
  )
}
