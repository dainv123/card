import type { AppProps } from 'next/app';
import '../styles/globals.css'; // Điều chỉnh đường dẫn nếu cần

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}