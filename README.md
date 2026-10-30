# OBIComponents

OBIComponents is a lightweight, browser-based component library built around a custom rendering engine and a set of ready-to-use web components for enterprise-style applications.

The project exposes a collection of reusable UI elements such as cards, forms, tables, navigation, dialogs, inputs, chat panels, dashboards, and app containers. It is designed to work directly in modern browsers using ES modules, without a heavy build pipeline.

## Why this project

This library is intended for building internal business applications with:

- a modular component model
- data-driven templates and slots
- custom input controls and form validation
- application shell patterns for apps, dashboards, login, and navigation
- easy integration with backend APIs via fetch / Service wrappers
- a consistent design language and reusable UI building blocks

## Main features

### Application shell

The project includes application-level components such as:

- `obi-app`
- `obi-login`
- `obi-dashboard`
- `obi-maintenance`
- `obi-tasks`

These components provide the high-level structure for dashboards, menu navigation, app header, login flows, and operational views.

### Form and data entry

Available elements include:

- `obi-form`
- `obi-textbox`
- `obi-textarea`
- `obi-select`
- `obi-checkbox`
- `obi-checkgroup`
- `obi-combobox`
- `obi-date`
- `obi-time`
- `obi-file`
- `obi-slider`

These components support form validation, submit handlers, remove actions, and field binding patterns based on a template-driven model.

### Data display and layout

The library ships with components for:

- `obi-card`
- `obi-table`
- `obi-list`
- `obi-chat`
- `obi-tree`
- `obi-nav`
- `obi-tabs`
- `obi-breadcrumbs`
- `obi-stepper`

These are useful for listing, navigating, managing, and presenting structured data in a consistent way.

### Interface and feedback components

Included UI helpers cover:

- alerts and modals
- badges, chips, labels, icons
- loaders, covers, side panels
- breadcrumbs and titles
- floating menus and action triggers

### Utilities and backend integration

The project includes helper utilities in `core.js` and related modules for:

- local storage settings
- API error handling
- dynamic URL resolution
- activity/loading overlays
- alert dialogs
- data loaders and async state handling

## Project structure

```text
.
├── components/                 # Reusable web components
├── LAMP/                      # Rendering and application framework modules
├── src/                       # Shared helpers, models, utilities
├── style/                     # CSS styles and theme assets
├── componentsBundle.js         # Imports the whole component set
├── core.js                    # Shared helper functions and utilities
├── obi.config.js              # Project configuration for BASE_URL and API_URL
├── playground.html            # Interactive playground/demo page
├── singleComponentTestingArea.html
├── package.json               # Minimal project dependencies
└── LICENSE
```

## Quick start

### 1) Include the styles and bundle

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
    <link rel="stylesheet" type="text/css" href="./style/StyleBundle.css" />
    <script type="module" src="./componentsBundle.js"></script>
  </head>
  <body>
    <obi-app titolo="My App" home="#" fixed clean>
      <obi-nav slot="navigation">
        <nav-item titolo="Home"></nav-item>
        <nav-item titolo="Reports"></nav-item>
      </obi-nav>

      <app-content>
        <obi-card titolo="Welcome">
          <card-body>
            <p>Welcome to your OBI app.</p>
          </card-body>
        </obi-card>
      </app-content>
    </obi-app>
  </body>
</html>
```

### 2) Configure backend URLs

Edit `obi.config.js` to set your application and API base URLs:

```js
export const BASE_URL = "https://your-server.example.com/_webframework/OBIComponents";
export const API_URL = "https://your-server.example.com/serviziweb";
```

If you want to keep local overrides, copy the file as `obi.config.local.js` and adjust it there.

## Example: form component

The library supports data-bound forms with validation and submit callbacks.

```html
<obi-form submit="/api/customers" label="Save" relevance="primary" messaggio="Customer saved successfully">
  <div slot="inputForm">
    <obi-textbox label="Name" :valore="customer.name" required="required"></obi-textbox>
    <obi-textbox label="Surname" :valore="customer.surname"></obi-textbox>
    <obi-select label="Status" :opzioni="statusOptions" :valore="customer.status"></obi-select>
  </div>
</obi-form>
```

This pattern matches the style used throughout the project, where field values are bound to a model and input state is validated before submit.

## Example: table component

```html
<obi-table :dataset="rows" :columns="columns"></obi-table>
```

The component set includes datatable support, column rendering, row actions, paging, and list-style presentation.

## Example: custom component definition

You can also define new components directly in the project using the rendering engine.

```js
import { defineComponent } from "./LAMP/RenderModule/LampRender.js";

defineComponent({
  selector: "hello-card",
  template: `<section>
    <h3>{{ title }}</h3>
    <button @click='changeTitle'>Update</button>
  </section>`,
  options: {
    dataset: {
      title: "Hello from OBIComponents"
    },
    actions: {
      changeTitle() {
        this.title = "Updated title";
      }
    }
  }
});
```

Then use it in HTML:

```html
<hello-card></hello-card>
```

## Development workflow

This repository is primarily a front-end component library with static assets. Typical usage is:

1. load the stylesheet
2. import the bundle or specific component files
3. mount your page using `obi-app` or custom elements
4. bind data and actions to your component model
5. connect your backend through `fetch` or existing service helpers

A local playground is included in `playground.html` to explore the library interactively.

## Styling and design system

The project includes a compiled CSS bundle and theme-related resources under `style/` and `resources/`.

That allows the components to provide a consistent experience with:

- material-inspired icons
- card and panel elevation
- rounded surfaces
- button, form, and table variants
- application layout spacing and color tokens

## Notes

- The project relies on browser-native ES modules.
- Components are designed around custom tags and template bindings rather than standard React/Vue syntax.
- The structure is especially suited for internal enterprise dashboards or admin-style UIs.
- Some parts of the project are deeply tied to the OBI application ecosystem and may require backend integration for end-to-end flows.

## License

This project is licensed under the terms of the repository license. See the `LICENSE` file for details.

## Contributing

Contributions are welcome. If you are extending the component catalog or improving the framework layer, please keep the component API consistent with the rest of the library and validate changes in the local playground before submitting.
