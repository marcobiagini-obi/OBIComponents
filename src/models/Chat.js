import MasterData from "./MasterData.js";

export default class Chat extends MasterData {

    owner = {};
    model = { note: "" };
    codice = '';
    members = [];
    messages = [];

    constructor(init) {
        super(init);
        if (init) Object.assign(this, init);
    }

}