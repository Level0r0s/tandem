import { Observable } from "@tandem/common/observable";
import { MetadataChangeAction } from "@tandem/common/actions";

export class Metadata extends Observable {
  constructor(private _data: any = {}) {
    super();
  }

  get data() {
    return this._data;
  }

  set data(value) {
    this._data = value;
  }

  get(key: string) {
    return this._data[key];
  }

  toggle(key: string) {
    const v = this.get(key);
    this.set(key, v == null ? true : !v);
    return this.get(key);
  }

  set(key: string, value: any) {
    const oldValue = this.get(key);
    this._data[key] = value;

    if (value !== oldValue) {
      this.notify(new MetadataChangeAction(key, value));
    }
  }
}