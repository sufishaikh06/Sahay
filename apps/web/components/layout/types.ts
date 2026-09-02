/** Navigation item type for role-agnostic navigation configuration */
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  children?: NavItem[];
}

/** Navigation configuration supplied by role-specific features */
export interface NavigationConfig {
  items: NavItem[];
  role?: string;
}
