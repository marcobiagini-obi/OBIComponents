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


defineComponent({
    selector: "obi-sideview-component",
    template:
        `<test-template name='OBI SIDE VIEW' description='' :code='code' :data='data'>
            <div slot='actions' actions>
                <obi-checkbox button :valore='display' label='Espandi'></obi-checkbox>
            </div>
        </test-template>`,
    options: {
        dataset: {
            data: { display: null, },
        },
        computed: {
            code: function () {
                return `
<div display-row flex-size="1" style='height: 200px;>
    <obi-sideview relevance='secondary' variant='elevated' :display='display' rounded'>
        <label padding='sm' font-type='button'>SideView Opened</label>
    </obi-sideview>
    <div flex-size="1"></div>
</div>`;
            },
        },
    }
});