export enum UploadType {
  'UPLOAD' = 'upload',
  'UNSPLASH' = 'unsplash'
}

export interface IType {
  type: UploadType,
  caption: string;
  icon: any;
}

export interface IUnsplashPhoto {
  id: string;
  slug: string;
  alt_description: string;
  user: any;
  urls: any;
}
