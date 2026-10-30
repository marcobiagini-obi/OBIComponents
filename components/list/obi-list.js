import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

defineComponent({
    selector: "obi-list",
    template: `<div obi-list></div>`,
});

defineComponent({
    selector: "obi-list-component",
    template:
        `<test-template name='OBI DATA TABLE' description='' :code='code' :data='data'>
            <section actions slot='actions'>
                <obi-select :valore='size' label='Dimensioni' :opzioni='sizes'></obi-select>
                <obi-select :valore='lines' label='Righe' :opzioni='rows'></obi-select>
                <obi-checkbox button :valore='checkable' label='Selezionabile'></obi-select>
            </section>
        </test-template>`,
    options: {
        dataset: {
            data: {
                list: [
                    {
                        id: 0, nome: "Elemento 1",
                        descrizione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras quam massa, imperdiet ut lobortis in, faucibus at felis. Nam in lorem suscipit, placerat ipsum non, finibus leo.",
                        icon: "<obi-icon prepend nome='star'></obi-icon>",
                        checked: false
                    },
                    {
                        id: 1,
                        nome: "Elemento 2",
                        descrizione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras quam massa, imperdiet ut lobortis in, faucibus at felis. Nam in lorem suscipit, placerat ipsum non, finibus leo.",
                        icon: "<obi-icon prepend nome='star'></obi-icon>",
                        checked: false
                    },
                    {
                        id: 2,
                        nome: "Elemento 3",
                        descrizione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras quam massa, imperdiet ut lobortis in, faucibus at felis. Nam in lorem suscipit, placerat ipsum non, finibus leo.",
                        icon: "<obi-icon prepend nome='star'></obi-icon>",
                        checked: true
                    },
                ],
            },
            sizes: [
                { label: "Standard", value: "" },
                { label: "Medium", value: "md" },
                { label: "Large", value: "lg" },
                { label: "Extra Large", value: "xl" },
            ],
            size: "",
            rows: [
                { label: "Single", value: "" },
                { label: "Two Lines", value: "x2" },
                { label: "Three Lines", value: "x3" },
            ],
            lines: "",
            checkable: false,
        },
        computed: {
            code: function () {
                let _size = this.size ? " size='" + this.size + "'" : "";
                let _line = this.lines ? this.lines : "";
                let checkable = this.checkable ? "check" : "";

                return `<obi-list ${_size} ${_line}>
                    <list-item cmd-for='item in list'
                        :prepend='item.icon'
                        :testo='item.nome' :descrizione='item.descrizione'
                        ${checkable} :valore='item.checked'>
                    </list-item>
                </obi-list>`;
            },
        },
    }
});