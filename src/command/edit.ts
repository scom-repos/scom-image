import { Image } from "@ijstech/components";
import { ICommand } from "@image/global";

export class EditCommand implements ICommand {
  private element: Image;
  private _oldUrl: string;
  private _newUrl: string;

  constructor(element: Image, newUrl: string) {
    this.element = element;
    this._oldUrl = element.url;
    this._newUrl = newUrl;
  }

  execute(): void {
    this.element.url = this._newUrl;
  }

  undo(): void {
    this.element.url = this._oldUrl;
  }

  redo(): void {}
}
