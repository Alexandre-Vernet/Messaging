export class User {
    constructor(id: string, firstName: string, lastName: string, email: string, profilePicture: string, dateCreation: Date) {
        this._id = id;
        this._firstName = firstName;
        this._lastName = lastName;
        this._email = email;
        this._profilePicture = profilePicture;
        this._dateCreation = dateCreation;
    }

    private _id: string;

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    private _firstName: string;

    get firstName(): string {
        return this._firstName;
    }

    set firstName(value: string) {
        this._firstName = value;
    }

    private _lastName: string;

    get lastName(): string {
        return this._lastName;
    }

    set lastName(value: string) {
        this._lastName = value;
    }

    private _email: string;

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    private _profilePicture: string;

    get profilePicture(): string {
        return this._profilePicture;
    }

    set profilePicture(value: string) {
        this._profilePicture = value;
    }

    private _dateCreation: Date;

    get dateCreation(): Date {
        return this._dateCreation;
    }

    set dateCreation(value: Date) {
        this._dateCreation = value;
    }
}
