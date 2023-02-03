var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@image/main/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    components_1.Styles.cssRule('#pnlImage', {
        $nest: {
            '.custom-img img': {
                objectFit: 'cover',
                objectPosition: 'center',
                width: '100%',
                height: '100%',
                maxWidth: 'none',
                maxHeight: 'none'
            },
            '#imgLink span': {
                display: 'block'
            },
            ".angle": {
                zIndex: '200',
                position: 'absolute',
                width: '30px',
                height: '30px',
                background: 'black',
                clipPath: "polygon(0 0, 0 100%, 20% 100%, 20% 20%, 100% 20%, 100% 0)"
            },
            ".transform": {
                transformOrigin: "left top"
            },
            ".angle-nw:hover": {
                cursor: 'nw-resize',
                background: 'blue'
            },
            ".angle-ne:hover": {
                cursor: 'ne-resize',
                background: 'blue'
            },
            ".angle-sw:hover": {
                cursor: 'sw-resize',
                background: 'blue'
            },
            ".angle-se:hover": {
                cursor: 'se-resize',
                background: 'blue'
            },
            ".angle-ne": {
                transform: "rotate(90deg)"
            },
            ".angle-se": {
                transform: "rotate(180deg)"
            },
            ".angle-sw": {
                transform: "rotate(270deg)"
            },
            ".canvas": {
                zIndex: '180',
                position: 'absolute',
                top: '0px',
                left: '0px'
            },
            ".canvas-line": {
                zIndex: '190',
                position: 'absolute',
                top: '0px',
                left: '0px'
            }
        }
    });
});
define("@image/main", ["require", "exports", "@ijstech/components", "@image/main/index.css.ts"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ImageBlock = void 0;
    const configSchema = {
        type: 'object',
        required: [],
        properties: {
            width: {
                type: 'string',
            },
            height: {
                type: 'string',
            },
            position: {
                type: 'string',
                enum: ['left', 'center', 'right'],
            },
        },
    };
    let ImageBlock = class ImageBlock extends components_2.Module {
        constructor() {
            super(...arguments);
            this.data = {
                url: '',
                altText: '',
                backgroundColor: '',
                height: 0,
                width: 0,
                link: ''
            };
            this._oldX = 0;
            this._oldY = 0;
            this._oldWidth = 0;
            this._oldHeight = 0;
            this._oldLink = '';
            this._oldURl = '';
            this._oldAltText = '';
        }
        init() {
            super.init();
        }
        getConfigSchema() {
            return configSchema;
        }
        async getData() {
            return this.data;
        }
        async setData(value) {
            console.log('set data', value);
            this.data = value;
            const uploader = document.getElementById('uploader');
            const imageElm = uploader === null || uploader === void 0 ? void 0 : uploader.getElementsByTagName('img')[0];
            if (imageElm)
                imageElm.src = value.url;
            else
                this.edtLink.value = value.url;
            this.uploader.visible = false;
            this.linkStack.visible = false;
            this.img.visible = true;
            this.img.url = value.url;
            this.img.setAttribute('alt', value.altText || '');
        }
        getTag() {
            return this.tag;
        }
        async setTag(value) {
            this.tag = value;
            if (this.img) {
                this.img.display = 'flex';
                this.img.width = this.tag.width;
                this.img.height = this.tag.height;
                switch (this.tag.align) {
                    case 'left':
                        this.img.margin = { right: 'auto' };
                        break;
                    case 'center':
                        this.img.margin = { left: 'auto', right: 'auto' };
                        break;
                    case 'right':
                        this.img.margin = { left: 'auto' };
                        break;
                }
            }
            // if (backgroundColor)
            //     this.pnlImage.background.color = backgroundColor;
            // if (url)
            //     this.imgLink.link = new Link(this, { href: url, target: '_blank' })
        }
        saveImgData(x, y, width, height) {
            this._oldX = x;
            this._oldY = y;
            this._oldWidth = width;
            this._oldHeight = height;
        }
        getActions() {
            const actions = [
                {
                    name: 'Crop (Enter)',
                    icon: 'crop-alt',
                    command: (builder, userInputData) => {
                        return {
                            execute: () => {
                                if (!userInputData)
                                    return;
                                const { x, y, width, height } = this.img.getBoundingClientRect();
                                this.saveImgData(x, y, width, height);
                                const { x: newX, y: newY, width: newWidth, height: newHeight } = userInputData;
                                this.onCrop(newX, newY, newWidth, newHeight);
                            },
                            undo: () => {
                                if (!userInputData)
                                    return;
                                const { x, y, width, height } = this.img.getBoundingClientRect();
                                this.onCrop(this._oldX, this._oldY, this._oldWidth, this._oldHeight);
                                this.saveImgData(x, y, width, height);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: {
                        type: 'object',
                        properties: {
                            "x": {
                                type: 'number'
                            },
                            "y": {
                                type: 'number'
                            },
                            "width": {
                                type: 'number'
                            },
                            "height": {
                                type: 'number'
                            }
                        },
                    },
                },
                {
                    name: 'Insert Link',
                    icon: 'link',
                    command: (builder, userInputData) => {
                        return {
                            execute: () => {
                                this._oldLink = this.data.link;
                                this.data.link = userInputData;
                            },
                            undo: () => {
                                const _oldLink = this.data.link;
                                this.data.link = this._oldLink;
                                this._oldLink = _oldLink;
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: {
                        type: 'string',
                    },
                },
                {
                    name: 'Replace image',
                    icon: 'pencil-alt',
                    command: (builder, userInputData) => {
                        return {
                            execute: () => {
                                this._oldURl = this.data.url;
                                this.data.url = userInputData;
                            },
                            undo: () => {
                                const _oldURl = this.data.url;
                                this.data.url = this._oldURl;
                                this._oldURl = _oldURl;
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: {
                        type: 'string',
                    },
                },
                {
                    name: 'Add alt text',
                    icon: 'plus',
                    command: (builder, userInputData) => {
                        return {
                            execute: () => {
                                this._oldAltText = this.img.getAttribute('alt');
                                this.data.altText = userInputData.description;
                                this.img.setAttribute('alt', userInputData.description);
                            },
                            undo: () => {
                                const oldAltText = this.data.altText;
                                this.img.setAttribute('alt', this._oldAltText);
                                this.data.altText = this._oldAltText;
                                this._oldAltText = oldAltText;
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: {
                        type: 'object',
                        description: 'Alt text is accessed by screen readers for people who might have trouble seeing your content',
                        properties: {
                            "description": {
                                type: 'string'
                            }
                        }
                    }
                },
            ];
            return actions;
        }
        async edit() {
            if (!this.uploader)
                return;
            this._oldURl = this.img.url;
            this.img.visible = false;
            this.uploader.visible = true;
            this.linkStack.visible = true;
        }
        async onChangedImage(control, files) {
            if (files && files[0]) {
                this.data.url = (await this.uploader.toBase64(files[0]));
            }
            let img_uploader = this.uploader.getElementsByTagName('img')[0];
            this._oldURl = img_uploader.src;
            this.setData(Object.assign({}, this.data));
        }
        onRemovedImage(control, file) {
            this.data.url = this.edtLink.value || '';
            this._oldURl = this.edtLink.value || '';
        }
        onCrop(newX, newY, newWidth, newHeight) {
            let img_uploader = this.uploader.getElementsByTagName('img')[0];
            // originalImage in form of img
            const originalImage = document.createElement('img');
            if (this.img.url != undefined && this.img.url != null)
                originalImage.src = this.img.url;
            else
                originalImage.src = img_uploader.src || this.data.url;
            // create a new empty canvas
            let canvas = document.createElement('canvas');
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;
            const ctx = canvas.getContext('2d');
            var ptrn = ctx.createPattern(originalImage, 'no-repeat');
            ctx.fillStyle = ptrn;
            // converted the originalImage to canvas
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // set the canvas size to the new width and height
            canvas.width = newWidth;
            canvas.height = newHeight;
            // draw the image
            ctx.drawImage(originalImage, newX, newY, newWidth, newHeight, 0, 0, newWidth, newHeight);
            this.img.url = canvas.toDataURL();
            img_uploader.src = canvas.toDataURL();
        }
        onChangedLink(source) {
            const url = source.value;
            this.setData(Object.assign(Object.assign({}, this.data), { url }));
        }
        render() {
            return (this.$render("i-panel", null,
                this.$render("i-vstack", { id: 'pnlImage' },
                    this.$render("i-upload", { id: 'uploader', multiple: true, height: '100%', onChanged: this.onChangedImage, onRemoved: this.onRemovedImage }),
                    this.$render("i-label", { id: "imgLink", display: "block", maxHeight: "100%", maxWidth: "100%" },
                        this.$render("i-image", { id: 'img', visible: false, margin: { bottom: '1rem' }, maxHeight: "100%", maxWidth: "100%", class: "custom-img" })),
                    this.$render("i-panel", { id: 'linkStack' },
                        this.$render("i-label", { caption: 'URL' }),
                        this.$render("i-input", { id: 'edtLink', width: '100%', onChanged: this.onChangedLink.bind(this) })))));
        }
    };
    ImageBlock = __decorate([
        components_2.customModule
    ], ImageBlock);
    exports.ImageBlock = ImageBlock;
});
