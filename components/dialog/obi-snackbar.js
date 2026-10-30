import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

defineComponent({
    selector: "obi-snack",
    template:
        `<div obi-snack>
            <span cmd-if='$.icona' class='material-symbols-outlined'>{{icona}}</span>
            <span cmd-model='messaggio'></span>
            <ref id='actions'></ref>
        </div>`,
    options: {
        dataset: {
            show: true
        },
        inputs: ["messaggio", "icona", "timer"],
        actions: {
            closeSnack: function () {
                this.show = false;
                let _focus = document.querySelectorAll("div[modal-focus]");
                _focus.forEach(f => f.remove());
            }
        }
    }
});