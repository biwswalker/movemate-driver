type TSupportDevice =
  | 'iPhoneProMax'
  | 'iPhonePro'
  | 'iPhone'
  | 'iPhone14Plus'
  | 'iPhone13Mini'
  | 'iPhoneSE'
  | 'iPhone8Plus'
  | 'iPhone8'
  | 'AndroidSmall'
  | 'AndroidLarge';

type TOrientation = 'portrait' | 'landscape';

interface IResolution {
  width: number;
  height: number;
}

interface FileInput {
  uri: string;
  name: string;
  size: number;
  type?: string;
  trueType?: string;
}