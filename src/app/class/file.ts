export class File {
    private _path: string;
    private _date: Date;

    constructor(path: string, date: Date) {
        this._path = path;
        this._date = date;
    }

    /**
     * Getter path
     * @return {string}
     */
    public get path(): string {
        return this._path;
    }

    /**
     * Getter date
     * @return {Date}
     */
    public get date(): Date {
        return this._date;
    }

    /**
     * Setter path
     * @param {string} value
     */
    public set path(value: string) {
        this._path = value;
    }

    /**
     * Setter date
     * @param {Date} value
     */
    public set date(value: Date) {
        this._date = value;
    }

}
