import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

defineComponent({
    selector: "app-info",
    template: "<obi-button tool-item relevance='brand' icon @click='openInfo'><obi-icon nome='help'></obi-icon></obi-button > ",
    options: {
        inputs: ["href"],
        actions: {
            openInfo: function () {
                window.open(this.href, '_blank').focus();
            }
        }
    }
});