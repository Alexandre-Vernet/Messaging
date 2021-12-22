export class File {

    private _name: string;
    private _url: string;
    private _type: string;

    constructor(name: string, url: string, type: string) {
        this._name = name;
        this._url = url;
        this._type = type;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get url(): string {
        return this._url;
    }

    set url(value: string) {
        this._url = value;
    }

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }
}

