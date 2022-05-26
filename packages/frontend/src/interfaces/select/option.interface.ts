import { ReactElement } from 'react';

export interface SelectOption {
  value: string;
  label: string | ReactElement;
}
