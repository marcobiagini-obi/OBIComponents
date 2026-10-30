import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { Collection } from "../../LAMP/RenderModule/modules/enumerators.js";

var today = new Date();

defineComponent({
    selector: "obi-time",
    template:
        `<float-container obi-time>
            <obi-textbox placeholder='hh' :label='label' :valore='current_time.hour' :filter='input_filter' @keyup='syncView' @click='select' @change='scrollView' type="number" max='23' min='0' :disabled="disabled" :required='required'></obi-textbox>
            <obi-icon nome='go_to_line'></obi-icon>
            <obi-textbox placeholder='mm' :valore='current_time.minutes' :filter='input_filter' @keyup='syncView' @click='select' @change='scrollView' type="number" max='59' min='0' :disabled="disabled" :required='required'></obi-textbox>
            <obi-button prepend='schedule' float-toggle icon :disabled="disabled"></obi-button>
            <div floating-item>
                <div time-selector>
                    <div hour-section>
                        <label cmd-for='hour in hours' @click='setHour' :value='hour' :current='$.isCurrentHour($.hour)'>{{hour}}</label>
                    </div>
                    <div minutes-section>
                        <label cmd-for='min in minutes' @click='setMinute' :value='min' :current='$.isCurrentMinute($.min)'>{{min}}</label>
                    </div>
                </div>
            </div>
        </float-container>`,
    options: {
        inputs: ["valore", "label", "disabled"],
        dataset: {
            input_filter: /\D/g,
            current_time: {
                hour: today.getHours(),
                minutes: today.getMinutes()
            },
        },
        computed: {
            hours: function () {
                var hours = [];
                for (let i = 0; i < 24; i++) { hours.push(("0" + i).padRight(2)); }
                return hours;
            },
            minutes: function () {
                var minutes = [];
                for (let i = 0; i < 60; i++) { minutes.push(("0" + i).padRight(2)); }
                return minutes;
            },
            complete: function () {
                return this.current_time.hour != null && this.current_time.minutes != null;
            },
            value() {
                return this.valore;
            },
            required: function () {
                return this.__element.getAttribute("required") != null;
            },
        },
        actions: {
            scrollView() {
                if (this.__element) {
                    var hours = this.__element.querySelector("[hour-section]");
                    if (hours) {
                        var current_hour = hours.querySelector("label[current]");
                        if (current_hour) hours.scrollTop = current_hour.offsetTop;
                    }

                    var minutes = this.__element.querySelector("[minutes-section]");
                    if (minutes) {
                        var current_min = minutes.querySelector("label[current]");
                        if (current_min) minutes.scrollTop = current_min.offsetTop;
                    }
                }
            },
            setMinute(evt) {
                var min = evt.currentTarget.getAttribute("value");
                this.current_time.minutes = parseInt(min);
                this.valore = this.toString();
                this.__node.trigger("changed", this.valore);
            },
            isCurrentMinute(minute) {
                return this.current_time.minutes == minute;
            },
            setHour(evt) {
                var hour = evt.currentTarget.getAttribute("value");
                this.current_time.hour = parseInt(hour);
                this.valore = this.toString();
                this.__node.trigger("changed", this.valore);
            },
            isCurrentHour(hour) {
                return this.current_time.hour == hour;
            },
            toTime() {
                let _parts = this.valore.split(":");
                return {
                    hour: _parts.length ? _parts[0] : 0,
                    minutes: _parts.length > 0 ? _parts[1] : 0,
                }
            },
            toString() {
                return (this.current_time.hour ? this.current_time.hour : "00") + ":" + (this.current_time.minutes ? this.current_time.minutes : "00");
            },
            inputFilter(evt) {
                if (isNaN(parseInt(evt.key))) return false;
                return true;
            },
            syncView() {
                let _newtime = this.toTime();
                this.current_time.hour = _newtime.hour;
                this.current_time.minutes = _newtime.minutes;
            },
            select(evt) {
                evt.currentTarget.querySelector("input").select();
            },
            isValid() {
                return !this.required || this.required && this.complete;
            }
        },
        events: [
            {
                name: Collection.node_event.progress,
                action: function (state) {
                    if (state == Collection.lifecycle.mounted) {
                        if (this.__element) {
                            var container = this.__element.querySelector("[floating-item]");
                            let _me = this;
                            if (container) {
                                var observer = new MutationObserver(function () {
                                    if (container.style.display != 'none') {
                                        _me.scrollView();
                                    }
                                });
                                observer.observe(container, { attributes: true, childList: true });
                            }
                        }
                    }
                }
            }
        ],
    }
});

defineComponent({
    selector: "obi-time-component",
    template:
        `<test-template name='OBI TIME PICKER' description='' :code='code'>
            <section actions slot='actions'>
                <obi-select :valore='variante' label='Variante' :opzioni='varianti'></obi-select>
                <obi-select :valore='relevance' label='Colore' :opzioni='colors'></obi-select>
                <obi-checkbox label='Disabilita' :valore='disabled' button></obi-checkbox>
            </section>
        </test-template>`,
    options: {
        dataset: {
            variante: "",
            varianti: [
                { label: "standard", value: "" },
                { label: "filled", value: "filled" },
                { label: "outlined", value: "outlined" }
            ],
            disabled: false,
            relevance: "",
            colors: [
                { label: "Nessun colore", value: "" },
                { label: "primary", value: "primary" },
                { label: "secondary", value: "secondary" },
                { label: "tertiary", value: "tertiary" },
                { label: "success", value: "success" },
                { label: "warning", value: "warning" },
                { label: "danger", value: "danger" },
                { label: "info", value: "info" },
                { label: "neutral", value: "neutral" },
                { label: "dark", value: "dark" },
            ],
        },
        computed: {
            code: function () {

                let _variant = this.variante ? " variant='" + this.variante + "'" : "";
                let _disabled = this.disabled ? " disabled" : "";
                let _relevance = this.relevance ? " relevance='" + this.relevance + "'" : "";

                return "<obi-time label='label' " + _disabled + _variant + _relevance + "></obi-time>"
            }
        },
        actions: {
            toggle: function (field) {
                this[field] = !this[field];
            }
        },
    }
});