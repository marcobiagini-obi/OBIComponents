import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { Collection } from "../../LAMP/RenderModule/modules/enumerators.js";
import { stampDateIta } from "../input/obi-date.js";

var today = new Date();

defineComponent({
    selector: "obi-calendar",
    template: `<div obi-calendar>
	<div calendar-header margin='sm'>
		<obi-select mode-selector cmd-if='$.mode==="default"' :opzioni='viewModes' :valore='viewSpan' :append='iconaModalita' @changed='setupCalendarView'></obi-select>
		<div name="selectors">
			<div name="month_selector">
				<obi-button prepend='chevron_left' @click='prevMonth' rounded></obi-button>
				<obi-button :label='month_display' @click="viewMonth" rounded></obi-button>
				<obi-button prepend='chevron_right' @click='nextMonth' rounded></obi-button>
			</div>
			<obi-button  @click='setToday' rounded title='oggi'><obi-icon nome='circle'></obi-icon></obi-button>
			<div name="year_selector">
				<obi-button prepend='chevron_left' @click='prevYear' rounded></obi-button>
				<obi-button :label='year_display' @click="viewYears" rounded></obi-button>
				<obi-button prepend='chevron_right' @click='nextYear' rounded></obi-button>
			</div>
		</div>
	</div>
    <div cmd-if="$.view == 'month'" name="months_section" @render='scrollView'>
        <label cmd-for='month in months' @click='setMonth' :value='month' :current=':index == ($.date_display.getMonth())'>{{month}}</label>
    </div>
    <div cmd-elseif="$.view == 'year'" name="years_section" @render='scrollView'>
        <label cmd-for='year in years' @click='setYear' :value='year' :current='$.isThisYear($.year)'>{{year}}</label>
    </div>
    <div cmd-elseif="$.view == 'grid' && $.viewSpan == 'month'" name="month_view">
        <span>Lu</span>
        <span>Ma</span>
        <span>Me</span>
        <span>Gi</span>
        <span>Ve</span>
        <span>Sa</span>
        <span>Do</span>
        <label cmd-for='day in grid_days' :class='day.type' :selected='day.selected' :value='$.stampDate($.day.date)' float-toggle cmd-model='day.num'></label>
    </div>
	<div cmd-elseif="$.view == 'grid' && $.viewSpan == 'week'" name="week_view"\>
        <div class="week-header">
            <span></span>
            <span cmd-for="day in week_days_short">{{day}}</span>
        </div>
        <div class="week-days">
            <span></span>
            <span cmd-for="day in selected_week_days" :active="$.isActiveDay($.day)" >{{day}}</span>
        </div>
        <div class='week-days-events'>
            <div day='1'></div>
            <div day='2'></div>
            <div day='3'></div>
            <div day='4'></div>
            <div day='5'></div>
            <div day='6'></div>
            <div day='7'></div>
        </div>
        <div class="week-events">
            <div grid-ui>
                <div column day='1'></div>
                <div column day='2'></div>
                <div column day='3'></div>
                <div column day='4'></div>
                <div column day='5'></div>
                <div column day='6'></div>
                <div column day='7'></div>
                <span class='now-bar' :minute='todayInWeek.hour' :day='todayInWeek.day'></span>
                <div class='hour-label' cmd-for="hour in hours" :ref='hour'>{{hour}}</div>
            </div>
            <div events-container>
            
            </div>
        </div>
    </div>
	<div cmd-elseif="$.view == 'grid' && $.viewSpan == 'day'" name="day_view">
        <div class="day-header">
            <span>{{week_days[new Date(date_display).getDay() == 0 ? 6 : new Date(date_display).getDay() - 1]}}</span>
            <span>{{date_display.getDate()}} {{months_short[date_display.getMonth()]}} {{date_display.getFullYear()}}</span>
        </div>
        <div class="day-events">
            <div cmd-if="events && events.length > 0">
                <div cmd-for="event in events" class="event-item">
                    <span class="event-time">{{event.time}}</span>
                    <span class="event-title">{{event.title}}</span>
                </div>
            </div>
            <div cmd-else>
                <span>Nessun evento per questo giorno.</span>
            </div>
        </div>
    </div>
</div>`,
    options: {
        inputs: ["events", "label"],
        dataset: {
            months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
            months_short: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
            week_days: ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"],
            week_days_short: ["Lu", "Ma", "Me", "Gi", "Ve", "Sa", "Do"],
            week_days_single: ["L", "M", "M", "G", "V", "S", "D"],
            selected_week_days: [],
            hours: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
            view: "grid",
            input_format: "##/##/####",
            input_filter: /\D/g,
            current_date: undefined,
            print_date: "",
            viewModes: [{ label: "Mese", value: "month" }, { label: "Settimana", value: "week" }, { label: "Giorno", value: "day" }, { label: "Eventi", value: "events" }],
            viewSpan: "week",
        },
        computed: {
            /**valore della data di navigazione corrente*/
            date_display: function () {
                return isValidDate(this.current_date) ? this.current_date : (isValidDate(this.value) ? this.value : new Date(today.getFullYear(), today.getMonth(), 1));
            },
            years: function () {
                let current = new Date().getFullYear();
                let years = [];
                let y = current - 100;
                let max = current + 25;
                while (y < max) {
                    years.push(y);
                    y++;
                }
                return years;
            },
            month_display: function () {
                var month = this.months_short[new Date(this.date_display).getMonth()];
                return month
            },
            year_display: function () {
                var year = new Date(this.date_display).getFullYear();
                return year;
            },
            grid_days: function () {
                var days = [];
                var display = new Date();
                if (this.date_display instanceof Date) display = this.date_display;

                const types = {
                    selected: "select",
                    previous: "prev",
                    post: "post",
                    current: "month",
                    today: "today"
                }

                //set PREVIOUS DAYS
                var first_date = new Date(display.getFullYear(), display.getMonth(), 1);
                var first_date_day = first_date.getDay() == 0 ? 7 : first_date.getDay();

                for (let i = first_date_day - 1; i > 0; i--) {
                    let _temp = new Date(display.getFullYear(), display.getMonth(), 1);
                    _temp.setDate(first_date.getDate() - i);
                    days.push({ date: _temp, num: _temp.getDate(), type: types.previous, selected: isSelectedDate(_temp, parseDate(this.print_date)) });
                }

                //setup MONTH and POST DAYS
                var last_date = new Date(
                    display.getMonth() == 11 ? display.getFullYear() + 1 : display.getFullYear(),
                    display.getMonth() == 11 ? 0 : display.getMonth() + 1,
                    1);
                const diffTime = Math.abs(last_date - first_date);
                var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                if (Math.ceil(diffTime / (1000 * 60 * 60 * 24)) > 31) diffDays = 31;

                last_date.setDate(last_date.getDate() - 1);
                var last_date_day = 7 - (last_date.getDay() == 0 ? 7 : last_date.getDay());
                if ((days.length + diffDays + last_date_day - 1) / 7 < 5) last_date_day += 7;

                for (let i = 0; i < (diffDays + last_date_day); i++) {
                    let _temp = new Date(display.getFullYear(), display.getMonth(), 1);
                    _temp.setDate(first_date.getDate() + i);
                    let isToday = _temp.getDate() == today.getDate() && _temp.getMonth() == today.getMonth() && _temp.getFullYear() == today.getFullYear();
                    let _type = i >= diffDays ? types.post : (isToday ? types.today : types.current);
                    days.push({ date: _temp, num: _temp.getDate(), type: _type, selected: isSelectedDate(_temp, parseDate(this.print_date)) });
                }

                function isSelectedDate(date, selected) {
                    if (selected && date) {
                        return date.getDate() == selected.getDate() && date.getMonth() == selected.getMonth() && date.getFullYear() == selected.getFullYear();
                    }
                    return false;
                }

                return days;
            },
            required: function () {
                return this.__element.getAttribute("required") != null;
            },
            mode: function () {
                return this.__element.getAttribute("mode") || "default";
            },
            iconaModalita: function () {
                switch (this.viewSpan) {
                    case "month": return "<obi-icon nome='calendar_view_month'></obi-icon>";
                    case "week": return "<obi-icon nome='calendar_view_week'></obi-icon>";
                    case "day": return "<obi-icon nome='calendar_view_day'></obi-icon>";
                    case "events": return "<obi-icon nome='event'></obi-icon>";
                    default: return "<obi-icon nome='calendar_today'></obi-icon>";
                }
            },
            todayInWeek: function () {
                return { hour: getMinutesInDay(today), day: getNumberOfWeek(today) };
            }
        },
        storage: {
            __update_interval: null,
        },
        actions: {
            scrollView(element) {
                if (element) {
                    var current = element.querySelector("label[current]");
                    if (current) element.scrollTop = current.offsetTop - 130;
                }
            },
            setToday() {
                this.valore = new Date();
                this.update();
                this.view = 'grid';
            },
            viewMonth() {
                this.view = this.view == 'month' ? 'grid' : 'month';
            },
            setMonth(evt) {
                var month = evt.currentTarget.getAttribute("value");
                this.navigateDate(new Date(this.date_display.getFullYear(), this.months.indexOf(month), 1));
                this.view = "grid";
            },
            nextMonth() {
                let _date = this.date_display;
                this.navigateDate(new Date(
                    _date.getMonth() == 11 ? _date.getFullYear() + 1 : _date.getFullYear(),
                    _date.getMonth() == 11 ? 0 : _date.getMonth() + 1,
                    1));
            },
            prevMonth() {
                let _date = this.date_display;
                this.navigateDate(new Date(
                    _date.getMonth() == 0 ? _date.getFullYear() - 1 : _date.getFullYear(),
                    _date.getMonth() == 0 ? 11 : _date.getMonth() - 1,
                    1));
            },
            viewYears() {
                this.view = this.view == 'year' ? 'grid' : 'year';
            },
            scrollYears() {
                var element = this.__element.querySelector("div[name='years_section']");
                var current = element.querySelector("label[current]");
                element.scrollTop = current.offsetTop;
            },
            setYear(evt) {
                var year = evt.currentTarget.getAttribute("value");
                this.navigateDate(new Date(year, this.date_display.getMonth(), 1));
                this.view = "grid";
            },
            nextYear() {
                let _date = this.date_display;
                this.navigateDate(new Date(_date.getFullYear() + 1, _date.getMonth(), 1));
            },
            prevYear() {
                let _date = this.date_display;
                this.navigateDate(new Date(_date.getFullYear() - 1, _date.getMonth(), 1));
            },
            isThisYear(year) {
                return year == this.year_display;
            },
            stampDate(datetime) {
                return stampDateIta(datetime);
            },
            update() {
                if (isValidDate(this.valore)) this.current_date = this.valore;
                this.print_date = stampDateIta(this.valore);
                this.setupCalendarView(this.viewSpan);
                if (this.__storage.__update_interval) clearInterval(this.__storage.__update_interval);
                this.__storage.__update_interval = setInterval(() => this.update(), 15 * 60 * 1000);
            },
            setDate(evt) {
                this.valore = parseDate(evt.currentTarget.getAttribute("value"));
                this.update();
                this.__node.trigger("changed", this.valore);
            },
            navigateDate(datetime) {
                if (typeof datetime === "string") datetime = parseDate(datetime);
                this.current_date = datetime;
            },
            editDate(evt) {
                let datetime = parseDate(this.print_date);
                if (datetime) this.current_date = datetime;
                this.valore = datetime;
                if (isValidDate(this.valore)) this.__node.trigger("changed", this.valore);
            },
            isActiveDay(day) {
                const currentDate = this.date_display;
                return day == currentDate.getDate() && day.getMonth() == currentDate.getMonth() && day.getFullYear() == currentDate.getFullYear();
            },
            isTodayDay(day) {
                return day == today.getDate() && day.getMonth() == today.getMonth() && day.getFullYear() == today.getFullYear();
            },
            getWeekDays() {
                const date = this.current_date ?? today;

                // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
                const dayIndex = date.getDay();

                // Adjust so that Monday is 0 and Sunday is 6
                const diffToMonday = dayIndex === 0 ? -6 : 1 - dayIndex;

                // Find the Monday of that week
                const monday = new Date(date);
                monday.setDate(date.getDate() + diffToMonday);

                const weekDays = [];

                for (let i = 0; i < 7; i++) {
                    const currentDay = new Date(monday);
                    currentDay.setDate(monday.getDate() + i);

                    // We push the day number (1-31)
                    weekDays.push(currentDay.getDate());
                }

                return weekDays;
            },
            setupCalendarView(mode) {
                if (mode === "week") {
                    this.selected_week_days = this.getWeekDays();
                    const weekEventsDiv = this.__element.querySelector(".week-events");
                    const nowBar = weekEventsDiv?.querySelector(".now-bar");
                    if (nowBar) {
                        weekEventsDiv.scrollTop = nowBar.offsetTop - weekEventsDiv.clientHeight / 2;
                    }
                }
            },
        },
        events: [
            {
                name: Collection.node_event.progress,
                action: function (state) {
                    if (state == Collection.lifecycle.mounted) {
                        this.update();
                    }
                }
            }
        ]
    }
});

/**
 * Controlla che le date siano uguali
 *
 * @param {...{}} dateSet
 * @returns {boolean}
 */
function sameDate(...dateSet) {
    if (dateSet = null || dateSet.length == 0) return false;
    let i = 0;
    let last = dateSet[i++];
    while (i < dateSet.length) {
        if (!isValidDate(dateSet[i])) return false;
        if (!(last.getFullYear() === date.getFullYear() && last.getMonth() === date.getMonth() && last.getDate() === date.getDate())) return false;
        i++;
    }
    return true;
}
/**Controlla che le date siano valide */
function isValidDate(datetime) { return datetime != null && datetime.toString != "Invalid Date"; }
/**Converte una stringa in un oggetto di tipo Data */
function parseDate(datestring, _default = null) {
    if (datestring) {
        let _split = datestring.split("/");
        return new Date(Date.UTC(Number(_split[2]), Number(_split[1]) - 1, Number(_split[0])));
    }
    return _default;
}

function getMinutesInDay(date) {
    const dateSample = new Date(date);
    return dateSample.getHours() * 60 + dateSample.getMinutes();
}

function getNumberOfWeek(date) {
    const dateSample = new Date(date);
    return dateSample.getDay() + 1;
}