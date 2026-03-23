export type FilterOperator = 'equals' | 'contains' | 'in' | 'gt' | 'lt';

export interface FilterDto {
  field: string;
  operator?: FilterOperator;
  Value: string; // capital V — matches backend
}
