import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { openFloatingMenu, closeFloatingItems } from "../../LAMP/RenderModule/components/float.component/float.component.js";

defineComponent({
    selector: "app-search",
    template: `<float-container app-search>
            <group-component>
                <input type='text' cmd-model='value' :placeholder='label' @focus='showOptions' @keyup='startShortcut'/>
                <obi-button icon @click='search'><obi-icon nome='search'></obi-icon></obi-button>
            </group-component>
            <obi-list size='sm' x3 floating-item='fullwidth' interact variant='elevated'>
                <list-item float-toggle cmd-for='item in opzioni'
                    :value='$.item.value' @click='select'
                    cmd-filter='item.content.toLowerCase().includes($.value.toLowerCase())'
                    :testo='item.title'
                    :descrizione='$.searchText($.item.content)'></list-item>
            </obi-list>
    </float-container>`,
    options: {
        inputs: ["opzioni", "label"],
        dataset: {
            value: "",
            label: "Ricerca",
            opzioni: [],
        },
        actions: {
            select(evt) {
                this.__node.trigger("appsearch", evt.currentTarget.getAttribute("value"));
            },
            search(evt) {
                if (this.value) {
                    this.__node.trigger("appsearch", this.value);
                    this.value = "";
                } else {
                    this.showOptions();
                }
            },
            showOptions() {
                var element = this.__node.getChildContext("[floating-item]").__element;
                if (this.value) {
                    if (element.getAttribute("[floating-item]") != "show") openFloatingMenu(element);
                } else {
                    this.__element.setAttribute("float-container", "hide");
                }
            },
            startShortcut: function (evt) {
                let _keycode = evt.which || evt.keyCode || event.charCode;
                if (_keycode === 13) {
                    this.search();
                } else {
                    this.showOptions();
                }
            },
            searchText(text) {
                let index = text.toLowerCase().indexOf(this.value.toLowerCase());
                return text.replaceAll(this.value, `<mark>${this.value}</mark>`).substring(index, index + 100) + "...";
            }
        }
    }
});