# Computed File

Intro

## Tech Stack

- React with Typescript
- Vitest
- Sonner for toast messages

## Features

- Upload and Download sheets
- Select cols, rows and cells area for edition, deletion, drag and drop or clipboard management
- Add and delete columns and rows actualizing references
- Reference cells and detect cyclic references
- Full keyboard accessibility

## Challenges & Solutions

- Add and remove cols/rows (pre-update problem) -> cell id
- Optimizing computation and value update -> ref list

## Future Improvements

- **More features**: One of the most interesting ones to explore are referencing cells from other sheets as well as allowing for cell styles personalization (color, font, format, ...)
- **More dynamic features**: Allowing to insert images and generate graphics
- **Advanced Analytics**: Integrating more sophisticated analytics to better understand user behavior and engagement with the content.

## Conclusion

Building this project has been an enriching experience that allowed me to take a deep dive in matrix data management. The use of principles like SOLID and DRY in conjunction with some patterns has enabled me to create a platform that is not only functional but also scalable and easy to maintain. As I continue to grow and evolve as a developer, I look forward to enhancing this site.

## Pending

- Change history with Ctrl+z Ctrl+y?
- Config file?
- Refactors
  - Refactor CSS
  - Refactor HTML
  - Refactor ComputedMatrix (single resp, open/close, command chain)
  - Optimization
- Tests
  - clipboard
  - keyboard accessibility
  - drag and drop
- Better remove/add rows/cols ui
  - Selector vs contextual menu
    - Select col/row by default?
    - Contextual menu key combination (Ctrl+Enter)
  - Content of selector/contextual menu
    - clipboard values/expression
    - order
    - add
    - remove
- Accessibility
  - Legend or tutorial (modal with 'i' icon)
  - Change between sheets key (Alt+Arrow Left/Right)
  - Change between sections key (Alt+Arrow Up/Down)
    - Header options (save, import, export, dark theme)
    - Header rows/cols
    - Cells
    - Sheets tabs
- Shallow features
  - Rename sheets tabs and use them as file export name
  - Change cell focus on arrow navigation
  - Esc doesn't store changes
  - Lock row header css
  - Add drop preview showing a dotted border in target cells
  - Add same logic to show border in selection
