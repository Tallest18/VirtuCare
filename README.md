# VirtuCare — Virtual Healthcare Booking

A virtual appointment booking platform where patients can browse specialist doctors, book appointments, and manage their healthcare schedule — all from the browser, no backend required.

Built as a 72-hour take-home assessment using **Next.js 16**, **TypeScript 5**, and **Tailwind CSS 4**.

---

## Live Demo

```bash
npm install && npm run dev
# → http://localhost:3000
```

---

## Features

- **Doctors Listing** — Browse 6 verified specialists across different medical fields, with ratings, experience, languages, available time slots, and consultation fees
- **Appointment Booking** — 3-step flow: select date + time slot → review → confirm
- **Double-booking Prevention** — Already-booked slots are visually disabled and cannot be selected
- **Appointments Dashboard** — View all bookings, filter by status (upcoming / cancelled), cancel or delete appointments
- **Persistent Storage** — All appointments survive page refresh via `localStorage`
- **Responsive Design** — Fully functional on mobile and desktop
- **Loading Skeletons** — Shimmer placeholders while the dashboard loads
- **Empty States** — Contextual messages with clear calls-to-action
- **Form Validation** — Per-field errors with inline feedback

---

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| Next.js | 16.2.4 | Framework — App Router, file-based routing |
| React | 19.2.4 | UI — hooks, component model |
| TypeScript | 5 | Type safety — strict mode throughout |
| Tailwind CSS | 4 | Styling — utilities, responsive, transitions |
| Lucide React | 1.8 | Icons |
| localStorage | Browser API | Appointment persistence |

---

## Project Structure

```
virtucare/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout — HTML shell + persistent Navbar
│   ├── page.tsx                  # Homepage ( / )
│   ├── globals.css               # Global styles, fonts, keyframe animations
│   ├── doctors/
│   │   ├── page.tsx              # Doctors listing ( /doctors )
│   │   └── [id]/page.tsx         # Doctor detail + booking ( /doctors/:id )
│   └── appointments/
│       └── page.tsx              # Appointments dashboard ( /appointments )
│
├── components/
│   ├── ui/
│   │   └── Navbar.tsx            # Site navigation — desktop + mobile
│   ├── doctors/
│   │   └── BookingClient.tsx     # 3-step booking wizard (client component)
│   └── appointments/
│       └── AppointmentsDashboard.tsx  # Dashboard with filters + actions
│
├── lib/
│   ├── doctors.ts                # Mock doctor data + colour maps
│   └── appointments.ts           # localStorage CRUD + date/ID helpers
│
└── types/
    └── index.ts                  # TypeScript interfaces (Doctor, Appointment, TimeSlot)
```

---

## My Approach

### Start with the data model

Before writing any UI, I defined the TypeScript interfaces in `types/index.ts`. Getting the data shapes right first meant every component, utility function, and piece of state had a clear contract from the start — no guessing what fields exist or what types they are.

The three interfaces (`TimeSlot`, `Doctor`, `Appointment`) were designed to be minimal but complete. I asked: what does the UI actually need to render? Nothing more was added.

### Separate concerns into layers

The project is structured in four distinct layers, each with one job:

1. **`types/`** — pure data shapes, no logic
2. **`lib/`** — pure functions (data access, localStorage, formatting) with no React dependency
3. **`components/`** — UI components that consume lib functions
4. **`app/`** — thin Next.js route pages that import components

This means the business logic (booking, double-booking prevention, cancellation) can be read, reasoned about, and potentially tested entirely independently of React. It also makes the components easier to follow — they focus on rendering and user interaction, not data management.

### Use the Next.js server/client split deliberately

Not every component needs to be a client component. Pages like the homepage and the doctors listing are pure server components — no state, no browser APIs, just data-in / HTML-out. This keeps them fast and simple.

The server/client boundary is drawn at the smallest useful unit:
- `/doctors/[id]/page.tsx` is a server component that does the doctor lookup and `generateMetadata` for SEO, then passes data as a prop to `BookingClient` (client component), which needs `useState` and `useEffect`
- The appointments page is a thin server wrapper around `AppointmentsDashboard`, which is client-side because it reads from `localStorage`

### Build the booking flow as a state machine

The booking wizard (`BookingClient.tsx`) manages a `step` variable typed as `'select' | 'confirm' | 'success'`. Each step renders a completely different UI panel. This is cleaner than toggling lots of boolean flags and makes the flow easy to follow — at any point you know exactly where the user is and what state is valid.

### Design for polish without over-engineering

Small details matter in a product assessment:
- Staggered card entrance animations using CSS `animation-delay` (no library needed)
- A frosted glass navbar with `backdrop-blur-md`
- Inline confirmation dialogs instead of modals (simpler, more mobile-friendly)
- A shimmer skeleton on the dashboard instead of a spinner
- Cancelled appointments are visually dimmed with `opacity-70`
- Doctor colours are consistent across every appearance (listing, sidebar, dashboard)

---

## Key Decisions

### Denormalized appointment storage

