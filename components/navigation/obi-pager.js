import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { Collection } from "../../LAMP/RenderModule/modules/enumerators.js";

defineComponent({
    selector: "obi-pager",
    template: `<div obi-pager padding='sm' display-row gap='sm' flex-align='center' flex-justify='center'>
        <obi-icon flex-size='unset' nome='chevron_left' @click='prev' interactable></obi-icon>
        <obi-chip cmd-if='$.pager > 0' flex-size='unset' label='...' interactable @click='prevPager'></obi-chip>
        <obi-chip cmd-for='item in pages' :variant='$.item == $.page ? "filled" : null' flex-size='unset' :label='$.item + 1' interactable @click='select' :value='item'></obi-chip>
        <obi-chip cmd-if='($.pager + 1) * $.maxPages < $.counter' flex-size='unset' label='...' interactable @click='nextPager'></obi-chip>
        <obi-icon flex-size='unset' nome='chevron_right' @click='next' interactable></obi-icon>
    </div>`,
    options: {
        inputs: ["dati", "view", "max"],
        dataset: {
            view: 20,
            max: 5,
            page: 0,
            pager: 0,
        },
        computed: {
            counter: function () {
                let length = this.dati?.length ?? 0;
                return Math.ceil(length / Number(this.view));
            },
            pages: function () {
                let pages = [];
                let start = this.pager * this.maxPages;
                let end = start + this.maxPages;
                if (end > this.counter) end = this.counter;
                for (let i = start; i < end; i++) {
                    pages.push(i);
                }
                return pages;
            },
            maxPages: function () { return Number(this.max) > this.counter ? this.counter : Number(this.max); },
        },
        actions: {
            next() {
                if (this.page == this.counter - 1) {
                    this.pager = 0;
                    this.moveTo(0);
                    return;
                }
                if (this.page + 1 == (this.pager + 1) * Number(this.max)) {
                    this.pager += 1;
                }
                this.moveTo(this.page + 1);
            },
            prev() {
                if (this.page == 0) {
                    this.pager = Math.floor(this.counter / Number(this.max));
                    this.moveTo(this.counter - 1);
                    return;
                }
                if (this.page == (this.pager) * Number(this.max)) {
                    this.pager -= 1;
                }
                this.moveTo(this.page - 1);
            },
            select(evt) {
                let target = evt.target;
                let page = target.getAttribute("value");
                this.moveTo(Number(page));
            },
            moveTo(page) {
                this.page = page;
                this.__node.trigger("moved", this.page);
            },
            nextPager() {
                this.pager += 1;
                this.moveTo(this.pager * this.max);
            },
            prevPager() {
                this.pager -= 1;
                this.moveTo((this.pager + 1) * this.max - 1);
            },
            getSliceData() {
                let start = this.page * Number(this.view);
                let end = start + Number(this.view);
                return this.dati.slice(start, end);
            },
        },
        events: [],
    },
});