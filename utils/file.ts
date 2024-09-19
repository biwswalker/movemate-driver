// import IconAI from '@assets/icons/files/ic_ai.svg';
// import IconIMG from '@assets/icons/files/ic_img.svg';
// import IconPDF from '@assets/icons/files/ic_pdf.svg';
// import IconPTS from '@assets/icons/files/ic_pts.svg';
// import IconTXT from '@assets/icons/files/ic_txt.svg';
// import IconZIP from '@assets/icons/files/ic_zip.svg';
// import IconFILE from '@assets/icons/files/ic_file.svg';
// import IconWORD from '@assets/icons/files/ic_word.svg';
// import IconAUDIO from '@assets/icons/files/ic_audio.svg';
// import IconEXCEL from '@assets/icons/files/ic_excel.svg';
// import IconVIDEO from '@assets/icons/files/ic_video.svg';
// import IconFOLDER from '@assets/icons/files/ic_folder.svg';
// import IconPPT from '@assets/icons/files/ic_power_point.svg';
// import IconJS from '@assets/icons/files/ic_js.svg';
// import IconDOCUMENT from '@assets/icons/files/ic_document.svg';

// Define more types here
const FORMAT_PDF = ['pdf'];
const FORMAT_TEXT = ['txt'];
const FORMAT_PHOTOSHOP = ['psd'];
const FORMAT_WORD = ['doc', 'docx'];
const FORMAT_EXCEL = ['xls', 'xlsx'];
const FORMAT_ZIP = ['zip', 'rar', 'iso'];
const FORMAT_ILLUSTRATOR = ['ai', 'esp'];
const FORMAT_POWERPOINT = ['ppt', 'pptx'];
const FORMAT_AUDIO = ['wav', 'aif', 'mp3', 'aac'];
const FORMAT_IMG = ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'svg'];
const FORMAT_VIDEO = ['m4v', 'avi', 'mpg', 'mp4', 'webm'];

export function fileFormat(fileUrl: string | undefined) {
  let format;

  switch (fileUrl?.includes(fileTypeByUrl(fileUrl))) {
    case FORMAT_TEXT.includes(fileTypeByUrl(fileUrl)):
      format = 'txt';
      break;
    case FORMAT_ZIP.includes(fileTypeByUrl(fileUrl)):
      format = 'zip';
      break;
    case FORMAT_AUDIO.includes(fileTypeByUrl(fileUrl)):
      format = 'audio';
      break;
    case FORMAT_IMG.includes(fileTypeByUrl(fileUrl)):
      format = 'image';
      break;
    case FORMAT_VIDEO.includes(fileTypeByUrl(fileUrl)):
      format = 'video';
      break;
    case FORMAT_WORD.includes(fileTypeByUrl(fileUrl)):
      format = 'word';
      break;
    case FORMAT_EXCEL.includes(fileTypeByUrl(fileUrl)):
      format = 'excel';
      break;
    case FORMAT_POWERPOINT.includes(fileTypeByUrl(fileUrl)):
      format = 'powerpoint';
      break;
    case FORMAT_PDF.includes(fileTypeByUrl(fileUrl)):
      format = 'pdf';
      break;
    case FORMAT_PHOTOSHOP.includes(fileTypeByUrl(fileUrl)):
      format = 'photoshop';
      break;
    case FORMAT_ILLUSTRATOR.includes(fileTypeByUrl(fileUrl)):
      format = 'illustrator';
      break;
    default:
      format = fileTypeByUrl(fileUrl);
  }

  return format;
}

export function fileTypeByUrl(fileUrl = '') {
  return (fileUrl && fileUrl.split('.').pop()) || '';
}

export function fileNameByUrl(fileUrl: string) {
  return fileUrl.split('/').pop();
}

export function fileData(file: FileInput | string): FileInput {
  // Url
  if (typeof file === 'string') {
    return {
      size: 0,
      name: fileNameByUrl(file) || '',
      uri: fileTypeByUrl(file),
      type: fileFormat(file),
    };
  }
  // File
  return file;
}

export const imagePath = (filename: string | undefined) => {
  if (filename) {
    return `${process.env.EXPO_PUBLIC_API_URL}/source/${filename}`;
  }
  return '';
};
