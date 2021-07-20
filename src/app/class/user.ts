export class User {
    private _firstName: string;
    private _lastName: string;
    private _email: string;
    private _dateCreation: Date;

    constructor(
        firstName: string,
        lastName: string,
        email: string,
        dateCreation: Date
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.dateCreation = dateCreation;
    }

    /**
     * Getter firstName
     * @return {string}
     */
    public get firstName(): string {
        return this._firstName;
    }

    /**
     * Getter lastName
     * @return {string}
     */
    public get lastName(): string {
        return this._lastName;
    }

    /**
     * Getter email
     * @return {string}
     */
    public get email(): string {
        return this._email;
    }

    /**
     * Getter dateCreation
     * @return {Date}
     */
    public get dateCreation(): Date {
        return this._dateCreation;
    }

    /**
     * Setter firstName
     * @param {string} value
     */
    public set firstName(value: string) {
        this._firstName = value;
    }

    /**
     * Setter lastName
     * @param {string} value
     */
    public set lastName(value: string) {
        this._lastName = value;
    }

    /**
     * Setter email
     * @param {string} value
     */
    public set email(value: string) {
        this._email = value;
    }

    /**
     * Setter dateCreation
     * @param {Date} value
     */
    public set dateCreation(value: Date) {
        this._dateCreation = value;
    }
}
