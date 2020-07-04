import createHeading from "./heading.js";
import "./main.css";
import icon from "./icon.png";
import footer from "./footer.html";

const heading = createHeading();

document.body.appendChild(heading);

const image = new Image();
image.src = icon;

document.body.appendChild(image);

document.write(footer);
