# yadfe: Yet Another Darwin Frontend

This is the code that powers https://trains.gaelan.me, a site which displays
UK train departure information from Darwin, the National Rail's customer-facing
train information system.

Information is loaded via [the public Huxley API][huxley], as Network Rail's
API sign-up isn't working at the minute.

[huxley]

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```
