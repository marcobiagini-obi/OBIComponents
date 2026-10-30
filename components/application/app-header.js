import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";

defineComponent({
    selector: "app-header",
    template: `<div app-header>
            <div company-logo @click='location.replace($.link)'></div>
            <div app-title @click='location.replace($.link)'>{{titolo}}</div>
        </div>`,
    options: {
        inputs: ["titolo", "link"],
    }
});


defineComponent({
    selector: "app-header-component",
    template:
        `<test-template name='APP HEADER' description='' :code='code'>
            <section actions slot='actions'>
                <obi-checkbox label='Clean' :valore='clean' button></obi-checkbox>
                <obi-checkbox label='Fixed' :valore='fixed' button></obi-checkbox>
                <obi-checkbox label='Info' :valore='info' button></obi-checkbox>
                <obi-checkbox label='Settings' :valore='settings' button></obi-checkbox>
                <obi-checkbox label='User' :valore='user' button></obi-checkbox>
                <obi-checkbox label='Search' :valore='search' button></obi-checkbox>
            </section>
        </test-template>`,
    options: {
        inputs: ["link"],
        dataset: {
            link: "",
            clean: false,
            fixed: true,
            info: true,
            settings: true,
            user: true,
            search: true,
        },
        computed: {
            code: function () {
                let _clean = this.clean ? " clean" : "";
                let _fixed = this.fixed ? " fixed" : "";

                let _info = this.info ? "<obi-button icon tool-item><obi-icon nome='info'></obi-icon></obi-button>" : "";
                let _settings = this.settings ? `<app-settings>
            <app-settings-list>
                <settings-item-darkmode></settings-item-darkmode>
            </app-settings-list>
        </app-settings>` : "";
                let _user = this.user ? "<app-user slot='user'></app-user>" : "";
                let _search = this.search ? "<app-search></app-search>" : "";

                return `<app-header titolo='TEST COMPONENT' ${_clean} ${_fixed}>
    <div slot='tools' app-tools>
        ${_search}
        ${_info}
        ${_settings}
    </div>
        ${_user}
</app-header>`;
            },
        },
    }
});