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
    }
}
/// <amd-module name="@scom/scom-image/store.ts" />
declare module "@scom/scom-image/store.ts" {
    export const state: {
        ipfsGatewayUrl: string;
    };
    export const setDataFromSCConfig: (options: any) => void;
    export const setIPFSGatewayUrl: (url: string) => void;
    export const getIPFSGatewayUrl: () => string;
}
/// <amd-module name="@scom/scom-image/data.json.ts" />
declare module "@scom/scom-image/data.json.ts" {
    const _default: {
        ipfsGatewayUrl: string;
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
/// <amd-module name="@scom/scom-image/assets.ts" />
declare module "@scom/scom-image/assets.ts" {
    function fullPath(path: string): string;
    const _default_2: {
        fullPath: typeof fullPath;
    };
    export default _default_2;
}
/// <amd-module name="@scom/scom-image/config/interface.ts" />
declare module "@scom/scom-image/config/interface.ts" {
    export enum UploadType {
        'UPLOAD' = "upload",
        'UNPLASH' = "unsplash"
    }
    export interface IType {
        type: UploadType;
        caption: string;
        icon: any;
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
        altText?: string;
        link?: string;
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
        private searchInput;
        private imageGrid;
        private typeModal;
        private typeStack;
        private unsplashPnl;
        private normalPnl;
        private imgUploader;
        private imgLinkInput;
        private goBtn;
        private typeList;
        private currentType;
        private typeMapper;
        private _data;
        constructor(parent?: Container, options?: any);
        get data(): IImage;
        set data(value: IImage);
        get url(): string;
        set url(value: string);
        get altText(): string;
        set altText(value: string);
        get link(): string;
        set link(value: string);
        private renderType;
        private renderUI;
        private renderGrid;
        private renderUploader;
        private onTypeSelected;
        private onShowType;
        private onSurpriseClicked;
        private onGoClicked;
        private onChangedImage;
        private onRemovedImage;
        private onReplaceImage;
        private onChangedLink;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-image" />
declare module "@scom/scom-image" {
    import { Module, Container, ControlElement, VStack } from '@ijstech/components';
    import "@scom/scom-image/index.css.ts";
    interface ScomImageElement extends ControlElement {
        lazyLoad?: boolean;
        cid?: string;
        url: string;
        altText?: string;
        link?: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ["i-scom-image"]: ScomImageElement;
            }
        }
    }
    export default class ScomImage extends Module {
        private data;
        private uploader;
        private img;
        private linkStack;
        private edtLink;
        private pnlImage;
        private imgLink;
        private newCropData;
        private oldCropData;
        private originalUrl;
        private isReset;
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
        private toggleEditMode;
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
        private setLink;
        connectedCallback(): Promise<void>;
        private getTag;
        private setTag;
        private onCrop;
        private onChangedImage;
        private onRemovedImage;
        private onChangedLink;
        render(): any;
    }
}
