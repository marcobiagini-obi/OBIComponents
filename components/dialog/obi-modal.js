import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

defineComponent({
    selector: "obi-modal",
    template:
        `<div obi-modal :display='$.display != null'>
            <div modal-header>
                <obi-button @click='close' relevance='neutral' icon><obi-icon nome='close'></obi-icon></obi-button>
            </div>
        </div>`,
    options: {
        dataset: {
            display: null,
        },
        inputs: ["display"],
        computed: {
            focus: function () {
                return this.__element.hasAttribute("focus");
            }
        },
        actions: {
            open: function () {
                if (this.focus && !this.display) {
                    let _focus = document.createElement("div");
                    _focus.setAttribute("modal-focus", "");
                    _focus.onclick = () => { this.close(); };
                    document.body.appendChild(_focus);
                }
                this.display = true;
            },
            close: function () {
                let _focus = document.querySelectorAll("div[modal-focus]");
                _focus.forEach(f => f.remove());
                this.display = null;
                this.__node.trigger("close", this.__node);
            },
            toggle: function () {
                if (this.display) {
                    this.close();
                } else {
                    this.open();
                }
            }
        }
    }
});