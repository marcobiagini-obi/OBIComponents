//#region APPLICATION
import "./components/application/app-user.js";
import "./components/application/app-header.js";
import "./components/application/tool-item.js";
import "./components/application/app-settings.js";
import "./components/application/app-info.js";
import "./components/application/obi-app.js";
import "./components/application/app-content.js";
import "./components/application/obi-login.js";
import "./components/application/app-search.js";
import "./components/application/obi-dashboard.js";
import "./components/application/obi-maintenance.js";
import "./components/application/obi-tasks.js";
//#endregion
//#region CARD
import "./components/card/obi-card.js";
import "./components/card/obi-filecard.js";
import "./components/card/card-note.js";
//#endregion
//#region DATA
import "./components/datatable/obi-table.js";
import "./components/form/obi-form.js";
import "./components/chat/obi-chat.js";
import "./components/chat/chat-section.js";
//#endregion
//#region DIALOG
import "./components/dialog/obi-modal.js";
import "./components/email/obi-email.js";
//#endregion
//#region INPUT
import "./components/input/obi-button.js";
import "./components/input/obi-textbox.js";
import "./components/input/obi-textarea.js";
import "./components/input/obi-select.js";
import "./components/input/obi-checkbox.js";
import "./components/input/obi-checkgroup.js";
import "./components/input/obi-combobox.js";
import "./components/input/obi-slider.js";
import "./components/input/obi-date.js";
import "./components/input/obi-time.js";
import "./components/input/obi-file.js";
import "./components/input/obi-chiplist.js";
import "./components/input/obi-codeblock.js";
//#endregion
//#region INTERFACE
import "./components/interface/obi-title.js";
import "./components/interface/obi-currency.js";
import "./components/interface/obi-cover.js";
import "./components/interface/obi-icon.js";
import "./components/interface/obi-logo.js";
import "./components/interface/obi-headline.js";
import "./components/interface/obi-badge.js";
import "./components/interface/obi-chip.js";
import "./components/interface/obi-label.js";
import "./components/interface/obi-sideview.js";
import "./components/interface/obi-loader.js";
import "./components/interface/obi-calendar.js";
//#endregion
//#region NAVIGATION
import "./components/navigation/obi-nav.js";
import "./components/navigation/obi-tabs.js";
import "./components/navigation/obi-tree.js";
import "./components/navigation/obi-breadcrumbs.js";
import "./components/stepper/obi-stepper.js";
import "./components/navigation/obi-pager.js";
//#endregion
//#region LISTVIEW
import "./components/list/obi-list.js";
import "./components/list/list-item.js";
//#endregion

import "./components/test.component.js";

document.addEventListener("keydown", (evt) => {
    let select = document.querySelector("div[obi-select][float-container='show']");
    if (select) select.virtual.parent.context.scrollSearch(evt);
});
