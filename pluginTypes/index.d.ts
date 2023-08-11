/// <amd-module name="@scom/scom-image/interface.ts" />
declare module "@scom/scom-image/interface.ts" {
    import { IDataSchema } from "@ijstech/components";
    export interface ICommand {
        execute(): void;
        undo(): void;
        redo(): void;
    }
    export interface IPageBlockAction {
        name: string;
        icon: string;
        command: (builder: any, userInputData: any) => ICommand;
        userInputDataSchema: IDataSchema;
    }
    export interface PageBlock {
        getActions: () => IPageBlockAction[];
        getData: () => any;
        setData: (data: any) => Promise<void>;
        getTag: () => any;
        setTag: (tag: any) => Promise<void>;
        defaultEdit?: boolean;
        tag?: any;
        validate?: () => boolean;
        readonly onEdit: () => Promise<void>;
        readonly onConfirm: () => Promise<void>;
        readonly onDiscard: () => Promise<void>;
        edit: () => Promise<void>;
        confirm: () => Promise<void>;
        discard: () => Promise<void>;
    }
    export interface IImage {
        cid?: string;
        url: string;
        altText?: string;
        backgroundColor?: string;
        link?: string;
        photoId?: string;
        keyword?: string;
        cropData?: ICropData;
    }
    export enum CropType {
        PREEFORM = "Freeform",
        CIRCLE = "Circle"
    }
    export interface ICropData {
        width: number;
        height: number;
        left: number;
        top: number;
        aspectRatio?: string;
        type: CropType;
        locked?: boolean;
    }
}
/// <amd-module name="@scom/scom-image/store.ts" />
declare module "@scom/scom-image/store.ts" {
    export const state: {
        ipfsGatewayUrl: string;
        unsplashApiKey: string;
    };
    export const setDataFromSCConfig: (options: any) => void;
    export const setIPFSGatewayUrl: (url: string) => void;
    export const getIPFSGatewayUrl: () => string;
    export const setUnsplashApiKey: (key: string) => void;
    export const getUnsplashApiKey: () => string;
    export const getUnsplashPhotos: (params?: any) => Promise<any>;
    export const filterUnsplashPhotos: (params?: any) => Promise<any>;
    export const getRandomKeyword: () => string;
}
/// <amd-module name="@scom/scom-image/data.json.ts" />
declare module "@scom/scom-image/data.json.ts" {
    const _default: {
        ipfsGatewayUrl: string;
        unsplashApiKey: string;
    };
    export default _default;
}
/// <amd-module name="@scom/scom-image/index.css.ts" />
declare module "@scom/scom-image/index.css.ts" { }
/// <amd-module name="@scom/scom-image/config/index.css.ts" />
declare module "@scom/scom-image/config/index.css.ts" {
    const _default_1: void;
    export default _default_1;
}
/// <amd-module name="@scom/scom-image/config/interface.ts" />
declare module "@scom/scom-image/config/interface.ts" {
    export enum UploadType {
        'UPLOAD' = "upload",
        'UNSPLASH' = "unsplash"
    }
    export interface IType {
        type: UploadType;
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
}
/// <amd-module name="@scom/scom-image/config/index.tsx" />
declare module "@scom/scom-image/config/index.tsx" {
    import { Module, ControlElement, Container } from '@ijstech/components';
    import "@scom/scom-image/config/index.css.ts";
    import { IImage } from "@scom/scom-image/interface.ts";
    interface ScomImageConfigElement extends ControlElement {
        cid?: string;
        url: string;
        photoId?: string;
        keyword?: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-image-config"]: ScomImageConfigElement;
            }
        }
    }
    export default class ScomImageConfig extends Module {
        private typeButton;
        private imageGrid;
        private typeModal;
        private typeStack;
        private unsplashPnl;
        private normalPnl;
        private imgEl;
        private pnlEditor;
        private pnlImage;
        private imgUploader;
        private imgLinkInput;
        private goButton;
        private searchInput;
        private typeList;
        private currentType;
        private typeMapper;
        private photoList;
        private selectedPhoto;
        private currentPage;
        private _data;
        private searchTimer;
        constructor(parent?: Container, options?: any);
        get data(): IImage;
        set data(value: IImage);
        get url(): string;
        set url(value: string);
        private renderType;
        private onTypeSelected;
        private updateCurrentType;
        private onShowType;
        private renderUI;
        private updateImg;
        private getImgSrc;
        private renderGrid;
        private onPhotoSelected;
        private onLoadMore;
        private onSearchPhoto;
        private onFetchPhotos;
        private renderPlaceholders;
        private onSurpriseClicked;
        private onToggleImage;
        private onGoClicked;
        private onChangedImage;
        private onReplaceImage;
        private onChangedLink;
        disconnectCallback(): void;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-image/crop/index.css.ts" />
declare module "@scom/scom-image/crop/index.css.ts" { }
/// <amd-module name="@scom/scom-image/crop/index.tsx" />
declare module "@scom/scom-image/crop/index.tsx" {
    import { Module, Container, ControlElement } from '@ijstech/components';
    import "@scom/scom-image/crop/index.css.ts";
    import { IImage, ICropData } from "@scom/scom-image/interface.ts";
    interface ScomImageCropElement extends ControlElement {
        url: string;
        cid?: string;
        cropData?: ICropData;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-image-crop']: ScomImageCropElement;
            }
        }
    }
    export default class ScomImageCrop extends Module {
        private _data;
        private _mouseDownPos;
        private _origWidth;
        private _origHeight;
        private _origLeft;
        private _origTop;
        private isResizing;
        private _cropType;
        private _isLockedRatio;
        private img;
        private pnlCropWrap;
        private pnlCropMask;
        private currentResizer;
        private ratioInput;
        private typeCombobox;
        private lockedCheck;
        private pnlResizeWrap;
        private _mouseMoveHandler;
        private _mouseUpHandler;
        private timer;
        private isShown;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomImageCropElement, parent?: Container): Promise<ScomImageCrop>;
        init(): void;
        protected _handleMouseDown(event: MouseEvent, stopPropagation?: boolean): boolean;
        private handleMouseMove;
        private onResize;
        private updatePosition;
        private resetCurrentPos;
        private updateDimension;
        private onMove;
        private validatePosition;
        private updateMaskImage;
        private getPercentValues;
        private handleMouseUp;
        get url(): string;
        set url(value: string);
        get cropData(): ICropData;
        set cropData(value: ICropData);
        get isCircleType(): boolean;
        get isFixedRatio(): boolean;
        get aspectRatio(): string;
        get data(): IImage;
        set data(value: IImage);
        private renderUI;
        private renderCropUI;
        private resetMask;
        private updateFormUI;
        private getImgSrc;
        onCrop(): void;
        private onTypeChanged;
        private renderTypeUI;
        private onInputChanged;
        private onLockChanged;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-image" />
