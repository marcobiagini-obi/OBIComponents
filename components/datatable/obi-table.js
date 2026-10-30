import Service from '../../LAMP/ServerModule/LampService.js';
import { Support } from '../../LAMP/RenderModule/modules/library.js';
import { vNode } from '../../LAMP/RenderModule/modules/virtualizer.js';
import { defineComponent } from '../../LAMP/RenderModule/LampRender.js';
import { Collection } from '../../LAMP/RenderModule/modules/enumerators.js';
import { obiStampDate, obiLoader, obiAlert } from '../../core.js';
import Perform from '../../src/performanceWatcher.js';
import APIGetter from "../../src/models/APIGetter.js";

export const columnTypes = {
    icon: "icon",
    image: "image",
    code: "code",
    currency: "currency",
    datetime: "datetime",
    number: "number",
    function: "function",
    boolean: "boolean",
    array: "array",
    select: "select",
    link: "link"
}

defineComponent({
    selector: 'obi-table',
    template: `<div obi-table>
            <slot name='filtro'></slot>
            <div table-filters margin-updown='sm'>
                <obi-chip cmd-if='Array.isArray($.listaFiltri) && $.listaFiltri.length > 0' :relevance='danger' @click='cleanFilters' interactable><obi-icon nome='remove'></obi-icon></obi-chip>
                <obi-chip cmd-for='filter in filterLabels' :relevance="$.filter.temp ? 'neutral' : 'tertiary'" :label='filter.label' @click='$.onFilterChipsClick($.filter)' :prepend="$.filter.temp ? 'check_indeterminate_small' : 'close'" interactable></obi-chip>
            </div>
            <div table-data-container>
                <table>
                    <thead>
                        <tr>
                            <th cmd-for="item in colonne" :name='$.item.name || $.item' @click='sort'>
                            <div cmd-if='$.item.type && $.item.type == "select"'>
                                <obi-icon :nome='$.someSelected ? "indeterminate_check_box" : "check_box_outline_blank"'
                                    :text-color='$.someSelected ? "primary" : ""'
                                    @click='selectAll'>
                                </obi-icon>
                            </div>
                            <div cmd-else>
                                <span prepend cmd-if='$.isAsc($.item.name || $.item)' class='material-symbols-outlined'>arrow_drop_up</span>
                                <span prepend cmd-elseif='$.isDesc($.item.name || $.item)' class='material-symbols-outlined'>arrow_drop_down</span>
                                {{$.item.label == null ? $.item : $.item.label}}
                            </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        <div table-pager>
            <group-component>
                <obi-button icon @click='firstPage' :disabled='$.page<=0'><obi-icon nome='first_page'></icon></obi-button>
                <obi-button icon @click='prevPage' :disabled='$.page<=0'><obi-icon nome='navigate_before'></icon></obi-button>
                <obi-button icon @click='nextPage' :disabled='$.page>=$.last_page'><obi-icon nome='navigate_next'></icon></obi-button>
                <obi-button icon @click='lastPage' :disabled='$.page>=$.last_page'><obi-icon nome='last_page'></icon></obi-button>
            </group-component>
            <span>{{($.count_first + 1) + " - " + $.count_last + " su " + $.count}}</span>
            <obi-select :valore='righe' :opzioni='countOptions' @changed='update'></obi-select>
            <obi-button cmd-if='noResultFilter' title='cerca sul server' label='Carica Altro' append='database_search' @click='searchOnServer' relevance='tertiary'></obi-button>
        </div>
    </div>`,
    options: {
        inputs: ['colonne', 'dati', 'chiave', 'ordine', "righe", "filtro", "src", "shorts", "modello"],
        dataset: {
            id: Support.uniqueID(),
            dati: [],
            page: 0,
            righe: 25,
            count: 0,
            direzione: "",
            ordine: "",
            listaFiltri: [],
            countOptions: [
                { label: "5", value: 5 },
                { label: "10", value: 10 },
                { label: "25", value: 25 },
                { label: "50", value: 50 },
                { label: "100", value: 100 },
            ],
            noResultFilter: false,
            shorts: [],
            activeRows: [],
        },
        storage: {
            datatable: [],
            view: [],
            elaboratedData: [],
        },
        computed: {
            last_page: function () { return Math.ceil(this.count / this.righe) - 1; },
            count_first: function () {
                let _first = this.page * this.righe;
                return _first > this.count ? 0 : this.page * this.righe;
            },
            count_last: function () {
                return this.count_first + Number(this.righe) <= this.count ? this.count_first + Number(this.righe) : this.count;
            },
            filterLabels: function () {
                let labels = [];
                if (this.filtro && Object.values(this.filtro).some(v => v)) {
                    for (const key of Object.keys(this.filtro)) {
                        let value = this.filtro[key];
                        if (value && !this.shorts.includes(key)) labels.push({ label: `${formatKeyLabel(key)}: ${value}`, key: key, value: value, temp: true });
                    }
                }
                if (Array.isArray(this.listaFiltri)) {
                    for (const item of this.listaFiltri) {
                        let keys = Object.keys(item);
                        for (const key of keys) {
                            let value = Reflect.get(item, key);
                            if (!this.shorts.includes(key)) labels.push({ label: `${formatKeyLabel(key)}: ${value}`, key: key, value: value, temp: false });
                        }
                    }
                }
                return labels;

                function formatKeyLabel(key) {
                    let keyLabel = key.replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll("_", " ");
                    return keyLabel.replace(/\b\w/g, c => c.toUpperCase());
                }
            },
            allFilters: function () {
                let filters = Array.from(this.listaFiltri);
                if (this.filtro) filters.push(JSON.parse(JSON.stringify(this.filtro)));
                return filters;
            },
            someSelected: function () {
                return this.getSelected().length > 0;
                // let column = this.colonne.find(c => c.type == columnTypes.select);
                // if (column == null) return false;
                // let filters = getFilter(this.listaFiltri);
                // if (Object.keys(filters).length > 0)
                //     return !this.dati.filter(item => checkFilter(item, filters)).some(s => s[column.name] == false);
                // return this.dati && this.dati.some(s => s[column.name] == true);
            }
        },
        actions: {
            /** Aggiorna i dati della tabella con animazione di caricamento */
            load() {
                obiLoader(async () => { await this.update(); }, this.__node);
            },
            /** Aggiorna i dati della tabella */
            async update(...rowdata) {
                if (rowdata == null || rowdata.length == 0) {
                    this.__storage.datatable = this.modello && typeof this.modello?.constructor == "function" ?
                        this.dati.map(r => new this.modello.constructor(r)) :
                        Support.deepClone(this.dati);
                } else {
                    if (!this.chiave) { obiAlert("Impostare una chiave per aggiornare la riga", { type: "warning" }); return; }
                    for (let item of rowdata) {
                        let clone = this.modello && typeof this.modello?.constructor == "function" ? new this.modello.constructor(item) : Support.deepClone(item);
                        let index = clone && Array.isArray(this.__storage.datatable) ? this.__storage.datatable.findIndex(e => e[this.chiave] == clone[this.chiave]) : -1;
                        if (index > -1) this.__storage.datatable.splice(index, 1, clone); else this.__storage.datatable.push(clone);
                    }
                }
                await this.updateView();
            },
            async updateView(rowdata = null) {
                let row_element = rowdata && this.chiave ? this.__element.querySelector(`tr[value='${rowdata[this.chiave]}']`) : null;
                if (row_element) {
                    let row = this.buildRow(this.__storage.datatable.find(e => e[this.chiave] === rowdata[this.chiave]));
                    row_element.replaceWith(row);
                    this.__storage.view.map(e => e[this.chiave] == rowdata[this.chiave] ? rowdata : e);
                } else {
                    this.__storage.elaboratedData = await this.elaborateData(this.__storage.datatable);
                    let viewList = this.getViewData(this.__storage.elaboratedData);
                    this.__node.trigger("dataview", viewList);
                    this.renderTable(viewList);
                    this.__storage.view = viewList;
                    this.noResultFilter = this.src && this.allFilters.length > 0;
                }
            },
            getViewData(data) {
                if (!data) return [];
                this.count = data.length;
                return data.slice(this.count_first, this.count_last);
            },
            firstPage() {
                this.page = 0;
                this.updateView();
            },
            lastPage() {
                this.page = this.last_page;
                this.updateView();
            },
            nextPage() {
                if (this.count_last < this.count) this.page += 1;
                this.updateView();
            },
            prevPage() {
                if (this.page > 0) this.page -= 1;
                this.updateView();
            },
            sort(evt) {
                let _element = evt.currentTarget;
                let _sort = _element.getAttribute("name");
                if (this.ordine == _sort) {
                    switch (this.direzione) {
                        case "desc":
                            this.ordine = this.chiave || "";
                            this.direzione = "";
                            break;
                        case "asc": this.direzione = "desc"; break;
                        default: this.direzione = "asc"; break;
                    }
                } else {
                    this.ordine = _sort
                    this.direzione = "asc";
                }
                this.updateView();
            },
            triggerRowClick(evt) {
                let _target = evt.currentTarget;
                let _value = _target.getAttribute("value");
                this.__node.trigger("rowclick", this.dati.find(e => e[this.chiave] == _value));
            },
            isAsc(col) {
                return this.direzione == "asc" && col == this.ordine;
            },
            isDesc(col) {
                return this.direzione == "desc" && col == this.ordine;
            },
            addFilter(item) {
                let newFilter = {};

                for (const key of Object.keys(item)) {
                    let isValued = item[key] != null && item[key] != "" && item[key] != 0;
                    let isAlreadyFiltered = this.listaFiltri.some(f => f[key] === item[key]);
                    if (isValued && !isAlreadyFiltered) newFilter[key] = item[key];
                }
                if (Object.keys(newFilter).length) {
                    this.listaFiltri.push(newFilter);
                    this.refreshFilter();
                }
            },
            removeFilter(item) {
                if (item != null) {
                    let index = this.listaFiltri.findIndex(f => f[item.key] === item.value);
                    this.listaFiltri[index][item.key] = null;
                    if (index > -1 && !Object.values(this.listaFiltri[index]).some(v => v)) {
                        this.listaFiltri.splice(index, 1);
                    }
                    this.refreshFilter();
                }
                else {
                    this.cleanFilters();
                }
            },
            onFilterChipsClick(filter) {
                if (filter == null) return;
                if (filter.temp) {
                    this.addFilter({ [filter.key]: filter.value });
                    this.filtro[filter.key] = "";
                } else {
                    this.removeFilter(filter);
                }
            },
            cleanFilters() {
                this.listaFiltri = [];
                this.refreshFilter();
                this.__node.trigger("cleanfilter");
            },
            refreshFilter() {
                this.updateView();
                if (this.__element.hasAttribute("cache-id"))
                    sessionStorage.setItem(this.__element.getAttribute("cache-id"), JSON.stringify(this.listaFiltri));
            },
            async filterData(listaDati) {
                let filters = getFilter(this.allFilters);
                if (Object.keys(filters).length > 0)
                    Perform.measure(() => { listaDati = listaDati.filter(item => checkFilter(item, filters)) }, "OBI-TABLE.filter");
                return listaDati;
            },
            async sortData(listaDati) {
                if (this.ordine) Perform.measure(() => { listaDati = listaDati.sort((Support.dynamicSort(this.ordine, this.direzione == "desc"))) }, "OBI-TABLE.sort");
                return listaDati;
            },
            export(filename = "report", options = null) {
                var csv = "";
                //#region HEADERS
                var columns = (options && options.labels) || this.colonne || Object.keys(this.dati[0]) || []; //ottengo la lista di colonne
                if (options && options.displayLabels) { //controllo se le colonne vanno stampate
                    let row = ""; //stampo le colonne
                    for (const item of columns) {
                        let column = item.label || item;
                        row += `${column};`;
                    }
                    csv += `${row.slice(0, row.length - 1)}\r\n`; //aggiungo la riga alla tabella
                }
                //#endregion
                //#region DATA
                //ottengo la lista dei dati
                this.filterData(this.__storage.datatable).then(async (filteredData) => {
                    this.sortData(filteredData).then((data) => {
                        for (const item of data) {
                            let row = "";//stampo i dati
                            for (const col of columns) {
                                let value = Reflect.get(item, col.name || col); //ottengo il valore
                                if (!(options && options.cleanData)) { //controllo se il valore va formattato
                                    if (typeof col == "object" && "format" in col && typeof col.format == "function") { //controllo se è stata specificata una formattazione
                                        value = col.format.call(this, value);
                                    }
                                    else { //formatto il valore in base alle impostazioni del componente
                                        this.__node.settings && "formatters" in this.__node.settings ? Support.format(value, this.__node.settings.formatters) : value;
                                    }
                                }
                                row += `${value};`; //stampo il valore nella riga
                            }
                            csv += `${row.slice(0, row.length - 1)}\r\n`; //aggiungo la riga alla tabella
                        }

                        //#region FILE
                        //rimuovo gli spazi e li sostituisco con underscore
                        filename = filename.replace(/ /g, "_");
                        //decodifico il csv in un indirizzo uri
                        var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);

                        //creo un nuovo elemento hypertext
                        var link = document.createElement("a");
                        link.href = uri;

                        //rendo l'elemento invisibile
                        link.style = "visibility:hidden";
                        link.download = filename + ".csv";

                        //apro il documento in modo che avvii il download automatico
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        //#endregion
                    });
                });
                //#endregion
            },
            renderTable(data) {
                if (Array.isArray(data)) {
                    var template = document.createElement("tbody");
                    data.map((item) => {
                        let row = this.buildRow(item);
                        template.appendChild(row);
                    });
                    var body = this.__element.querySelector("tbody");
                    if (body != null) body.replaceWith(template);
                    this.setActiveRow(...this.activeRows);
                }

            },
            buildRow(item) {
                let row = document.createElement("tr");
                if (this.chiave && this.chiave in item) {
                    row.setAttribute("value", Reflect.get(item, this.chiave));
                    row.addEventListener("click", (evt) => { if (!evt.target.matches("span[input], input, a, select")) this.triggerRowClick(evt); });
                }
                for (const col of this.colonne) {
                    let cell = document.createElement("td");
                    if (typeof col == "object" && "type" in col) cell.setAttribute("type", col.type);
                    if (item[col.name ?? col] != null || col.type == columnTypes.select || col.type == columnTypes.function) {
                        switch (col.type) {
                            case columnTypes.code:
                                let _context = Support.cloneCollection(this);
                                _context.__row = item;
                                let element = item[col.name] ? Support.templateFromString(item[col.name].toString()) : Support.templateFromString("<span></span>");
                                let node = vNode.newInstance(element.firstChild, this.__element.virtual);
                                node.setup();
                                node.elaborate(_context);
                                for (const render of node.reference) {
                                    cell.append(render);
                                }
                                break;
                            case columnTypes.array:
                                if (Array.isArray(item[col.name])) {
                                    let code = "";
                                    for (const e of item[col.name]) {
                                        code += `<obi-chip prepend='${e.icona ?? ""}' label='${e.label ?? e.value ?? e ?? ""}' relevance='${e.color ?? "neutral"}' value='${e.value ?? e ?? ""}'></obi-chip>`;
                                    }
                                    let element = Support.templateFromString(`<div display-row gap='sm' style='width: fit-content' title='${item[col.name].map(e => e.label ?? e.value ?? e).join(", ")}' flex-size='auto'>${code}</div>`);
                                    let node = vNode.newInstance(element.firstChild, this.__element.virtual);
                                    node.setup();
                                    node.elaborate(this);
                                    for (const render of node.reference) { cell.append(render); }
                                    break;
                                }
                            case columnTypes.select:
                                if (col.type == columnTypes.select && this.chiave) {
                                    let data = this.dati.find(e => e[this.chiave] == item[this.chiave]);
                                    cell.append(defineCheckbox.call(this, data, col.name));
                                    break;
                                }
                            default:
                                cell.innerHTML = renderValue(item[col.name ?? col] ?? item, col, this.__node.settings.formatters);
                                break;
                        }
                    }
                    row.appendChild(cell);
                }
                return row;

                function defineCheckbox(item, column) {
                    let node = this.__node;
                    let label = document.createElement("label");
                    label.setAttribute("obi-checkbox", "");

                    let input = document.createElement("input");
                    input.setAttribute("type", "checkbox");
                    if (item[column] === true) input.setAttribute("checked", "checked");
                    else input.removeAttribute("checked");
                    input.addEventListener("change", (evt) => {
                        item[column] = evt.currentTarget.checked;
                        node.trigger("rowselect", item);
                    });
                    let span = document.createElement("span");
                    span.setAttribute("input", "");

                    label.append(input);
                    label.append(span);
                    return label;
                }

                function renderValue(value, column, formatters) {
                    if (column != null && typeof column == "object" && "type" in column && value) {
                        switch (column.type) {
                            case columnTypes.icon: return `<span rounded class="material-symbols-outlined">${value}</span>`;
                            case columnTypes.image: return value ? `<img src="${value}" alt="logo" style='width: 40px; height: 40px;' rounded/>` : `<span class="material-symbols-outlined" rounded>image</span>`;
                            case columnTypes.code: return value.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
                            case columnTypes.currency: return `${value.toLocaleString("it-IT", { style: "decimal", maximumFractionDigits: 2 })}€`;
                            case columnTypes.datetime: return obiStampDate(value);
                            case columnTypes.function: return column.format(value);
                            case columnTypes.link: return `<a text-color='info' href='${value}' target='_blank'>${"format" in column ? column.format(value) : value}</a>`;
                            case columnTypes.boolean:
                                if (typeof value === "string") value = Boolean.parseBoolean(value);
                                return `<span rounded class="material-symbols-outlined" text-color='${value ? "success" : "danger"}'>${value ? "check" : "close"}</span>`;
                            case columnTypes.array:
                                return "";
                        }
                    }
                    return Support.format(value ?? "", formatters);
                }
            },
            getSelected() {
                let column = this.colonne.find(c => c.type == columnTypes.select);
                if (column == null) return [];
                return this.dati.filter(e => e[column.name] === true);
            },
            selectAll(evt) {
                let column = this.colonne.find(c => c.type == columnTypes.select);
                let filters = getFilter(this.allFilters);
                if (column) {
                    if (this.someSelected)
                        this.dati.forEach(e => { if (checkFilter(e, filters)) e[column.name] = false; });
                    else
                        this.dati.forEach(e => { if (checkFilter(e, filters)) e[column.name] = true; });
                    this.update();

                    this.__node.trigger("rowselect", evt);
                }
            },
            async elaborateData(datalist) {
                let filteredData = await this.filterData(datalist);
                return await this.sortData(filteredData);
            },
            async searchOnServer(evt) {
                obiLoader(async () => {
                    let searchedData = [];
                    if (this.src) {
                        let getter = new APIGetter();
                        getter.filters = getFilterDictionary(getFilter(this.allFilters));
                        searchedData = await Service.instance.post(this.src, getter)
                            .catch(err => {
                                obiAlert("Errore durante la ricerca: " + err.message, "danger", this.__node);
                                return [];
                            })
                            .then(async res => {
                                let data = await res.json();
                                if (!Array.isArray(data)) return [];
                                return data;
                            });
                        this.dati.push(...searchedData);
                        await this.update(...searchedData);
                    }
                }, this.__node);

                function getFilterDictionary(filters) {
                    let filtersDict = {};
                    for (const key in filters) {
                        if (Array.isArray(filters[key])) {
                            filtersDict[key] = filters[key].join(",");
                        } else {
                            filtersDict[key] = filters[key];
                        }
                    }
                    return filtersDict;
                }
            },
            async loadData() {
                if (this.src) {
                    this.dati = await Service.instance.post(this.src, new APIGetter())
                        .catch(err => {
                            obiAlert("Errore durante il caricamento: " + err.message, "danger", this.__node);
                            return [];
                        })
                        .then(async res => {
                            if (!res?.ok) return [];
                            let list = await res.json();
                            if (!Array.isArray(list)) return [];
                            return list;
                        });
                }
                await this.update();
            },
            setActiveRow(...keys) {
                this.__element.querySelectorAll("tr[active]").forEach(r => r.removeAttribute("active"));
                if (this.chiave && keys != null) {
                    this.activeRows = Array.from(keys);
                    for (const key of keys) {
                        let row = this.__element.querySelector(`tr[value='${key}']`);
                        if (row) {
                            row.setAttribute("active", "true");
                            row.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                    }
                }
            }
        },
        events: [
            {
                name: Collection.node_event.progress,
                async action(state) {
                    if (state == Collection.lifecycle.mounted) {
                        await obiLoader(async () => this.loadData(), this.__node);
                        if (this.__element.hasAttribute("cache-id")) {
                            let filters = sessionStorage.getItem(this.__element.getAttribute("cache-id"));
                            if (filters) this.listaFiltri = JSON.parse(filters);
                            this.updateView();
                        }
                    }
                }
            }
        ],
        settings: {
            formatters: [
                {
                    type: "string",
                    stamp: function (value) {
                        let splitted = value.split("T")[0].split("-");
                        let date = new Date(parseInt(splitted[0]), splitted[1] - 1, parseInt(splitted[2]));

                        if (date && date != "Invalid Date") {
                            if (date.getFullYear() == 9999) return "";
                            return `${("00" + date.getDate()).padRight(2)}-${("00" + (date.getMonth() + 1)).padRight(2)}-${date.getFullYear()}`;
                        }
                        return value;
                    }
                }
            ]
        },
    }
});

