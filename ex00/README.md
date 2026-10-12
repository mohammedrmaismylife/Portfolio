# Chapter IV, Exercise 00: Personal Portfolio

A responsive personal portfolio by Mohammed Khaled, built **from scratch** with HTML5, CSS3 and
JavaScript ES6+. No frameworks, templates or UI libraries.

## Files

| File | Role |
|------|------|
| `index.html` | Page structure (semantic HTML5) |
| `style.css` | Styling: theme variables, Flexbox layout, media queries |
| `script.js` | Theme switcher, accent colours, mobile menu, form validation |
| `assets/` | Images (`profile.png`) |
| `README.md` | This documentation |

## Sections

Header/Navbar, About Me (with photo), Skills grid, Project Showcase (Projects 00 to 03),
Hobbies, Contact Form and Footer.

## Mandatory JavaScript feature: theme switcher

A **Dark mode / Light mode** button in the navbar changes the whole page. Four colour swatches
also change the accent colour. The choice is saved in `localStorage`.

### Event lifecycle

1. **User action**: the visitor clicks the theme button.
2. **Event firing**: the browser creates a `click` event and sends it to the button
   (it then bubbles up through `header`, `body` and `document`).
3. **JavaScript callback**: the function registered with
   `addEventListener("click", handleThemeClick)` runs, reads the current theme and picks the opposite one.
4. **DOM/CSS mutation**: it sets `data-theme="dark"` on `<html>`. The CSS rule
   `:root[data-theme="dark"]` then matches and changes the custom properties (`--bg`, `--ink`, ...),
   so the browser recalculates styles and repaints the page. The button label is updated too.

JavaScript only changes an attribute; all the visual styling stays in CSS.

## Responsive design

- Mobile-first: base styles are for phones, with a hamburger menu.
- Flexbox for the navbar, skills, projects, hobbies, contact and footer.
- Media queries at `700px` (2 columns) and `1000px` (inline navbar, 3 to 4 columns).

## Run it

Open `index.html` in a browser. No build step is needed.

## Technologies

HTML5, CSS3, JavaScript ES6+ and Git only.