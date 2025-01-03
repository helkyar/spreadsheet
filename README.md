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
- Responsive

## Challenges & Solutions

- Add and remove cols/rows (pre-update problem) -> cell id
- Optimizing computation and value update -> ref list

## Future Improvements

There is no end when creating a fully functional spreadsheet

- **More features**: One of the most interesting ones to explore are referencing cells from other sheets as well as allowing for cell styles personalization (color, font, format, ...). Cell resize and cell combination, select multiple columns or rows and allow to drag and insert them with preview animation, undo nad redo...
- **More dynamic features**: Allowing to insert images and generate graphics
- **Advanced Analytics**: Integrating more sophisticated analytics to better understand user behavior and engagement with the content.

## Conclusion

Building this project has been an enriching experience that allowed me to take a deep dive in matrix data management. The use of principles like SOLID and DRY in conjunction with some patterns has enabled me to create a platform that is not only functional but also scalable and easy to maintain. As I continue to grow and evolve as a developer, I look forward to enhancing this site.

## Pending

- Refactors
  - Optimization with tools
- Tests
  - clipboard
  - keyboard accessibility
  - drag and drop
- Accessibility
  - Legend or tutorial (modal with 'i' icon)
  - Change between sheets key (Alt+Arrow Left/Right)
  - Aria when needed
  - Google checks
  - SEO ready
  - Change between sections key (Alt+Arrow Up/Down)
    - Header options (save, import, export, dark theme)
    - Header rows/cols
    - Cells
    - Sheets tabs
- Shallow features
  - Rename sheets tabs and use them as file export name
  - Fix drag & drop from header (offset error)
