import { Component } from '@angular/core';

@Component({
    selector: 'app-head',
    templateUrl: './head.component.html',
    styleUrls: ['./head.component.scss']
})
export class HeadComponent {
    _rightPanel: boolean = false;

    rightPanel() {
        this._rightPanel = !this._rightPanel;
    }
}
