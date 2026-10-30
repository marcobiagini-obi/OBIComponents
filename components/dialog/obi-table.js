import { Support } from '../../LAMP/RenderModule/modules/library.js';
import { defineComponent } from '../../LAMP/RenderModule/LampRender.js';
import { Collection } from '../../LAMP/RenderModule/modules/enumerators.js';

defineComponent({
    selector: 'obi-table',
    template: `<div obi-table>
            <slot name='filtro'></slot>
            <div table-filters>
                <obi-chip cmd-if='Array.isArray($.filtro) && $.filtro.length > 0' :relevance='danger' @click='cleanFilters'><obi-icon nome='remove'></obi-icon></obi-chip>
                <obi-chip cmd-for='filter in filter_list' :relevance='neutral' :testo='filter.label' @click='$.removeFilter($.filter)' prepend='close'></obi-chip>
            </div>
        <table>
            <thead>
                <tr>
                    <th cmd-for="item in colonne" :name='$.item.name || $.item' @click='sort'>
                        <span prepend cmd-if='$.isAsc($.item.name || $.item)' class='material-symbols-outlined'>arrow_drop_up</span>
                        <span prepend cmd-elseif='$.isDesc($.item.name || $.item)' class='material-symbols-outlined'>arrow_drop_down</span>
                        {{$.item.label || $.item}}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr cmd-for="element in view" :value='$.element[$.chiave]' @click='triggerRowClick'>
                    <td cmd-for="key in colonne" :type='$.key.type'>{{$.element[$.key.name || $.key]}}</td>
                </tr>
            </tbody>
        </table>
        <div table-pager>
            <group-component>
                <obi-button icon @click='firstPage' :disabled='$.page<=0'><obi-icon nome='first_page'></icon></obi-button>
                <obi-button icon @click='prevPage' :disabled='$.page<=0'><obi-icon nome='navigate_before'></icon></obi-button>
                <obi-button icon @click='nextPage' :disabled='$.page>=$.last_page'><obi-icon nome='navigate_next'></icon></obi-button>
                <obi-button icon @click='lastPage' :disabled='$.page>=$.last_page'><obi-icon nome='last_page'></icon></obi-button>
            </group-component>
            <span>{{($.count_first + 1) + " - " + $.count_last + " su " + $.count}}</span>
            <obi-select :valore='righe' :opzioni='count_options' @changed='update'></obi-select>
        </div>
    </div>`,
    options: {
        inputs: ['colonne', 'dati', 'chiave', 'ordine', "righe", "filtro"],
        dataset: {
            page: 0,
            righe: 25,
            count: 0,
            direzione: "",
            ordine: "",
            view: [],
            filtro: [],
        },
        actions: {
            update: function () {
                this.view = this.getViewData();
            },
            getViewData: function () {
                let _dataview = Support.duplicateArray(this.dati);
                _dataview = dataFilter(_dataview, this.filtro);
                if (this.ordine) _dataview = _dataview.sort((Support.dynamicSort(this.ordine, this.direzione == "desc")));
                this.count = _dataview.length;
                return _dataview.slice(this.count_first, this.count_last);
            },
            firstPage: function () {
                this.page = 0;
                this.update();
            },
            lastPage: function () {
                this.page = this.last_page;
                this.update();
            },
            nextPage: function () {
                if (this.count_last < this.count) this.page += 1;
                this.update();
            },
            prevPage: function () {
                if (this.page > 0) this.page -= 1;
                this.update();
            },
            sort: function (evt) {
                let _element = evt.currentTarget;
                let _sort = _element.getAttribute("name");
                if (this.ordine == _sort) {
                    switch (this.direzione) {
                        case "desc":
                            this.ordine = "";
                            this.direzione = "";
                            break;
                        case "asc": this.direzione = "desc"; break;
                        default: this.direzione = "asc"; break;
                    }
                } else {
                    this.ordine = _sort
                    this.direzione = "asc";
                }
                this.update();
            },
            triggerRowClick: function (evt) {
                let _target = evt.currentTarget;
                let _value = _target.getAttribute("value");
                this.__node.trigger("rowclick", this.dati.find(e => e[this.chiave] == _value));
            },
            isAsc: function (col) {
                return this.direzione == "asc" && col == this.ordine;
            },
            isDesc: function (col) {
                return this.direzione == "desc" && col == this.ordine;
            },
            removeFilter: function (item) {
                this.filtro = this.filtro.filter(f => Reflect.get(f, item.key) != item.value);
                this.update();
            },
            addFilter: function (item) {
                this.filtro.push(item);
                this.update();
            },
            cleanFilters: function () {
                this.filtro = [];
                this.update();
            },
            //options: {
            //    labels?: string[] | { label: string, name: string, format: func<string> }, //lista delle colonne da stampare
            //    displayLabels?: bool, //aggiunge le intestazioni come prima riga se true
            //    viewAll?: bool, //applica i filtri della tabella se false,
            //    cleanData: bool, //non formatta i dati
            //}
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
                let data = Support.duplicateArray(this.dati);
                if (!(options && options.viewAll)) data = dataFilter(data, this.filtro); //se richiesto applico i filtri
                if (this.ordine) data = data.sort((Support.dynamicSort(this.ordine, this.direzione == "desc"))); //ordino i dati

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
                //#endregion
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
            },
        },
        slots: ['head', 'body'],
        computed: {
            last_page: function () { return Math.ceil(this.count / this.righe) - 1; },
            count_first: function () {
                let _first = this.page * this.righe;
                return _first > this.count ? 0 : this.page * this.righe;
            },
            count_last: function () {
                return this.count_first + this.righe <= this.count ? this.count_first + this.righe : this.count;
            },
            count_options: function () {
                return [
                    { label: "5", value: 5 },
                    { label: "10", value: 10 },
                    { label: "25", value: 25 },
                    { label: "50", value: 50 },
                    { label: "100", value: 100 },
                ]
            },
            filter_list: function () {
                let labels = [];
                if (Array.isArray(this.filtro)) {
                    for (const item of this.filtro) {
                        let keys = Object.keys(item);
                        for (const key of keys) {
                            let value = Reflect.get(item, key);
                            if (value) labels.push({ label: `${key}: ${value}`, key: key, value: value });
                        }
                    }
                }
                return labels;
            }
        },
        events: [
            {
                name: Collection.node_event.progress,
                action: function (state) {
                    switch (state) {
                        case Collection.lifecycle.mounted:
                            this.update();
                            break;
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
                            return `${("00" + date.getDate()).padRight(2)}-${("00" + (date.getMonth() + 1)).padRight(2)}-${date.getFullYear()}`;
                        }
                        return value;
                    }
                }
            ]
        }
    }
});