//options: {
//    labels?: string[] | { label: string, name: string, format: func<string> }, //lista delle colonne da stampare
//    displayLabels?: bool, //aggiunge le intestazioni come prima riga se true
//    viewAll?: bool, //applica i filtri della tabella se false,
//    cleanData: bool, //non formatta i dati
//}

defineComponent({
    selector: "obi-table-component",
    template:
        `<test-template name='OBI DATA TABLE' description='' :code='code' :data='table'>
            <section actions slot='actions'>
                <obi-select :valore='relevance' label='Colori' :opzioni='colors'></obi-select>
                <obi-checkbox label='Interact' :valore='selectable' button></obi-checkbox>
            </section>
        </test-template>`,
    options: {
        dataset: {
            table: {
                list: elabData(1000),
                columns: ["id", "nome", "datetime"],
                filtro: {},
            },
            model: {
                nome: "",
                datetime: null,
            },
            relevance: "",
            colors: [
                { label: "Nessun colore", value: "" },
                { label: "Primary", value: "primary" },
                { label: "Secondary", value: "secondary" },
                { label: "Tertiary", value: "tertiary" },
                { label: "Success", value: "success" },
                { label: "Warning", value: "warning" },
                { label: "Danger", value: "danger" },
                { label: "Info", value: "info" },
                { label: "Neutral", value: "neutral" },
                { label: "Dark", value: "dark" },
            ],
            selectable: false,
        },
        computed: {
            dataset: {
                limit: 50,
            },
            code: function () {
                return `<obi-table :dati='list' :colonne='columns' ${this.selectable ? "interact" : ""} ${this.relevance ? "alternate='" + this.relevance + "'" : ""}></obi-table>`;
            },
        },
    }
});

