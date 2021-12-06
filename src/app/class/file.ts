import {User} from './user';

export class File {
    private _id: string;
    private _name: string;
    private _url: string;
    private _extension: string;
    private _size: number;
    private _addBy: User;
    private _date: Date;

    constructor(
        id: string,
        name: string,
        url: string,
        extension: string,
        size: number,
        addBy: User,
        date: Date
    ) {
        this._id = id;
        this._name = name;
        this._url = url;
        this._extension = extension;
        this._size = size;
        this._addBy = addBy;
        this._date = date;
    }

    /**
     * Getter id
     * @return {string}
     */
    public get id(): string {
        return this._id;
    }

    /**
     * Getter name
     * @return {string}
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Getter url
     * @return {string}
     */
    public get url(): string {
        return this._url;
    }

    /**
     * Getter extension
     * @return {string}
     */
    public get extension(): string {
        return this._extension;
    }

    /**
     * Getter size
     * @return {number}
     */
    public get size(): number {
        return this._size;
    }

    /**
     * Getter addBy
     * @return {User}
     */
    public get addBy(): User {
        return this._addBy;
    }

    /**
     * Getter date
     * @return {Date}
     */
    public get date(): Date {
        return this._date;
    }

    /**
     * Setter id
     * @param {string} value
     */
    public set id(value: string) {
        this._id = value;
    }

    /**
     * Setter name
     * @param {string} value
     */
    public set name(value: string) {
        this._name = value;
    }

    /**
     * Setter url
     * @param {string} value
     */
    public set url(value: string) {
        this._url = value;
    }

    /**
     * Setter extension
     * @param {string} value
     */
    public set extension(value: string) {
        this._extension = value;
    }

    /**
     * Setter size
     * @param {number} value
     */
    public set size(value: number) {
        this._size = value;
    }

    /**
     * Setter addBy
     * @param {User} value
     */
    public set addBy(value: User) {
        this._addBy = value;
    }

    /**
     * Setter date
     * @param {Date} value
     */
    public set date(value: Date) {
        this._date = value;
    }
}
