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
        canUpload?: boolean;
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
    import { Module, Container, ControlElement } from '@ijstech/components';
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
    type executeFnType = (editor: any, block: any) => void;
    interface BlockSpecs {
        addBlock: (blocknote: any, executeFn: executeFnType, callbackFn?: any) => {
            block: any;
            slashItem: any;
        };
    }
    export default class ScomImage extends Module implements BlockSpecs {
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
        addBlock(blocknote: any, executeFn: executeFnType, callbackFn?: any): {
            block: any;
            slashItem: {
                name: string;
                execute: (editor: any) => void;
                aliases: string[];
                group: string;
                icon: {
                    name: string;
                };
                hint: string;
            };
            moduleData: {
                name: string;
                localPath: string;
            };
        };
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
        getConfigurators(): ({
            name: string;
            target: string;
            getActions: () => any[];
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        } | {
            name: string;
            target: string;
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
            getActions?: undefined;
        })[];
        private _getActions;
        private getWidgetSchemas;
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