defineComponent({
    selector: "obi-table-component",
    template:
        `<test-template name='OBI DATA TABLE' description='' :code='code' :data='table'>
        </test-template>`,
    options: {
        dataset: {
            table: {
                list: elabData(1000),
                columns: ["id", "nome", "datetime"],
            },
            filtro: [],
            model: {
                nome: "",
                datetime: null,
            }
        },
        computed: {
            dataset: {
                limit: 50,
            },
            code: function () {
                return `
<obi-table :dati='data.list' :colonne='data.columns' :filtro='data.filtro'></obi-table>`;
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

function dataFilter(list, filters) {
    return list.filter(e => {
        let or = [];
        for (const target of filters) {
            let ok = true;
            let keys = Object.keys(target);
            for (const key of keys) {
                if (key in e) {
                    if (typeof Reflect.get(target, key) === "string" && typeof Reflect.get(e, key) === "string") {
                        if (Reflect.get(target, key) && !Reflect.get(e, key).includes(Reflect.get(target, key))) ok = false; //return false;
                    } else {
                        if (Reflect.get(target, key) && Reflect.get(target, key) != Reflect.get(e, key)) ok = false;//return false;
                    }
                }
            }
            or.push(ok);
        }
        return or.find(e => e == true) || or.length == 0;
    });
}