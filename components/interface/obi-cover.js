import { setupComponent } from "../../LAMP/RenderModule/modules/templates.js";
import { BASE_URL } from "../../obi.config.js";

setupComponent(
    "obi-cover",
    `<div obi-cover class='bg-gray'>
        <img cmd-if='$.tipo=="image"' :src='link' alt='cover'>
        <iframe cmd-if='$.tipo == "file"' :src='link'></iframe>
        <div cmd-if='$.titolo' class='title-cover'></div>
        <obi-title obi-if='$.titolo' :titolo='titolo' :descrizione='sottotitolo'></div>
    </div>`,
    {
        inputs: ["link", "titolo", "sottotitolo", "tipo"],
        dataset: {
            tipo: "image",
            link: `${BASE_URL}/resources/images/obi.png`,
        }
    }
);