declare module "@scom/scom-image" {
    import { Module, Container, ControlElement, VStack } from '@ijstech/components';
    import { ICropData } from "@scom/scom-image/interface.ts";
    import "@scom/scom-image/index.css.ts";
    interface ScomImageElement extends ControlElement {
        lazyLoad?: boolean;
        cid?: string;
        url: string;
        altText?: string;
        link?: string;
        cropData?: ICropData;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-image']: ScomImageElement;
            }
        }
    }
    export default class ScomImage extends Module {
        private data;
        private img;
        private pnlImage;
        private pnlImgWrap;
        private isInitedLink;
        tag: any;
        readonly onConfirm: () => Promise<void>;
        readonly onDiscard: () => Promise<void>;
        readonly onEdit: () => Promise<void>;
        defaultEdit?: boolean;
        validate?: () => boolean;
        edit: () => Promise<void>;
        confirm: () => Promise<void>;
        discard: () => Promise<void>;
        constructor(parent?: Container, options?: any);
        init(): void;
        static create(options?: ScomImageElement, parent?: Container): Promise<ScomImage>;
        get url(): string;
        set url(value: string);
        get altText(): string;
        set altText(value: string);
        get link(): string;
        set link(value: string);
        get cropData(): ICropData;
        set cropData(value: ICropData);
        getConfigurators(): {
            name: string;
            target: string;
            getActions: () => {
                name: string;
                icon: string;
                command: (builder: any, userInputData: any) => {
                    execute: () => void;
                    undo: () => void;
                    redo: () => void;
                };
                customUI: {
                    render: (data?: any, onConfirm?: (result: boolean, data: any) => void) => VStack;
                };
            }[];
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        }[];
        private getPropertiesSchema;
        private getThemeSchema;
        private _getActions;
        private getData;
        private setData;
        private updateImg;
        private updateCropUI;
        connectedCallback(): Promise<void>;
        private getTag;
        private setTag;
        private onImageClick;
        render(): any;
    }
}