When saving an appointment, I store the doctor's name, specialty, and avatar initials directly on the appointment object — not just the `doctorId`.

This means the dashboard can render appointment cards without doing a doctor lookup. In a real app, doctor data can change (name corrections, specialty updates). Storing the snapshot of what was booked at booking time is more correct, and makes the dashboard self-contained and resilient.

### Soft delete for cancellations

Cancelling an appointment sets `status: 'cancelled'` rather than removing the record. Users can see their full appointment history including cancellations, which is expected behaviour in healthcare contexts. Hard delete (removing from `localStorage` entirely) is only available from the cancelled state, so users must explicitly acknowledge the cancellation first before permanently removing the record.

### Slot IDs scoped per doctor, not globally unique

Each doctor has their own slots with ids `s1` through `s7`. Two doctors can both have a slot with `id: 's1'`. Double-booking prevention uses a **three-part composite key** — `(doctorId, date, slotId)` — rather than a global slot id. This is simpler and more realistic: you're booking a specific doctor at a specific time, not a globally unique slot object.

### Inline confirmation dialogs over modals

Destructive actions (cancel, delete) use an inline pattern: clicking the button replaces it with a "Are you sure? Yes / No" row in the same card. No modal overlay, no focus trap, no portal rendering. It achieves the same safety goal (preventing accidental destructive actions) with far less complexity, and works better on mobile where modals often cause layout and scroll issues.

### CSS animations over a motion library

All animations (shimmer, card entrance, page transition) are implemented with CSS `@keyframes`. No Framer Motion or similar library. This keeps the bundle lean, eliminates a JavaScript dependency for what is essentially a visual concern, and produces identical results for these use cases.

### Timezone-safe date formatting

Both date formatters append `T00:00:00` before parsing:

```ts
const date = new Date(dateStr + "T00:00:00");
```

Without this, JavaScript parses `YYYY-MM-DD` strings as **UTC midnight**, which displays as the previous day for users in timezones behind UTC. Appending `T00:00:00` forces local time interpretation and eliminates this class of bug entirely.

---

## Challenges

### localStorage doesn't exist on the server

Next.js renders pages on the server during build and on first request. `localStorage` is a browser-only API — calling it server-side throws a `ReferenceError`.

Every `localStorage` access in `lib/appointments.ts` is guarded with:

```ts
if (typeof window === "undefined") return [];
```

This check returns safe fallbacks during server-side rendering and lets the real read happen on the client after hydration.

### Showing booked slots reactively without a database

There is no server to query for "which slots are already booked." Instead, every time the user selects a date in the booking form, a `useEffect` runs `isSlotBooked()` for every slot and builds a `Set<string>` of booked slot ids:

```ts
useEffect(() => {
  if (selectedDate) {
    const booked = new Set<string>();
    doctor.availableSlots.forEach(slot => {
      if (isSlotBooked(doctor.id, selectedDate, slot.id)) {
        booked.add(slot.id);
      }
    });
    setBookedSlots(booked);
    setSelectedSlot(null); // clear selection on date change
  }
}, [selectedDate, doctor.id, doctor.availableSlots]);
```

The selected slot is also cleared when the date changes — a slot available today might be booked on a different date, so carrying the selection forward would be incorrect.

### Balancing the Server/Client component boundary

The `/doctors/[id]` route needed two things that don't naturally coexist: `generateMetadata` (server-only) for the page `<title>`, and `useState`/`useEffect` (client-only) for the booking form. You can't put both in a single component.

The solution is a two-component pattern: the page file (`page.tsx`) is a server component that handles the doctor lookup and `generateMetadata`, then passes the doctor object as a prop to `BookingClient`, which is a `'use client'` component. The server does what only the server can do; the client does what only the client can do.

### Making the loading skeleton meaningful

`localStorage` reads are synchronous — in reality, `getAppointments()` returns in under a millisecond. If the dashboard mounted and immediately set state, the skeleton would flash so briefly it would be invisible (and potentially cause a layout flicker).

A deliberate 400ms delay was added before reading localStorage:

```ts
useEffect(() => {
  const timer = setTimeout(() => {
    setAppointments(getAppointments());
    setLoading(false);
  }, 400);
  return () => clearTimeout(timer);
}, []);
```

The cleanup function (`clearTimeout`) prevents a state update on an unmounted component if the user navigates away before the timer fires.

---

## Running the Project

```bash
# Unzip the project
cd virtucare

# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:3000

# Production build
npm run build && npm start
```

**Node.js 18+** is required.

---

## What I Would Add With More Time

- **Search and filter** on the doctors listing (by specialty, language, price range)
- **Doctor availability by day** — different slots per day of the week per doctor
- **Appointment reminders** — browser notifications via the Notifications API
- **Unit tests** — the `lib/` functions are pure and ideal for Vitest
- **Optimistic UI updates** — reflect cancellations instantly before confirming the storage write
- **Accessible date picker** — the native `<input type="date">` varies across browsers; a custom accessible picker would be more consistent
