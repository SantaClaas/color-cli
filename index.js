import { themeFromSourceColor } from "@material/material-color-utilities";
import { createColors, createPalettes } from "./color.js";
import { argv } from "node:process";

const color = Number(argv[2]);

if (isNaN(color))
  throw new Error("Invalid color. Color is not a number (it failed isNaN)");

if (color < 0) throw new Error("Invalid color. Color is less than 0");

const theme = themeFromSourceColor(color);
const palettes = createPalettes(theme.palettes);

const colors = createColors(theme.schemes);
const themeJson = {
  palettes,
  colors,
};

process.stdout.write(JSON.stringify(themeJson));
