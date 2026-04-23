# Soft Elegant Color Palette

Inspired by modern watercolor aesthetic dengan kombinasi teal, coral, peach, dan gold untuk portfolio yang sophisticated.

---

## Core Colors

### Primary Colors
| Nama | Hex Code | RGB | Penggunaan |
|------|----------|-----|-----------|
| **Teal** | `#7FD4C4` | rgb(127, 212, 196) | Navigation, links, hover states, primary accents |
| **Teal Light** | `#A8E0D7` | rgb(168, 224, 215) | Light backgrounds, secondary accents |
| **Teal Dark** | `#5BA39F` | rgb(91, 163, 159) | Hover states, dark accents |

### Secondary Colors
| Nama | Hex Code | RGB | Penggunaan |
|------|----------|-----|-----------|
| **Coral** | `#F4A899` | rgb(244, 168, 153) | Primary CTA buttons, highlights, hover states |
| **Coral Light** | `#F8C4B8` | rgb(248, 196, 184) | Light coral accents, secondary buttons |
| **Coral Dark** | `#D47C63` | rgb(212, 124, 99) | Dark coral for emphasis |

### Accent Colors
| Nama | Hex Code | RGB | Penggunaan |
|------|----------|-----|-----------|
| **Peach** | `#F8C8B8` | rgb(248, 200, 184) | Badges, highlights, secondary elements |
| **Gold** | `#E8D4C4` | rgb(232, 212, 196) | Icons, dividers, decorative elements |
| **Gold Light** | `#F5E8DC` | rgb(245, 232, 220) | Light gold backgrounds |

### Neutral Colors
| Nama | Hex Code | RGB | Penggunaan |
|------|----------|-----|-----------|
| **Background** | `#FFFBF7` | rgb(255, 251, 247) | Main background color |
| **Background Secondary** | `#FAF7F3` | rgb(250, 247, 243) | Secondary background, surfaces |
| **Background Tertiary** | `#F5EDE8` | rgb(245, 237, 232) | Tertiary backgrounds |
| **Text Dark** | `#6B7280` | rgb(107, 114, 128) | Body text, primary text color |
| **Text Light** | `#9CA3AF` | rgb(156, 163, 175) | Secondary text, muted text |
| **Text Lighter** | `#D1D5DB` | rgb(209, 213, 219) | Hints, very light text |
| **Border** | `#F5E6DC` | rgb(245, 230, 220) | Border color, dividers |
| **Border Secondary** | `#E8DCD2` | rgb(232, 220, 210) | Secondary borders |

---

## CSS Variables

```css
:root {
  /* ===== BACKGROUND ===== */
  --color-bg-main: #FFFBF7;
  --color-bg-secondary: #FAF7F3;
  --color-bg-tertiary: #F5EDE8;

  /* ===== PRIMARY COLORS ===== */
  --color-primary: #7FD4C4;
  --color-primary-light: #A8E0D7;
  --color-primary-dark: #5BA39F;

  /* ===== SECONDARY COLORS ===== */
  --color-secondary: #F4A899;
  --color-secondary-light: #F8C4B8;
  --color-secondary-dark: #D47C63;

  /* ===== ACCENT COLORS ===== */
  --color-accent: #F8C8B8;
  --color-gold: #E8D4C4;
  --color-gold-light: #F5E8DC;

  /* ===== TEXT COLORS ===== */
  --color-text: #6B7280;
  --color-text-light: #9CA3AF;
  --color-text-lighter: #D1D5DB;
  --color-text-white: #FFFFFF;

  /* ===== BORDER COLORS ===== */
  --color-border: #F5E6DC;
  --color-border-secondary: #E8DCD2;

  /* ===== INTERACTIVE ===== */
  --color-hover: #A8E0D7;
  --color-active: #5BA39F;
  --color-disabled: #D1D5DB;

  /* ===== SEMANTIC COLORS ===== */
  --color-success: #6EE7B7;
  --color-warning: #FBBF24;
  --color-error: #F87171;
  --color-info: #7FD4C4;

  /* ===== SHADOWS ===== */
  --shadow-xs: 0 1px 2px rgba(107, 114, 128, 0.05);
  --shadow-sm: 0 2px 8px rgba(127, 212, 196, 0.1);
  --shadow-md: 0 4px 12px rgba(127, 212, 196, 0.15);
  --shadow-lg: 0 8px 24px rgba(127, 212, 196, 0.12);

  /* ===== TRANSITIONS ===== */
  --transition-fast: 150ms ease-in-out;
  --transition-smooth: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;
}
```

