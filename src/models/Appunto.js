import MasterData from "./MasterData.js";

export default class Appunto extends MasterData {

    valore = "";
    colore = "warning";
    profilo = "";

    constructor(init = {}) {
        super(init);
        Object.assign(this, init);
    }

}