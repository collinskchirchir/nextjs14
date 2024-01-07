// import { Inter, Lexend_Deca } from 'next/font/google';
import localFonts from 'next/font/local';

export const inter = localFonts({
  src: './fonts/StudioFeixenSansVF.ttf',
  variable: '--font-inter',
});

export const spaceGrotesk = localFonts({
  src: './fonts/SpaceGrotesk-VariableFont_wght.ttf',
  variable: '--font-spaceGrotesk',
});

export const jetBrains = localFonts({
  src: './fonts/JetBrainsMono-VariableFont_wght.ttf',
  variable: '--font-jetbrains',
});
export const feixenMono = localFonts({
  src: './fonts/StudioFeixenMono.ttf',
  variable: '--font-feixenMono',
});
