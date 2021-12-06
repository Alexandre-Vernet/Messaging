export class Message {

    private _id: string;
    private _email: string;
    private _firstName: string;
    private _lastName: string;
    private _message: string;
    private _file: string;
    private _date: Date;


    constructor(id: string, email: string, firstName: string, lastName: string, message: string, file: string, date: Date) {
        this._id = id;
        this._email = email;
        this._firstName = firstName;
        this._lastName = lastName;
        this._message = message;
        this._file = file;
        this._date = date;
    }


    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get firstName(): string {
        return this._firstName;
    }

    set firstName(value: string) {
        this._firstName = value;
    }

    get lastName(): string {
        return this._lastName;
    }

    set lastName(value: string) {
        this._lastName = value;
    }

    get message(): string {
        return this._message;
    }

    set message(value: string) {
        this._message = value;
    }

    get file(): string {
        return this._file;
    }

    set file(value: string) {
        this._file = value;
    }

    get date(): Date {
        return this._date;
    }

    set date(value: Date) {
        this._date = value;
    }
}
