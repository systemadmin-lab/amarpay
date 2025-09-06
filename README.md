# Mini Event Management System

Live Demo: [https://amarpay.vercel.app/](https://amarpay.vercel.app/)

This is a **Mini Event Management System** built with **Next.js**, **React 18**, and **TailwindCSS**. Users can view, create, search, and manage events. The project demonstrates a full workflow from data fetching and routing to form handling and state management.

---

## Features

- View upcoming events with title, date, location, and category.
- Create a new event via a form.
- Filter events by category and search by title.
- View detailed information for each event (dynamic route `/events/[id]`).
- Manage your own events: view, delete (stored in `localStorage`).
- Bonus features:
  - RSVP button to track attendees.
  - Edit events (optional).
- Fully responsive design.

---

## Task Modules Implemented

### Module 1: Project Setup & Layout
- Next.js app with simple layout (Header + Main content).
- Header navigation: **Home | Create Event | My Events**
- ✅ Evaluates: project setup, layout structure, navigation

### Module 2: Event List (Home Page)
- Display list of events (mock API / hardcoded JSON).
- Added search bar (filter by title) and category filter.
- ✅ Evaluates: data fetching, filtering, conditional rendering

### Module 3: Event Details Page
- Dynamic route `/events/[id]` to show event details: title, description, date, location, category.
- ✅ Evaluates: Next.js dynamic routing, SSR/CSR understanding

### Module 4: Create Event Page
- Form for creating events: title, description, date, location, category.
- Form submission updates local state (`localStorage`) and redirects to **My Events** page.
- ✅ Evaluates: forms, controlled components, validation

### Module 5: My Events Page
- Display only events created by the user.
- Delete functionality for user events.
- ✅ Evaluates: state management, CRUD basics

---

## Bonus Implementations
- RSVP button to track attendees.
- Event editing (optional).
- Deployed to Vercel ([Live Link](https://amarpay.vercel.app/)).

---

## Tech Stack

- **Frontend:** React 18, Next.js 15.x, TailwindCSS
- **State Management:** Local state (`useState`), `localStorage` for persistence
- **Routing:** Next.js dynamic routing (`/events/[id]`)
- **Components:** Modular React components for reusability
- **Deployment:** Vercel

---

## Evaluation Criteria Covered

✅ Clean, modular code with reusable components  
✅ Correct use of Next.js features (routing, API routes, data fetching)  
✅ State management (local state & persistence)  
✅ UI/UX: responsive design, form handling, error states  
✅ Documentation: this README, setup steps  

---
 
## Extra things 
✅ Login Logout implemented
✅ Weather alert implemented
---
  
## Getting Started

1. Clone the repo:

```bash
git clone <https://github.com/systemadmin-lab/amarpay>
cd <my-app>
npm install
# or
yarn install