function randomDate() {
    return new Date(Math.random() * (2024 - 2020 + 1) + 2020,
        Math.random() * (12) + 1,
        Math.random() * (29) + 1);
}

function elabData(limit) {
    var list = [];
    for (let i = 0; i < limit; i++) {
        list.push({ id: i, nome: Support.uniqueID(), datetime: randomDate() });
    }
    return list;
}
//AND tra proprietà diverse e OR tra stesse proprietà
function checkFilter(data, filters) {
    if (data == null) return false;
    if (Object.keys(filters).length > 0) {
        //Controllo per ogni proprietà se una sola condizione risulta vera allora la proprietà è vera
        //ma se anche una sola proprietà non rispetta nessuna condizione, essendo le varie proprietà in AND di conseguenza nessuna è giusta.
        for (const key of Object.keys(filters)) {
            if (filters[key].length && filters[key].find(value => condition(data[key], value)) == null) return false;
        }
    }
    return true;

    function condition(value, filter) {
        if (filter) {
            switch (typeof value) {
                case "string": return value.toLowerCase().includes(filter.toString().toLowerCase());
                case "array": return value.some(e => e.toString().toLowerCase() == filter.toString().toLowerCase());
                default: return filter == value;
            }
        }
        return false;
    }
}

function getFilter(filters) {
    let filter = {};
    if (Array.isArray(filters)) {
        for (const item of filters) {
            if (item) {
                let props = Object.keys(item);
                for (const key of props) {
                    if (item[key])
                        if (key in filter) filter[key].push(item[key]); else filter[key] = [item[key]];
                }
            }
        }
    }
    return filter;
}