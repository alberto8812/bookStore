export interface FilterFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'dateRange';
  placeholder?: string;
  options?: { value: string; label: string }[];
}

// Internal state structure for the filter panel (before converting to FilterDto[])
export interface FilterPanelState {
  [key: string]: string | { from?: string; to?: string } | undefined;
}
