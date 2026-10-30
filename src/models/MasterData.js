import { initClass } from "../../core.js";
export default class MasterData {

    id = 0;
    nome = '';
    note = '';
    timeStamp = new Date();
    insertTime = new Date();
    idLastUser = 0;
    idOwner = 0;

    constructor(init = {}) {
        initClass.call(this, init);
    }
}