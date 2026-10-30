import { setLocalSettings } from "../../core.js";
import { defineComponent } from "../../LAMP/RenderModule/LampRender.js";
import { View } from "../../LAMP/RenderModule/modules/library.js";
import UserHandler from "../../LAMP/UserModule/LampAccess.js";
import { getPalette as Palette } from "../../src/support.js";

export const localSettingsKey = "OBIComponents_localUiSettings";

/** App Settings */
defineComponent({
    selector: "app-settings",
    template:
        `<float-container>
            <obi-button tool-item relevance="brand" icon float-toggle><obi-icon nome="settings"></obi-icon></obi-button>
            <slot name='impostazioni'></slot>
        </float-container>`,
});
/** App Settings List */
defineComponent({
    selector: "app-settings-list",
    template: `<obi-list slot='impostazioni' floating-item="bottom right" interact variant='elevated'></obi-list>`,
    options: {},
});
/** Settings Item */
defineComponent({
    selector: "settings-item",
    template: `<list-item :prepend="prepend">{{label}}</list-item>`,
    options: {
        inputs: ["icona", "label"],
        computed: {
            prepend: function () { return `<obi-icon nome='${this.icona}'></obi-icon>`; },
        }
    }
});
/** Settings Item Darkmode */
defineComponent({
    selector: "settings-item-darkmode",
    template: `<list-item @click="toggleMode" :prepend="mode.prepend">{{mode.name}}</list-item>`,
    options: {
        computed: {
            isDark: function () {
                return document.body.getAttribute("theme") == "dark";
            },
            mode: function () {
                if (this.isDark) {
                    return {
                        name: "Light",
                        prepend: "<obi-icon nome='light_mode'></obi-icon>"
                    }
                } else {
                    return {
                        name: "Dark",
                        prepend: "<obi-icon nome='dark_mode'></obi-icon>"
                    }
                }
            }
        },
        actions: {
            toggleMode: function () {
                View.darkmode();
                setLocalSettings({ darkmode: this.isDark });
                if (UserHandler.instance.logged) {
                    UserHandler.instance.settings.darkmode = this.isDark;
                    UserHandler.instance.saveUser();
                    UserHandler.instance.setSessionUser();
                }
                this.__app.update();
            },
        }
    },
});
/** Settings Item Radius */
defineComponent({
    selector: "settings-item-radius",
    template: `<float-container>
    <list-item float-toggle prepend="<obi-icon nome='square'></obi-icon>">Bordi</list-item>
    <obi-list floating-item="left top" variant='elevated' interact>
        <list-item :active="$.__app.settings.interface?.radius == '16px'"
            prepend="<span style='width: 30px; height: 24px; border: solid 2px; border-radius: 16px;'></span>"
            value="16px" @click="changeRadius">Molto Stondati</list-item>
        <list-item :active="$.__app.settings.interface?.radius == '8px'"
            prepend="<span style='width: 30px; height: 24px; border: solid 2px; border-radius: 8px;'></span>"
            value="8px" @click="changeRadius">Stondati</list-item>
        <list-item :active="$.__app.settings.interface?.radius == '4px'"
            prepend="<span style='width: 30px; height: 24px; border: solid 2px; border-radius: 4px;'></span>"
            value="4px" @click="changeRadius">Poco Stondati</list-item>
        <list-item :active="$.__app.settings.interface?.radius == '0px'"
            prepend="<span style='width: 30px; height: 24px; border: solid 2px; border-radius: 0px;'></span>"
            value="0px" @click="changeRadius">Secchi</list-item>
    </obi-list>
</float-container>`,
    options: {
        actions: {
            changeRadius: function (evt) {
                let _size = evt.currentTarget.getAttribute("value");
                let settings = setLocalSettings({ radius: _size });
                if (UserHandler.instance.logged) {
                    UserHandler.instance.settings.radius = _size;
                    UserHandler.instance.saveUser();
                    UserHandler.instance.setSessionUser();
                    let userSettings = JSON.parse(JSON.stringify(UserHandler.instance.settings));
                    userSettings.radius = settings.radius;
                    this.__app.updateSettings({ interface: userSettings });
                } else { this.__app.updateSettings({ interface: settings }); }
                this.__app.update();
            },
        }
    }
});
/** Settings Item Theme  */
defineComponent({
    selector: "settings-item-theme",
    template: `<float-container>
    <list-item float-toggle prepend="<obi-icon nome='palette'></obi-icon>">Tema</list-item>
        <obi-list floating-item="left top" variant='elevated' interact>
        <list-item :active="$.checkTheme('#FF7E21')"
            prepend="<span style='width: 24px; height: 24px; border-radius: 50%; background-color: #FF7E21'></span>"
            name="OBI" @click="changeTheme" icona="palette">Originale</list-item>
        <list-item :active="$.checkTheme('#B6997C')"
            prepend="<span style='width: 24px; height: 24px; border-radius: 50%; background-color: #E3D8CD'></span>"
            name="Creatività" @click="changeTheme" icona="palette">Creatività</list-item>
        <list-item :active="$.checkTheme('#66B785')"
            prepend="<span style='width: 24px; height: 24px; border-radius: 50%; background-color: #BFE1CC'></span>"
            name="Responsabilità" @click="changeTheme" icona="palette">Responsabilità</list-item>
        <list-item :active="$.checkTheme('#6464CE')"
            prepend="<span style='width: 24px; height: 24px; border-radius: 50%; background-color: #14143F'></span>"
            name="Collaborazione" @click="changeTheme" icona="palette">Collaborazione</list-item>
        <list-item :active="$.checkTheme('#C2478D')"
            prepend="<span style='width: 24px; height: 24px; border-radius: 50%; background-color: #531C3B'></span>"
            name="Crescita" @click="changeTheme" icona="palette">Crescita</list-item>
    </obi-list>
</float-container>
    `,
    options: {
        actions: {
            changeTheme: function (evt) {
                let _name = evt.currentTarget.getAttribute("name");
                let settings = setLocalSettings({ palette: Palette(_name) });
                if (UserHandler.instance.logged) {
                    UserHandler.instance.settings.palette = Palette(_name);
                    UserHandler.instance.saveUser();
                    UserHandler.instance.setSessionUser();
                    let userSettings = JSON.parse(JSON.stringify(UserHandler.instance.settings));
                    userSettings.palette = settings.palette;
                    this.__app.updateSettings({ interface: userSettings });
                } else { this.__app.updateSettings({ interface: settings }); }
                this.__app.update();
            },
            checkTheme: function (color) {
                if (UserHandler.instance.logged && UserHandler.instance.settings?.palette != null) {
                    return UserHandler.instance.settings.palette.find(c => c.name == "brand")?.color == color;
                } else {
                    let local = JSON.parse(localStorage.getItem(localSettingsKey))
                    if (local && "palette" in local) return local.palette.find(c => c.name == "brand")?.color == color;
                }
                return color == "#FF7E21";
            },
        }
    }
});