/* prettier-ignore */
import { Inter, Quicksand, Pacifico, Playfair_Display } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
export const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-quicksand' });
export const pacifico = Pacifico({ weight: '400', subsets: ['latin'], variable: '--font-pacifico' });
// Elegant display serif for banner titles
export const playfair = Playfair_Display({ weight: ['500', '600'], subsets: ['latin'], variable: '--font-display', display: 'swap' });
