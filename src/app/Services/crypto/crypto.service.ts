import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root',
})
export class CryptoService {
    secretKey: string =
        'gg>OG]f6AAX7h&%U3EZF((v9MLVNgTBrtoStVEdDy*92\'m5;4d"D`8~cyhoT.FQF$Xfr:KDSL?';

    constructor() {}

    encrypt(value: string): string {
        return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
    }

    decrypt(textToDecrypt: string) {
        return CryptoJS.AES.decrypt(
            textToDecrypt,
            this.secretKey.trim()
        ).toString(CryptoJS.enc.Utf8);
    }
}
