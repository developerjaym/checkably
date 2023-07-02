# Checkably
This is my attempt at a phase-2 project (React &amp; json-server). Currently there is no json-server. Maybe later. It's all localStorage right now.

## Basic Concept
I wanted an app that would help me manage the millions of checklists in my life.
- library list
- packing lists
- grocery lists
- home repair lists
- TV show list
- reading list
- movie list
- Christmas lists

## Features
I tried to copy the basic features of the Notes app on my phone.
- Easily editable checklist items' names
- Nested items

And I wanted a few additional features.
- Templates. I want standard checklists, like a standard packing list that I could clone and then adjust whenever I traveled.
- Sharing. I want to be able to share my checklists with friends so they can also stop forgetting to do important stuff.
- Nesting. My Notes app on my phone can only nest one level deep. I wanted infinite depth.
- Smartness. If all my nested checklist items are checked, then the parent should automatically be checked.
- Search. Maybe my Notes app has searching. I haven't actually checked. But I want it for this app.

## Cool Things I Want You to Notice
- Print media queries. These make the checklist look so nice when printed. Did you notice the grayscale on the logo when printed?
- Light mode and dark mode support via media query. It's my understanding that this is the proper way to support dark mode.
- Uses the HTML dialog element. If you haven't tried that yet, you should.
- It's still a work in progress, so there will be more features later.

## Running the app locally
- Run `npm install`
- It was created with Vite, so next run `npm run dev`
- That should do it. If you want, you can build with `npm run build`
