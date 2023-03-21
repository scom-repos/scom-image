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
/// <amd-module name="@scom/scom-image/index.css.ts" />
declare module "@scom/scom-image/index.css.ts" { }
/// <amd-module name="@scom/scom-image/scconfig.json.ts" />
declare module "@scom/scom-image/scconfig.json.ts" {
    const _default: {
        name: string;
        version: string;
        env: string;
        moduleDir: string;
        main: string;
        modules: {
            "@pageblock-image/main": {
                path: string;
            };
            "@pageblock-image/global": {
                path: string;
            };
            "@pageblock-image/command": {
                path: string;
            };
            "@pageblock-image/store": {
                path: string;
            };
        };
        ipfsGatewayUrl: string;
    };
    export default _default;
}
/// <amd-module name="@scom/scom-image" />
declare module "@scom/scom-image" {
    import { Module, IDataSchema, Container, ControlElement } from '@ijstech/components';
    import { IImage, PageBlock } from "@scom/scom-image/interface.ts";
    import "@scom/scom-image/index.css.ts";
    interface ScomImageElement extends ControlElement {
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
    export default class ScomImage extends Module implements PageBlock {
        private data;
        private oldData;
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
        private _oldURl;
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
        getConfigSchema(): {
            type: string;
            required: any[];
            properties: {
                width: {
                    type: string;
                };
                height: {
                    type: string;
                };
            };
        };
        getData(): IImage;
        private updateImg;
        setData(value: IImage): Promise<void>;
        private setLink;
        connectedCallback(): Promise<void>;
        getTag(): any;
        setTag(value: any): Promise<void>;
        getActions(): {
            name: string;
            icon: string;
            command: (builder: any, userInputData: any) => {
                execute: () => void;
                undo: () => void;
                redo: () => void;
            };
            userInputDataSchema: IDataSchema;
        }[];
        checkValidation(value: IImage): boolean;
        private onCrop;
        private onChangedImage;
        private onRemovedImage;
        private onChangedLink;
        render(): any;
    }
}
