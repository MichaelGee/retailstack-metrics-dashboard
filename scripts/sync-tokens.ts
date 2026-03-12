/**
 * Generates tokens/variables.css and tokens/tailwind.theme.json
 * from the single source of truth: tokens/tokens.json
 *
 * Usage: npx tsx scripts/sync-tokens.ts
 *
 * After running, also run: npx tsx scripts/sync-motion-css.ts
 * to patch in the active motion preset values.
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const TOKENS_PATH = path.join(ROOT, 'tokens/tokens.json');
const CSS_OUTPUT = path.join(ROOT, 'tokens/variables.css');
const TAILWIND_OUTPUT = path.join(ROOT, 'tokens/tailwind.theme.json');

/** Convert "#FFFFFF" → "255 255 255" for Tailwind rgb() opacity support */
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r} ${g} ${b}`;
}

// Motion defaults — sync-motion-css.ts will overwrite these with the active preset
const MOTION_DEFAULTS: Record<string, string> = {
  '--motion-duration-snappy': '180ms',
  '--motion-duration-smooth': '300ms',
  '--motion-duration-liquid': '450ms',
  '--motion-easing-snappy': 'cubic-bezier(0.34, 1.04, 0.64, 1)',
  '--motion-easing-smooth': 'cubic-bezier(0.34, 1.03, 0.64, 1)',
  '--motion-easing-liquid': 'cubic-bezier(0.34, 1.02, 0.64, 1)',
};

function main() {
  console.log('Syncing design tokens...');

  const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf-8'));

  // ─── CSS Variables ────────────────────────────────────────────────────────

  const rootVars: string[] = [
    '    /* -------------------------------------------------------------------------- */',
    '    /*                                 PRIMITIVES                                 */',
    '    /* -------------------------------------------------------------------------- */',
    '',
    '    /* --- COLORS --- */',
  ];
  const darkVars: string[] = [];

  // Primitive Colors
  for (const [family, shades] of Object.entries(tokens.primitives.colors)) {
    if (typeof shades === 'string') {
      rootVars.push(`    --${family}: ${hexToRgb(shades)};`);
    } else {
      for (const [shade, value] of Object.entries(shades as Record<string, string>)) {
        rootVars.push(`    --${family}-${shade}: ${hexToRgb(value)};`);
      }
    }
  }

  // Spacing
  rootVars.push('', '    /* --- SPACING --- */');
  for (const [key, value] of Object.entries(tokens.primitives.spacing)) {
    rootVars.push(`    --spacing-${(key as string).replace('.', '_')}: ${value};`);
  }

  // Border Radius
  rootVars.push('', '    /* --- BORDER RADIUS --- */');
  for (const [key, value] of Object.entries(tokens.primitives.borderRadius)) {
    rootVars.push(`    --radius-${key}: ${value};`);
  }

  // Typography
  rootVars.push('', '    /* --- TYPOGRAPHY --- */');
  rootVars.push(`    --font-family-sans: 'Rubik', sans-serif;`);

  for (const [key, value] of Object.entries(tokens.primitives.typography.fontSize)) {
    rootVars.push(`    --font-size-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(tokens.primitives.typography.fontWeight)) {
    rootVars.push(`    --font-weight-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(tokens.primitives.typography.lineHeight)) {
    rootVars.push(`    --line-height-${key}: ${value};`);
  }
  if (tokens.primitives.typography.letterSpacing) {
    for (const [key, value] of Object.entries(tokens.primitives.typography.letterSpacing)) {
      rootVars.push(`    --letter-spacing-${key}: ${value};`);
    }
  }

  // Shadows
  rootVars.push('', '    /* --- SHADOWS --- */');
  for (const [key, value] of Object.entries(tokens.primitives.shadows)) {
    rootVars.push(`    --shadow-${key}: ${value};`);
  }

  // Motion (placeholders — sync-motion-css.ts patches these)
  rootVars.push('', '    /* --- MOTION --- */');
  rootVars.push(
    '    /* Values correspond to the active preset in registry/lib/motion/config.ts */'
  );
  rootVars.push('    /* Default: soft-settle */');
  for (const [key, value] of Object.entries(MOTION_DEFAULTS)) {
    rootVars.push(`    ${key}: ${value};`);
  }

  // Semantic Tokens
  rootVars.push(
    '',
    '    /* -------------------------------------------------------------------------- */',
    '    /*                                  SEMANTIC                                  */',
    '    /* -------------------------------------------------------------------------- */'
  );

  const semanticGroups = tokens.semantic.colors;

  for (const [group, groupTokens] of Object.entries(
    semanticGroups as Record<string, Record<string, { light: string; dark: string }>>
  )) {
    rootVars.push('', `    /* --- ${group.toUpperCase()} --- */`);

    for (const [tokenName, modes] of Object.entries(groupTokens)) {
      const varName = `--${group}-${tokenName}`;
      const lightRef = `var(--${modes.light.replace('.', '-')})`;
      const darkRef = `var(--${modes.dark.replace('.', '-')})`;

      rootVars.push(`    ${varName}: ${lightRef};`);
      darkVars.push(`    ${varName}: ${darkRef};`);
    }
  }

  // Write CSS
  const css = `@layer base {
  :root {
${rootVars.join('\n')}
  }

  /* --- REDUCED MOTION --- */
  @media (prefers-reduced-motion: reduce) {
    :root {
      --motion-duration-snappy: 0ms;
      --motion-duration-smooth: 0ms;
      --motion-duration-liquid: 0ms;
      --motion-easing-snappy: linear;
      --motion-easing-smooth: linear;
      --motion-easing-liquid: linear;
    }
  }

  .dark {
${darkVars.join('\n')}
  }
}
`;

  fs.writeFileSync(CSS_OUTPUT, css);
  console.log(`  Generated ${path.relative(ROOT, CSS_OUTPUT)}`);

  // ─── Tailwind Theme ───────────────────────────────────────────────────────

  const tailwindColors: Record<string, string> = {};

  // Primitive colors
  for (const [family, shades] of Object.entries(tokens.primitives.colors)) {
    if (typeof shades === 'string') {
      tailwindColors[family] = `rgb(var(--${family}) / <alpha-value>)`;
    } else {
      for (const shade of Object.keys(shades as object)) {
        tailwindColors[`${family}-${shade}`] = `rgb(var(--${family}-${shade}) / <alpha-value>)`;
      }
    }
  }

  // Semantic colors
  for (const [group, groupTokens] of Object.entries(semanticGroups as Record<string, object>)) {
    for (const tokenName of Object.keys(groupTokens)) {
      const key = `${group}-${tokenName}`;
      tailwindColors[key] = `rgb(var(--${key}) / <alpha-value>)`;
    }
  }

  // shadcn/ui compatibility aliases
  const shadcnMap: Record<string, string> = {
    background: 'bg-primary',
    foreground: 'text-primary',
    primary: 'brand-primary',
    'primary-foreground': 'white',
    secondary: 'bg-tertiary',
    'secondary-foreground': 'text-primary',
    muted: 'bg-quaternary',
    'muted-foreground': 'text-placeholder',
    accent: 'bg-active',
    'accent-foreground': 'text-primary',
    destructive: 'error-primary',
    'destructive-foreground': 'white',
    border: 'border-primary',
    input: 'border-primary',
    ring: 'brand-primary',
  };

  for (const [shadcnKey, semanticKey] of Object.entries(shadcnMap)) {
    if (semanticKey === 'white') {
      tailwindColors[shadcnKey] = `rgb(var(--white) / <alpha-value>)`;
    } else {
      tailwindColors[shadcnKey] = `rgb(var(--${semanticKey}) / <alpha-value>)`;
    }
  }

  // Spacing
  const spacing: Record<string, string> = {};
  for (const [key] of Object.entries(tokens.primitives.spacing)) {
    spacing[key] = `var(--spacing-${(key as string).replace('.', '_')})`;
  }
  if (tokens.semantic.spacing) {
    for (const [key] of Object.entries(tokens.semantic.spacing)) {
      spacing[key] = `var(--spacing-${key})`;
    }
  }

  // Border radius
  const borderRadius: Record<string, string> = {};
  for (const key of Object.keys(tokens.primitives.borderRadius)) {
    borderRadius[key] = `var(--radius-${key})`;
  }

  // Font size (primitive + semantic display/text styles)
  const fontSize: Record<
    string,
    string | [string, string] | [string, { lineHeight: string; letterSpacing: string }]
  > = {};

  for (const key of Object.keys(tokens.primitives.typography.fontSize)) {
    const lineHeight = tokens.primitives.typography.lineHeight[key];
    if (lineHeight) {
      fontSize[key] = [`var(--font-size-${key})`, `var(--line-height-${key})`];
    } else {
      fontSize[key] = `var(--font-size-${key})`;
    }
  }

  if (tokens.semantic.typography) {
    for (const [group, styles] of Object.entries(
      tokens.semantic.typography as Record<
        string,
        Record<string, { fontSize: string; lineHeight: string; letterSpacing: string }>
      >
    )) {
      for (const [key, style] of Object.entries(styles)) {
        const tokenKey = `${group}-${key}`;
        const tracking =
          style.letterSpacing === 'tighter'
            ? '-0.02em'
            : style.letterSpacing === 'tight'
              ? '-0.01em'
              : '0em';
        fontSize[tokenKey] = [
          `var(--font-size-${style.fontSize})`,
          { lineHeight: `var(--line-height-${style.lineHeight})`, letterSpacing: tracking },
        ];
      }
    }
  }

  // Box shadow
  const boxShadow: Record<string, string> = {};
  for (const key of Object.keys(tokens.primitives.shadows)) {
    boxShadow[key] = `var(--shadow-${key})`;
  }

  const tailwindConfig = {
    theme: {
      extend: {
        colors: tailwindColors,
        spacing,
        borderRadius,
        fontSize,
        boxShadow,
        transitionDuration: {
          snappy: 'var(--motion-duration-snappy)',
          smooth: 'var(--motion-duration-smooth)',
          liquid: 'var(--motion-duration-liquid)',
        },
        transitionTimingFunction: {
          snappy: 'var(--motion-easing-snappy)',
          smooth: 'var(--motion-easing-smooth)',
          liquid: 'var(--motion-easing-liquid)',
        },
        keyframes: {
          'accordion-down': {
            from: { height: '0' },
            to: { height: 'var(--radix-accordion-content-height)' },
          },
          'accordion-up': {
            from: { height: 'var(--radix-accordion-content-height)' },
            to: { height: '0' },
          },
          'caret-blink': {
            '0%,70%,100%': { opacity: '1' },
            '20%,50%': { opacity: '0' },
          },
        },
        animation: {
          'accordion-down':
            'accordion-down var(--motion-duration-smooth) var(--motion-easing-smooth)',
          'accordion-up': 'accordion-up var(--motion-duration-smooth) var(--motion-easing-smooth)',
          'caret-blink': 'caret-blink 1.25s ease-out infinite',
        },
      },
    },
  };

  fs.writeFileSync(TAILWIND_OUTPUT, JSON.stringify(tailwindConfig, null, 2) + '\n');
  console.log(`  Generated ${path.relative(ROOT, TAILWIND_OUTPUT)}`);

  console.log('Token sync complete!');
}

main();
