import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

// ─── Storage key for persisting filters ───────────────────────────────────────
const STORAGE_KEY = "obi_gantt_filters";

// ─── Date helpers ─────────────────────────────────────────────────────────────
function toDate(value) {
    if (!value) return null;
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
}

function formatDateShort(date) {
    if (!date) return "";
    return date.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" });
}

function daysBetween(a, b) {
    if (!a || !b) return 0;
    return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// ─── Gantt colour by task state ───────────────────────────────────────────────
function ganttColor(task) {
    if (task.expired) return "danger";
    switch (task.idStato) {
        case 1: return "info";
        case 2: return "tertiary";
        case 3: return "secondary";
        case 4: return "success";
        case 5: return "primary";
        case 6: return "dark";
        default: return "neutral";
    }
}

// ─── Build the gantt timeline rows from task list ─────────────────────────────
function buildGanttRows(tasks, timelineStart, totalDays) {
    return tasks.map(task => {
        const start = toDate(task.startDate) || toDate(task.insertTime) || timelineStart;
        const end = toDate(task.deadline) || toDate(task.endDate) || start;

        const startOffset = clamp(daysBetween(timelineStart, start), 0, totalDays);
        const rawDuration = daysBetween(start, end) + 1;
        const duration = clamp(rawDuration, 1, totalDays - startOffset);

        const leftPct = (startOffset / totalDays) * 100;
        const widthPct = (duration / totalDays) * 100;

        return {
            task,
            startOffset,
            duration,
            // pre-build the style string here so the template never needs to
            // concatenate variables – avoids LAMP "not defined" errors
            barStyle: `left:${leftPct}%;width:${Math.max(widthPct, 0.5)}%`,
            color: ganttColor(task),
            rowLabel: task.nome || `Task #${task.id}`,
            startLabel: formatDateShort(start),
            endLabel: formatDateShort(end),
            rowTitle: `${task.nome || "Task #" + task.id} (${formatDateShort(start)} → ${formatDateShort(end)})`,
            taskId: task.id,
        };
    });
}

// ─── Build visible column ticks for the header ───────────────────────────────
function buildTicks(timelineStart, totalDays, tickCount) {
    const ticks = [];
    const step = Math.max(1, Math.floor(totalDays / tickCount));
    for (let i = 0; i <= totalDays; i += step) {
        const d = new Date(timelineStart);
        d.setDate(d.getDate() + i);
        // pre-build style string to avoid expression evaluation issues in template
        ticks.push({
            label: formatDateShort(d),
            tickStyle: `left:${(i / totalDays) * 100}%`,
        });
    }
    return ticks;
}

// ─────────────────────────────────────────────────────────────────────────────
// obi-gantt-row  –  single bar row in the Gantt chart
// All dynamic values come pre-built as plain strings inside the `row` object
// so the template never needs to evaluate string-concatenation expressions.
// ─────────────────────────────────────────────────────────────────────────────
defineComponent({
    selector: "obi-gantt-row",
    template: `<div obi-gantt-row
            :data-task-id='$.row.taskId'
            :title='$.row.rowTitle'
            @click='onRowClick'>
        <span gantt-row-label>{{row.rowLabel}}</span>
        <div gantt-bar-track>
            <div gantt-bar :style='$.row.barStyle' :relevance='$.row.color'>
                <span gantt-bar-text>{{row.startLabel}} – {{row.endLabel}}</span>
            </div>
        </div>
    </div>`,
    options: {
        inputs: ["row"],
        actions: {
            onRowClick() {
                this.__node.trigger("rowclick", this.row.task);
            }
        }
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// obi-gantt  –  main component
//
// Usage:
//   <obi-gantt :tasks="myTaskArray" @opentask="handleOpen"></obi-gantt>
//
// Inputs:
//   tasks  – Array<Task>  the flat list of Task objects to display
//
// Events emitted:
//   opentask  → task object when user clicks an obi-task-item in the list panel
// ─────────────────────────────────────────────────────────────────────────────
defineComponent({
    selector: "obi-gantt",
    template: `<div obi-gantt>

        <!-- ── TOP FILTER BAR ─────────────────────────────────────────── -->
        <div gantt-filters display-row relevance='secondary' gap='sm'>
            <obi-select
                label='Owner'
                :opzioni='ownerOptions'
                :valore='filterOwner'
                @changed='onFilterOwner'
                style='min-width:160px'>
            </obi-select>
            <obi-select
                label='Responsabile'
                :opzioni='responsabiliOptions'
                :valore='filterResponsabile'
                @changed='onFilterResponsabile'
                style='min-width:160px'>
            </obi-select>
            <obi-select
                label='Progetto'
                :opzioni='progettoOptions'
                :valore='filterProgetto'
                @changed='onFilterProgetto'
                style='min-width:160px'>
            </obi-select>
            <obi-select
                label='Stato di Gestione'
                :opzioni='statiOptions'
                :valore='filterStato'
                @changed='onFilterStati'
                style='min-width:160px'>
            </obi-select>
            <obi-button relevance='neutral' variant='outlined' @click='clearFilters' title='Azzera filtri'>
                <obi-icon nome='filter_alt_off'></obi-icon>
            </obi-button>
            <div flex-size='auto'></div>

            <!-- Period navigation -->
            <obi-button relevance='neutral' variant='outlined' @click='prevPeriod' title='Periodo precedente'>
                <obi-icon nome='chevron_left'></obi-icon>
            </obi-button>
            <obi-button relevance='neutral' variant='outlined' @click='setToday' title='Oggi'>
                <obi-icon nome='today'></obi-icon>
            </obi-button>
            <obi-button relevance='neutral' variant='outlined' @click='nextPeriod' title='Periodo successivo'>
                <obi-icon nome='chevron_right'></obi-icon>
            </obi-button>
            <obi-select
                label='Periodo'
                :opzioni='periodOptions'
                :valore='periodDays'
                @changed='onPeriodChanged'
                style='min-width:120px'>
            </obi-select>
        </div>

        <!-- ── MAIN SPLIT LAYOUT ──────────────────────────────────────── -->
        <div gantt-body display-row>

            <!-- LEFT: Gantt chart ───────────────────────────────────── -->
            <div gantt-chart flex-size='auto'>

                <!-- Timeline header with date ticks -->
                <div gantt-timeline-header>
                    <div gantt-row-name-col></div>
                    <div gantt-ticks-wrap>
                        <!-- tickStyle is pre-built as "left:XX%" – no expression needed -->
                        <span cmd-for='tick in timelineTicks'
                            gantt-tick
                            :style='$.tick.tickStyle'>{{tick.label}}</span>
                        <!-- today marker tick in header -->
                        <div gantt-today-tick
                            cmd-if='$.todayVisible'
                            :style='$.todayTickStyle'
                            title='Oggi'>
                        </div>
                    </div>
                </div>

                <!-- Gantt rows + today vertical bar -->
                <div gantt-rows-container @scroll='onGanttScroll' id='gantt_rows'>
                    <div cmd-if='$.filteredTasks.length == 0'
                        style='padding:24px; text-align:center;'
                        class='txt-body2'>
                        Nessuna attività da visualizzare nel Gantt.
                    </div>
                    <obi-gantt-row
                        cmd-for='row in ganttRows'
                        :row='row'
                        @rowclick='onGanttRowClick'>
                    </obi-gantt-row>

                    <!-- Today vertical bar: style pre-built in computed todayBarStyle -->
                    <div gantt-today-bar
                        cmd-if='$.todayVisible'
                        :style='$.todayBarStyle'>
                    </div>
                </div>
            </div>

            <!-- RIGHT: Task list ────────────────────────────────────── -->
            <div gantt-list id='gantt_list'>
                <div cmd-if='$.filteredTasks.length == 0'
                    style='padding:24px; text-align:center;'
                    class='txt-body2'>
                    Nessuna attività trovata.
                </div>
                <div cmd-for='task in filteredTasks'
                    :data-task-id='$.task.id'
                    gantt-list-item
                    @click='onTaskItemClick'>
                    <obi-task-item :task='task'></obi-task-item>
                </div>
            </div>

        </div>
    </div>`,

    options: {
        inputs: ["tasks"],

        dataset: {
            tasks: [],
            filterResponsabile: "",
            filterOwner: "",
            filterProgetto: "",
            filterStato: 0,
            statiOptions: [
                { label: "Tutte", value: 0 },
                { label: "Richieste", value: 1 },
                { label: "Approvate", value: 2 },
                { label: "Attività", value: 3 },
                { label: "Completate", value: 4 },
            ],
            periodDays: 30,
            periodOptions: [
                { label: "2 Settimane", value: 14 },
                { label: "1 Mese", value: 30 },
                { label: "3 Mesi", value: 90 },
                { label: "6 Mesi", value: 180 },
            ],
            timelineStart: (() => {
                const d = new Date();
                d.setHours(0, 0, 0, 0);
                return d;
            })(),
        },

        computed: {
            // ── Filter option lists ────────────────────────────────────────
            responsabiliOptions: function () {
                const all = new Map();
                for (const t of (this.tasks || [])) {
                    for (const r of (t.responsabili || [])) {
                        if (r.username) all.set(r.username, r.username);
                    }
                }
                return [
                    { label: "Tutti", value: "" },
                    ...[...all.keys()].map(u => ({ value: u, label: u }))
                ];
            },

            ownerOptions: function () {
                const all = new Map();
                for (const t of (this.tasks || [])) {
                    if (t.owner) all.set(t.owner, t.owner);
                }
                return [
                    { label: "Tutti", value: "" },
                    ...[...all.keys()].map(o => ({ value: o, label: o }))
                ];
            },

            progettoOptions: function () {
                const all = new Map();
                for (const t of (this.tasks || [])) {
                    if (t.progetto) all.set(t.progetto, t.progetto);
                }
                return [
                    { label: "Tutti", value: "" },
                    ...[...all.keys()].map(p => ({ value: p, label: p }))
                ];
            },

            // ── Filtered task list ─────────────────────────────────────────
            filteredTasks: function () {
                let list = this.tasks || [];
                if (this.filterResponsabile) {
                    list = list.filter(t =>
                        (t.responsabili || []).some(r => r.username === this.filterResponsabile)
                    );
                }
                if (this.filterOwner) {
                    list = list.filter(t => t.owner === this.filterOwner);
                }
                if (this.filterProgetto) {
                    list = list.filter(t => t.progetto === this.filterProgetto);
                }

                if (this.filterStato) {
                    list = list.filter(t => t.idStato == this.filterStato);
                }

                return list;
            },

            // ── Gantt time window ──────────────────────────────────────────
            totalDays: function () {
                return Number(this.periodDays);
            },

            ganttRows: function () {
                return buildGanttRows(this.filteredTasks, this.timelineStart, this.totalDays);
            },

            timelineTicks: function () {
                const count = this.periodDays <= 30 ? 7 : (this.periodDays <= 90 ? 9 : 7);
                return buildTicks(this.timelineStart, this.totalDays, count);
            },

            // "today" % offset within the visible window (may be outside 0-100)
            todayPct: function () {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const offset = daysBetween(this.timelineStart, today);
                return (offset / this.totalDays) * 100;
            },

            // Whether to show the today indicators at all
            todayVisible: function () {
                return this.todayPct >= 0 && this.todayPct <= 100;
            },

            // Pre-built style string for the tick in the header (inside ticks-wrap,
            // which already starts after the label column, so plain % works)
            todayTickStyle: function () {
                return `left:${this.todayPct}%`;
            },

            // Pre-built style string for the vertical bar overlaid on the rows.
            // The bar is absolute inside gantt-rows-container which is full-width
            // (label col 160px + bar track). We offset by the label width.
            todayBarStyle: function () {
                const pct = this.todayPct;
                return `left:calc(160px + (100% - 160px) * ${pct / 100})`;
            },
        },

        storage: {
            highlightTimer: null,
        },

        actions: {
            // ── Filter change handlers ─────────────────────────────────────
            onFilterResponsabile(value) {
                this.filterResponsabile = value;
                this.saveFilters();
            },
            onFilterOwner(value) {
                this.filterOwner = value;
                this.saveFilters();
            },
            onFilterProgetto(value) {
                this.filterProgetto = value;
                this.saveFilters();
            },
            onFilterStati(value) {
                this.filterStato = value;
                this.saveFilters();
            },
            clearFilters() {
                this.filterResponsabile = "";
                this.filterOwner = "";
                this.filterProgetto = "";
                this.saveFilters();
            },

            // ── Persist / restore filters via localStorage ─────────────────
            saveFilters() {
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify({
                        filterResponsabile: this.filterResponsabile,
                        filterOwner: this.filterOwner,
                        filterProgetto: this.filterProgetto,
                        filterStato: this.filterStato,
                    }));
                } catch (_) { /* storage unavailable – silent fail */ }
            },
            loadFilters() {
                try {
                    const raw = localStorage.getItem(STORAGE_KEY);
                    if (!raw) return;
                    const saved = JSON.parse(raw);
                    if (saved.filterResponsabile !== undefined) this.filterResponsabile = saved.filterResponsabile;
                    if (saved.filterOwner !== undefined) this.filterOwner = saved.filterOwner;
                    if (saved.filterProgetto !== undefined) this.filterProgetto = saved.filterProgetto;
                    if (saved.filterStato !== undefined) this.filterStato = saved.filterStato;
                } catch (_) { /* ignore corrupt data */ }
            },

            // ── Period navigation ──────────────────────────────────────────
            onPeriodChanged(value) {
                this.periodDays = Number(value);
            },
            prevPeriod() {
                const d = new Date(this.timelineStart);
                d.setDate(d.getDate() - Math.round(this.periodDays / 2));
                this.timelineStart = d;
            },
            nextPeriod() {
                const d = new Date(this.timelineStart);
                d.setDate(d.getDate() + Math.round(this.periodDays / 2));
                this.timelineStart = d;
            },
            setToday() {
                const d = new Date();
                d.setHours(0, 0, 0, 0);
                // Shift window so today appears ~25% from the left
                d.setDate(d.getDate() - Math.round(this.periodDays / 4));
                this.timelineStart = d;
            },

            // ── Sync scroll: Gantt rows → list ────────────────────────────
            onGanttScroll(evt) {
                const list = this.__element.querySelector("#gantt_list");
                if (list) list.scrollTop = evt.currentTarget.scrollTop;
            },

            // ── Gantt row click → scroll list panel to matching task ───────
            onGanttRowClick(task) {
                const list = this.__element.querySelector("#gantt_list");
                if (!list) return;
                const item = list.querySelector(`[data-task-id="${task.id}"]`);
                if (!item) return;
                item.scrollIntoView({ behavior: "smooth", block: "nearest" });
                item.setAttribute("gantt-highlight", "");
                clearTimeout(this.__storage.highlightTimer);
                this.__storage.highlightTimer = setTimeout(() => {
                    item.removeAttribute("gantt-highlight");
                }, 1800);
            },

            // ── Task list item click → emit opentask ──────────────────────
            onTaskItemClick(evt) {
                // Stop the click from also firing obi-task-item's internal handler
                evt.stopPropagation();
                const wrapper = evt.currentTarget;
                const taskId = Number(wrapper.getAttribute("data-task-id"));
                const task = (this.tasks || []).find(t => t.id === taskId);
                if (task) this.__node.trigger("opentask", task);
            },
        },

        events: [
            {
                name: "progress",
                action: function (state) {
                    if (state === "mounted") {
                        this.loadFilters();
                        this.setToday();
                    }
                }
            }
        ]
    }
});
