import { setupComponent } from '../../LAMP/RenderModule/modules/templates.js';

setupComponent(
    'table-pager',
    `<div table-pager>
        <obi-button icon @click='lastPage'><obi-icon icona='keyboard_double_arrow_right'></icon></obi-button>
        <obi-button icon @click='nextPage'><obi-icon icona='navigate_next'></icon></obi-button>
        <obi-button icon @click='prevPage'><obi-icon icona='navigate_before'></icon></obi-button>
        <obi-button icon @click='firstPage'><obi-icon icona='keyboard_double_arrow_left'></icon></obi-button>
        <span>{{($.first + 1) + \" - \" + $.last + \" su \" + $.dati}}</span>
        <obi-textbox :valore='righe' variant='outlined' placeholder='Righe'></obi-textbox>
    </div>`,
    {
        dataset: {
            page: 0
        },
        actions: {
            firstPage: function () { this.page = 0; },
            lastPage: function () { this.page = this.last_page; },
            nextPage: function () { if (this.page < this.last_page) this.page += 1; },
            prevPage: function () { if (this.page > 0) this.page -= 1; }
        },
        inputs: ['dati', 'righe'],
        computed: {
            last_page: function () { return Math.round(this.dati / this.righe); },
            first: function () { return this.page * this.righe; },
            last: function () { return this.righe < this.dati ? this.first + this.righe : this.dati; }
        }
    }
);