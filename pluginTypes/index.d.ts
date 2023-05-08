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
    import { Module, Container, ControlElement } from '@ijstech/components';
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
    export default class ScomImage extends Module {
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
        private toggleEditMode;
        getConfigurators(): {
            name: string;
            target: string;
            getActions: any;
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        }[];
        private getData;
        private updateImg;
        private setData;
        private setLink;
        connectedCallback(): Promise<void>;
        private getTag;
        private setTag;
        private getEmbedderActions;
        private getActions;
        private _getActions;
        private checkValidation;
        private onCrop;
        private onChangedImage;
        private onRemovedImage;
        private onChangedLink;
        render(): any;
    }
}
