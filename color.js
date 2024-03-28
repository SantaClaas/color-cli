import { hexFromArgb } from "@material/material-color-utilities";
/** @typedef {import("@material/material-color-utilities").TonalPalette} TonalPalette */
/** @typedef {import("@material/material-color-utilities").Scheme} Scheme */

/**
 * Convert camelCase to kebab-case
 * e.g. "neutralVariant" -> "neutral-variant"
 * @param {string} value
 * @returns {string}
 */
function camelToKebabCase(value) {
  return value.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 *
 * @param {TonalPalette} palette
 * @returns {Record<number, string>}
 */
function generatePaletteSteps(palette) {
  // Create Tonal palletes
  // See https://m3.material.io/styles/color/system/how-the-system-works#3ce9da92-a118-4692-8b2c-c5c52a413fa6
  // And https://material-foundation.github.io/material-theme-builder/
  const materialPalletteSteps = [
    0, 5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100,
  ];

  /** @type {Record<number, string>} */
  const result = {};
  for (const step of materialPalletteSteps) {
    result[step] = hexFromArgb(palette.tone(step));
  }

  return result;
}

/**
 *
 * @param {{ [key: string]: TonalPalette }} materialPalettes
 */
export function createPalettes(materialPalettes) {
  /** @type {Record<string, Record<number, string> & {variant?: Record<number, string>}>} */
  const palettes = {};
  for (let key in materialPalettes) {
    const palette = materialPalettes[key];

    const paletteSteps = generatePaletteSteps(palette);
    if (key === "neutralVariant") {
      // Put under neutral
      palettes.neutral = { ...palettes.neutral, variant: paletteSteps };
      continue;
    }

    palettes[key] = paletteSteps;
  }

  return palettes;
}
/**
 *
 * @param {{ [key: string]: Scheme }} schemes
 * @returns {Record<string, Record<string, string>>}
 */
export function createColors(schemes) {
  /** @type {Record<string, Record<string, string>>} */
  const colors = {};

  for (let schemeKey in schemes) {
    const schemeValue = schemes[schemeKey];

    /** @type {{[key: string]: number}} */
    const schemeJson = schemeValue.toJSON();
    /** @type {Record<string, string> & {on? : Record<string,string>, inverse?: Record<string, string>}} */
    const schemeColors = {};
    for (let colorKey in schemeJson) {
      /** @type {number} */
      const colorValue = schemeJson[colorKey];
      const indexOn = colorKey.indexOf("on");

      // Group "on" prefix colors in object to make them accessible as "light.on.primary"
      // If it contains on and starts with "on" (at index 0)
      if (indexOn === 0) {
        colorKey = colorKey.substring(indexOn + 2);

        // First chacater needs to be lower case to make it proper camelCase
        // (Yes, this is the easieest way to change a character in a string in JS)
        colorKey = colorKey.charAt(0).toLowerCase() + colorKey.substring(1);

        if (schemeColors.on) {
          schemeColors.on[colorKey] = hexFromArgb(colorValue);
        } else {
          schemeColors.on = { [colorKey]: hexFromArgb(colorValue) };
        }

        continue;
      }

      // Group the "inverse" prefix
      if (colorKey.startsWith("inverse")) {
        colorKey = colorKey.substring(7);
        colorKey = colorKey.charAt(0).toLowerCase() + colorKey.substring(1);

        if (schemeColors.inverse) {
          schemeColors.inverse[colorKey] = hexFromArgb(colorValue);
        } else {
          schemeColors.inverse = { [colorKey]: hexFromArgb(colorValue) };
        }

        continue;
      }

      // Other groupings are not possible as "error" would have to be a value and an object to group "container" for
      // "errorContainer" e.g. { error: "#ffb4ab" & { container: "#93000a" }} and assigning a property to the String
      // object sounds like a bad idea
      // Other groupings are not possible as "error" would have to be a value and an object to group "container" for
      // "errorContainer" e.g. { error: "#ffb4ab" & { container: "#93000a" }} and assigning a property to the String
      // object sounds like a bad idea

      schemeColors[colorKey] = hexFromArgb(colorValue);
    }

    schemeKey = camelToKebabCase(schemeKey);
    colors[schemeKey] = schemeColors;
  }

  return colors;
}
