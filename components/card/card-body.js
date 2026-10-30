import { setupComponent } from "../../LAMP/RenderModule/modules/templates.js";

setupComponent(
    "card-body",
    `<section card-body class='txt-body1'>{{corpo}}</section>`,
    {
        inputs: ["corpo"]
    }
);