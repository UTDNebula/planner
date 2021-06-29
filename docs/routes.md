# Nebula Web Routing

The Nebula Web app separates business logic into distinct routes:

- `/` - The landing/marketing page
- `/app` - The primary app entrypoint
  - `/app/plans` - A list of all the user's plans
  - `/app/plan/[planId]` - CoursePlan overview
    - `/app/plan/[planId]/audit` - A place to see which degree plan requirements
      have been fulfilled
    - `/app/plan/[planId]/track` - GPA tracking and grade monitoring
  - `/app/profile` - The user's profile
  - `/app/settings` - Project Nebula Service-wide settings
  - `/app/onboarding` - A set-up flow for uninitialized users
- `/terms` - The terms of service
- `/privacy` - The app privacy policy
