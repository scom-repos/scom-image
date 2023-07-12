export enum UploadType {
  'UPLOAD' = 'upload',
  'UNPLASH' = 'unsplash'
}

export interface IType {
  type: UploadType,
  caption: string;
  icon: any;
}
