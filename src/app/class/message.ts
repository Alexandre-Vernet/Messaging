import { File } from './file';
import { User } from './user';

export class Message {

    private _id: string;
    private _message: string;
    private _file: File;
    private _date: Date;
    private _user: User;

    constructor(id: string, message: string, file: File, date: Date, user: User) {
        this._id = id;
        this._message = message;
        this._file = file;
        this._date = date;
        this._user = user;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get message(): string {
        return this._message;
    }

    set message(value: string) {
        this._message = value;
    }

    get file(): File {
        return this._file;
    }

    set file(value: File) {
        this._file = value;
    }

    get date(): Date {
        return this._date;
    }

    set date(value: Date) {
        this._date = value;
    }

    get user(): User {
        return this._user;
    }

    set user(value: User) {
        this._user = value;
    }
}
