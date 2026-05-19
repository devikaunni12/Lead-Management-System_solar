/**
 * This file configures Tailwind CSS for the React frontend.
 * It tells Tailwind where to scan class names and keeps default theme extensions simple.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  // content tells Tailwind which files contain class names to include in final CSS.
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // theme is where we can customize colors, spacing, fonts, and more.
  theme: {
    extend: {},
  },
  // plugins can add extra Tailwind utilities. We keep this empty for beginner simplicity.
  plugins: [],
};
