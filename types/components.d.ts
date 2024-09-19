type TFontVarient =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline'
  | 'buttonS'
  | 'buttonM'
  | 'buttonL';
type TTextColor = 'primary' | 'secondary' | 'disabled';

type TButtonVarient = 'contained' | 'outlined' | 'text' | 'soft';
type TColorSchema =
  | 'primary'
  | 'secondary'
  | 'inherit'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'master';
type TButtonSize = 'large' | 'medium' | 'small';

interface SnackbarOptions {
  message: string;
  duration?: number;
  varient?: TColorSchema
}

interface TLocation {
  latitude: number
  longitude: number
}