---

## Implementation Guide

### Navigation Bar
```css
.navbar {
  background-color: var(--color-bg-main);
  border-bottom: 1px solid var(--color-border);
}

.nav-link {
  color: var(--color-text);
  transition: color var(--transition-fast);
}

.nav-link:hover {
  color: var(--color-primary);
}

.nav-link.active {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
}
```

### Button Styles
```css
/* Primary Button */
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-text-white);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Secondary Button */
.btn-secondary {
  background-color: var(--color-secondary);
  color: var(--color-text-white);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.btn-secondary:hover {
  background-color: var(--color-secondary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Outline Button */
.btn-outline {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.btn-outline:hover {
  background-color: var(--color-primary);
  color: var(--color-text-white);
}
```

### Links
```css
a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

a:visited {
  color: var(--color-primary);
}
```

### Form Elements
```css
input,
textarea,
select {
  border: 1px solid var(--color-border);
  padding: 0.75rem;
  border-radius: 6px;
  font-family: inherit;
  background-color: var(--color-bg-main);
  color: var(--color-text);
  transition: border-color var(--transition-fast);
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(127, 212, 196, 0.1);
}

label {
  color: var(--color-text);
  font-weight: 500;
}
```

### Cards & Containers
```css
.card {
  background-color: var(--color-bg-main);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-smooth);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}

.card-title {
  color: var(--color-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.card-text {
  color: var(--color-text);
  line-height: 1.6;
}
```

### Badges
```css
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge-primary {
  background-color: var(--color-primary);
  color: var(--color-text-white);
}

.badge-secondary {
  background-color: var(--color-secondary);
  color: var(--color-text-white);
}

.badge-light {
  background-color: var(--color-accent);
  color: var(--color-text);
}

.badge-gold {
  background-color: var(--color-gold);
  color: var(--color-text);
}
```

### Headings
```css
h1, h2, h3, h4, h5, h6 {
  color: var(--color-text);
  font-weight: 600;
}

h1 {
  font-size: 2.5rem;
  color: var(--color-primary);
}

h2 {
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
```

### Dividers & Separators
```css
hr {
  border: none;
  height: 1px;
  background-color: var(--color-border);
  margin: 2rem 0;
}

.divider {
  height: 2px;
  background: linear-gradient(to right, 
    transparent, 
    var(--color-gold), 
    transparent);
  margin: 2rem 0;
}
```

---

## Tailwind Configuration (Optional)

If you're using Tailwind CSS, add these to your `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0FDFA',
          100: '#A8E0D7',
          500: '#7FD4C4',
          600: '#5BA39F',
          700: '#4A8B83',
        },
        secondary: {
          100: '#F8C4B8',
          500: '#F4A899',
          600: '#D47C63',
        },
        accent: {
          100: '#F8C8B8',
          200: '#E8D4C4',
        },
        neutral: {
          50: '#FFFBF7',
          100: '#FAF7F3',
          200: '#F5EDE8',
          600: '#6B7280',
          700: '#4B5563',
        },
      },
    },
  },
}
```

---

## Dark Mode Support

Untuk dark mode support, tambahkan:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-main: #1A1815;
    --color-bg-secondary: #2A251F;
    --color-bg-tertiary: #3A342D;
    
    --color-primary: #8FE4D6;
    --color-secondary: #FFA999;
    
    --color-text: #E5E7EB;
    --color-text-light: #9CA3AF;
    --color-text-lighter: #6B7280;
    
    --color-border: #3A342D;
    --color-border-secondary: #4A433D;
  }
}
```

---

## Color Swatches Quick Reference

```
Cream/Background:  #FFFBF7
Teal Primary:      #7FD4C4
Coral Secondary:   #F4A899
Peach Accent:      #F8C8B8
Gold:              #E8D4C4
Dark Text:         #6B7280
Light Text:        #9CA3AF
Border:            #F5E6DC
```

---

## Usage Tips

1. **Navigation & Headers** → Use Teal (#7FD4C4)
2. **Primary CTA Buttons** → Use Coral (#F4A899)
3. **Secondary Accents** → Use Peach (#F8C8B8)
4. **Decorative Elements** → Use Gold (#E8D4C4)
5. **Body Text** → Use Dark Gray (#6B7280)
6. **Borders & Dividers** → Use Border Color (#F5E6DC)

---

**Palette inspired by:** Modern watercolor aesthetic dengan sentuhan elegant dan sophisticated untuk portfolio developer.