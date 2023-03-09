define("@pageblock-image/command/edit.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EditCommand = void 0;
    class EditCommand {
        constructor(element, newUrl) {
            this.element = element;
            this._oldUrl = element.url;
            this._newUrl = newUrl;
        }
        execute() {
            this.element.url = this._newUrl;
        }
        undo() {
            this.element.url = this._oldUrl;
        }
        redo() { }
    }
    exports.EditCommand = EditCommand;
});
define("@pageblock-image/command", ["require", "exports", "@pageblock-image/command/edit.ts"], function (require, exports, edit_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EditCommand = void 0;
    Object.defineProperty(exports, "EditCommand", { enumerable: true, get: function () { return edit_1.EditCommand; } });
});
