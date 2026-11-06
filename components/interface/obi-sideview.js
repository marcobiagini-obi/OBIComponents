import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

defineComponent({
    selector: "obi-sideview",
    template: `
        <div obi-sideview :display='display'></div>
    `,
    options: {
        dataset: {
        },
        inputs: [],
        computed: {
            display: function () { return this.__element.hasAttribute("display"); },
        },
        actions: {
            open: function () {
                this.__element.setAttribute("display", "");
            },
            close: function () {
                this.__element.removeAttribute("display");
            },
            toggle: function () {
                if (this.display) {
                    this.closeModal();
                } else {
                    this.showModal();
                }
            }
        }
    }
});