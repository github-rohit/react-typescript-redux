export interface InputField {
  label: string;
  name: string;
  value?: any;
  type: string;
  onChange?: any;
  autoFocus?: boolean;
  error?: string | null;
  helperText?: string;
  placeholder?: string;
  classess?: string;
  onKeyDown?: any;
  onKeyUp?: any;
  options?: {
    [key: string]: any;
  }[];
}
