import { setupComponent } from "../../LAMP/RenderModule/modules/templates.js";

setupComponent(
    "obi-logo",
    `<div obi-icon>
        <img :src="src" :alt="alt">
    </div>`,
    {
        inputs: ["src", "alt"],
        dataset: {
            alt: "Logo"
        }
    }
);