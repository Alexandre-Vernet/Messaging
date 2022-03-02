export class User {

    private _id: string;
    private _firstName: string;
    private _lastName: string;
    private _email: string;
    private _profilePicture: string;
    private _dateCreation: Date;

    constructor(id: string, firstName: string, lastName: string, email: string, profilePicture: string, dateCreation: Date) {
        this._id = id;
        this._firstName = firstName;
        this._lastName = lastName;
        this._email = email;
        this._profilePicture = profilePicture;
        this._dateCreation = dateCreation;
    }


    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
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

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get profilePicture(): string {
        return this._profilePicture;
    }

    set profilePicture(value: string) {
        this._profilePicture = value;
    }

    get dateCreation(): Date {
        return this._dateCreation;
    }

    set dateCreation(value: Date) {
        this._dateCreation = value;
    }
}
