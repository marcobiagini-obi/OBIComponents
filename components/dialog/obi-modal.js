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


defineComponent({
    selector: "obi-modal-component",
    template:
        `<test-template name='OBI MODAL' description='' :code='code' :data='data'>
            <section actions slot='actions'>
                <obi-button @click="$.display = !$.display" relevance="primary">SHOW MODAL</obi-button>
                <obi-select :opzioni='dimensioni' :valore='size' label='Dimensioni'></obi-select>
                <obi-checkbox label='Focus' :valore='focus' button></obi-checkbox>
            </section>
        </test-template>`,
    options: {
        dataset: {
            data: { lorem_ipsum: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras quam massa, imperdiet ut lobortis in, faucibus at felis. Nam in lorem suscipit, placerat ipsum non, finibus leo." },
            focus: false,
            dimensioni: [
                { label: "standard", value: null },
                { label: "file", value: "file" },
                { label: "large", value: "large" },
                { label: "cover", value: "cover" }],
            size: "",
            display: false,
        },
        computed: {
            code: function () {
                let _focus = this.focus ? "focus" : "";
                let _size = this.size ? `size='${this.size}'` : "";
                return `<obi-modal id='test_modal' ${_focus} ${_size} ${this.display ? "display" : ""}>
    <obi-card titolo='Titolo Modale' :corpo='lorem_ipsum'></obi-card>
</obi-modal>`;
            },
        },
    }
});