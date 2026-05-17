/// <reference types="vite/client" />

// ── CSS Modules ────────────────────────────────────────────────
declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

// ── Imágenes y SVG ─────────────────────────────────────────────
declare module '*.svg' {
  import React from 'react';
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}
