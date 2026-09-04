# WorkFlow AI

Build a modern, responsive web application called WorkFlow AI – AI Workplace Productivity Assistant.

The application should be ONE integrated workplace productivity platform, not multiple separate applications.

The purpose of WorkFlow AI is to help professionals save time by using AI to automate repetitive workplace tasks.

For the first stage, focus on creating the complete application foundation, visual design, navigation, dashboard and page structure. Do not yet implement the full AI functionality.

CORE FEATURES

The final application will contain three main AI-powered features:

Smart Email Generator

Meeting Notes Summarizer

AI Task Planner / Scheduler

These three features must eventually work together as one platform.

APPLICATION NAVIGATION

Create a responsive sidebar navigation with:

Dashboard

Email Assistant

Meeting Assistant

Task Planner

Settings

On mobile, convert the sidebar into a suitable mobile navigation menu.

DASHBOARD

Create the main WorkFlow AI dashboard.

Include:

Welcome/header section

Today's task count

High-priority task count

Upcoming deadlines

Today's meetings

Recent AI activity

Create a "Quick Actions" section with three prominent buttons:

Draft an Email

Summarise Meeting

Plan My Day

Also create a section showing recent activity.

Use realistic placeholder data for the initial UI, but structure the application so the placeholder data can later be replaced with real database and AI functionality.

PAGE STRUCTURE

Create the following pages:

Email Assistant

Create the UI for:

Recipient/context input

Email purpose input

Key information input

Tone selector

Generate Email button

AI output area

Copy button

Regenerate button

Clear button

The output area should be editable.

Meeting Assistant

Create the UI for:

Meeting title

Large meeting notes/transcript input

Summarise Meeting button

Summary output

Key decisions section

Action items section

Deadlines section

Create Tasks button

Task Planner

Create the UI for:

Task list

Add Task

Task title

Description

Priority

Deadline

Estimated duration

Status

Include a prominent "Plan My Day" AI button.

Create a visual area where the future AI-generated daily schedule will appear.

Settings

Create sections for:

Profile

AI & Privacy

Responsible AI

Include this disclaimer:

"AI-generated content may contain errors. Review and verify important information before using or sharing it."

Also include a privacy notice advising users not to enter confidential or sensitive information unless the AI service has been approved for that information.

DESIGN

Create a polished professional SaaS interface.

The visual style should be:

Modern

Minimal

Professional

Clean

Easy to navigate

Suitable for a workplace

Use a consistent design system across every page.

Use cards, clear typography, subtle borders, appropriate spacing and clear call-to-action buttons.

Do not make the design overly complicated.

RESPONSIVE DESIGN

The application must work properly on:

Desktop

Tablet

Mobile

Ensure that navigation, cards, forms, tables and AI output areas adapt appropriately to smaller screens.

COMPONENT STRUCTURE

Use reusable components wherever appropriate, including:

Sidebar

Header

Dashboard cards

Buttons

Form controls

AI output cards

Task cards

Notifications

Loading states

Empty states

Error states

DATABASE PREPARATION

Prepare the application architecture for Supabase integration.

Plan data structures for:

Users

Tasks

Meetings

Meeting action items

Email generations

AI activity

Do not expose API keys or secrets in frontend code.

IMPORTANT

For this first stage, prioritise the application's architecture, navigation, visual design and user experience.

Make the application look and feel like a real professional SaaS product.

Do not add unrelated features.

After completing this foundation, I will provide additional prompts to implement and connect each AI feature.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://workflow31.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f58c8fa0-fb6e-4c6d-b2e7-7ae67af83e0c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
