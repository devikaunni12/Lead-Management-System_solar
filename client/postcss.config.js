/**
 * This file configures PostCSS plugins used by Tailwind.
 * Tailwind and Autoprefixer are both required for CSS processing.
 */

export default {
  // plugins define CSS processing steps in order.
  plugins: {
    // tailwindcss reads utility classes and generates final CSS output.
    tailwindcss: {},
    // autoprefixer adds browser prefixes automatically for compatibility.
    autoprefixer: {},
  },
};
