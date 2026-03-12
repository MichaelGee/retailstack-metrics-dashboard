export const LAYOUT = {
  /** Fixed header height: 5rem */
  headerHeight: 'h-20',
  /** Padding-top to offset fixed header: 7rem */
  headerOffset: 'pt-28',
  /** Fixed sidebar width: 16.875rem */
  sidebarWidth: 'w-[16.875rem]',
  /** Standard page container padding: 1.5rem */
  containerPadding: 'p-6',
  /** Gap between major sections: 1.5rem */
  sectionGap: 'gap-6',
} as const;

/**
 * Component radius tokens from the design system.
 * Use these instead of arbitrary rounded-[*] values.
 */
export const RADIUS = {
  /** Table search input: rounded-md */
  tableSearch: 'rounded-md',
  /** Dialog/Modal: rounded-2xl */
  dialog: 'rounded-2xl',
  /** Card: rounded-xl */
  card: 'rounded-xl',
  /** Button: rounded-md */
  button: 'rounded-md',
  /** Input: rounded-md */
  input: 'rounded-md',
} as const;

/**
 * Raw values for JavaScript usage (e.g., in chart configs).
 */
export const RAW_VALUES = {
  headerHeight: '5rem',
  headerOffset: '7rem',
  sidebarWidth: '16.875rem',
} as const;
