export class Message {

    private _email: string;
    private _firstName: string;
    private _lastName: string;
    private _message: string;
    private _image: string;
    private _date: Date;


    constructor(email: string, firstName: string, lastName: string, message: string, image: string, date: Date) {
        this._email = email;
        this._firstName = firstName;
        this._lastName = lastName;
        this._message = message;
        this._image = image;
        this._date = date;
    }


    /**
     * Getter email
     * @return {string}
     */
    public get email(): string {
        return this._email;
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
     * Getter message
     * @return {string}
     */
    public get message(): string {
        return this._message;
    }

    /**
     * Getter image
     * @return {string}
     */
    public get image(): string {
        return this._image;
    }

    /**
     * Getter date
     * @return {Date}
     */
    public get date(): Date {
        return this._date;
    }

    /**
     * Setter email
     * @param {string} value
     */
    public set email(value: string) {
        this._email = value;
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
     * Setter message
     * @param {string} value
     */
    public set message(value: string) {
        this._message = value;
    }

    /**
     * Setter image
     * @param {string} value
     */
    public set image(value: string) {
        this._image = value;
    }

    /**
     * Setter date
     * @param {Date} value
     */
    public set date(value: Date) {
        this._date = value;
    }

}
