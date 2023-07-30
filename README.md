# Nebula Planner

_Nebula Planner is a tool for planning out students' college experience_

## About

### Overview

Nebula Planner allows students to plan out including coursework, co-curricular
activities like studying abroad and research, and extracurricular involvement in
student organizations. It does this with an intuitive drag-and-drop interface
that represents various college activities as blocks and displays them in semester
groups.

### Inspiration

Planning coursework poses a challenge for many.

From choosing the right professors to knowing when to take a class, schedule
planning is the bane of any college student.

UTD students have access to tools like [UTD Grades](https://utdgrades.com) and
Rate My Professors to help them pick classes for a specific semester, but
there hasn't been a solution that allows a student to say, "I want to major in
CS, minor in psychology, and do a few internships before grad school. Generating a
plan lets me do all of that with the professors I want."

Until now, that is.

Nebula Planner is an integrated solution designed to help students plan out
their entire undergraduate experience in one place. It allows students to focus
on ensuring their college experience holistically suits their desires and
optimize for long-term success.

### Features

- Drag-and-drop interface for planning coursework by semester for any degree plan
- Sign in to save data across planning sessions
- Export to file to share your custom plan with someone else

## Contributing

Contributions are welcome!

This project uses the MIT License.

### Process

To get started, see the [contribution guide](./CONTRIBUTING.md). It'll tell you
everything you need to know.

Additionally, see the Project Nebula-wide contributors [guide](https://about.utdnebula.com/)
for more info.

Once you're ready to make some changes, see the
[issues](https://github.com/UTDNebula/planner/issues) for the repository.

If you want to brainstorm, share ideas or ask questions, start a discussion in
the [Discussions](https://github.com/UTDNebula/planner/discussions) section.

### Set-up

This project requires a working [Node.js](https://nodejs.org/en/) and NPM
installation. It also requires local environment variables since it uses [Neon](https://neon.tech) (hosted PostgresDB service), a SMTP server and Discord as authentication provider.

To start, clone the repository, and obtain the required environment keys as explained below.

```bash
git clone https://github.com/UTDNebula/planner.git
cd planner
```

#### Adding environment variables

Copy the contents of the `.env.example` file at the root of the repo to a new file called `.env`.

---

#### Setting up Neon

Neon is a hosting service for PostgresDB.

1. Install the [Neon CLI](https://neon.tech/docs/reference/cli-install).

2. Run `neon auth` to login, and follow the on-screen prompts to login or create an account.
3. Run `neonctl projects create --name planner-dev` to create a Neon project for Planner.
4. Copy the string listed under 'Connection Uri' (ex: `postgres://my-user:my-password@my-project-id.us-east-2.aws.neon.tech/neondb`) and update the `DATABASE_URL` and `DIRECT_DATABASE_URL` variables in your .env file, as shown below.

```bash
# Prisma
DATABASE_URL="<your connection uri here>"
DIRECT_DATABASE_URL="<your connection uri here>"
```

---

#### Obtaining API Keys for Auth Providers

##### Discord

1. [Go to Discord Developer Portal — My Applications](https://discord.com/developers/applications)

2. Click on New Application
   ![Step 2 screenshot](https://images.tango.us/workflows/3a8e357f-f80d-4e7d-ab54-84e04d812a3b/steps/8a6d90a6-766e-4f64-81d2-aad5369e5cc6/37e55606-f5cf-4b65-8d27-a489cf3b2548.png?crop=focalpoint&fit=crop&fp-x=0.8798&fp-y=0.0761&fp-z=2.8622&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1860%3A972)

3. Type "planner"
   ![Step 3 screenshot](https://images.tango.us/workflows/3a8e357f-f80d-4e7d-ab54-84e04d812a3b/steps/c3607164-c3fa-4863-b185-1dbe14024dcf/e808af4c-a2ad-49e6-bae1-46becac64620.png?crop=focalpoint&fit=crop&fp-x=0.5003&fp-y=0.5195&fp-z=1.7367&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1860%3A972)

4. Check By clicking Create, you agree to the Discord Developer Terms of Service and Developer Policy.
   ![Step 4 screenshot](https://images.tango.us/workflows/3a8e357f-f80d-4e7d-ab54-84e04d812a3b/steps/3817a6f6-9db3-4d2b-b854-060ea05efb07/bbaaffd2-84af-4f57-993e-fb3e518050e8.png?crop=focalpoint&fit=crop&fp-x=0.3704&fp-y=0.5967&fp-z=3.0224&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1860%3A972)

5. Click on Create
   ![Step 5 screenshot](https://images.tango.us/workflows/3a8e357f-f80d-4e7d-ab54-84e04d812a3b/steps/381f5fdc-52a6-432f-aaa7-fd3ad4a0d9fd/d3c413bd-e571-478d-b0bc-943453ea22cd.png?crop=focalpoint&fit=crop&fp-x=0.6067&fp-y=0.6944&fp-z=2.8139&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1860%3A972)

6. Click on OAuth2
   ![Step 6 screenshot](https://images.tango.us/workflows/3a8e357f-f80d-4e7d-ab54-84e04d812a3b/steps/288e8db5-a787-4d34-b880-d81f0b47c159/7ceb6401-b585-42ad-8caa-6e27c809920b.png?crop=focalpoint&fit=crop&fp-x=0.1145&fp-y=0.3308&fp-z=2.0043&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1860%3A972)

7. Click on Reset Secret
   ![Step 7 screenshot](https://images.tango.us/workflows/3a8e357f-f80d-4e7d-ab54-84e04d812a3b/steps/db7245b1-f2b3-4a3d-b6f4-7b97f8083e17/2a275c61-cd86-45b5-a6b8-cb2ac3743ec0.png?crop=focalpoint&fit=crop&fp-x=0.5390&fp-y=0.3889&fp-z=2.6534&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1860%3A972)

8. Click on Yes, do it! and copy the generated secret
   ![Step 8 screenshot](https://images.tango.us/workflows/3a8e357f-f80d-4e7d-ab54-84e04d812a3b/steps/d4f78559-7a1a-4830-8db6-4affe5fd1016/c3d73e52-d444-4079-b580-79df13b1c56b.png?crop=focalpoint&fit=crop&fp-x=0.6040&fp-y=0.5828&fp-z=2.7720&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1860%3A972)

9. Click on Add Redirect
   ![Step 9 screenshot](https://images.tango.us/workflows/3a8e357f-f80d-4e7d-ab54-84e04d812a3b/steps/1cfa1227-d190-4c8c-be1d-39ceb5695331/4153c637-e000-461c-9ce9-628100e47ca9.png?crop=focalpoint&fit=crop&fp-x=0.3013&fp-y=0.5257&fp-z=2.6458&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1860%3A972)

10. Paste "http://localhost:3000/api/auth/callback/discord" into input
    ![Step 10 screenshot](https://images.tango.us/workflows/3a8e357f-f80d-4e7d-ab54-84e04d812a3b/steps/911a3bd2-0c59-49ed-9b84-ee4a38da287c/f86cc139-bed2-4b29-86ba-41b2d8b6ac8d.png?crop=focalpoint&fit=crop&fp-x=0.4237&fp-y=0.5267&fp-z=1.6062&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1860%3A972)

11. Click on Save Changes
    ![Step 11 screenshot](https://images.tango.us/workflows/3a8e357f-f80d-4e7d-ab54-84e04d812a3b/steps/e7149cf3-3501-437c-8900-bb38ac380174/cf87bca6-2e88-43e7-993a-256b4901c0ca.png?crop=focalpoint&fit=crop&fp-x=0.8790&fp-y=0.8951&fp-z=6.0984&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1860%3A972)

#### Setup mailing server

1. [Go to Mailtrap: Email Delivery Platform](https://mailtrap.io/)

2. Click on Sign up for free and create your account
   ![Step 2 screenshot](https://images.tango.us/workflows/4a569e1c-9ecf-4f99-ab9d-a40276d05712/steps/7fffd762-ca52-48ae-8f52-9abe8bec674e/2776f9dc-afd5-4d96-9b84-f15edb03c6b2.png?crop=focalpoint&fit=crop&fp-x=0.4401&fp-y=0.4563&fp-z=2.7257&w=1200&blend-align=bottom&blend-mode=normal&blend-x=800&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n)

3. Click on Start Testing
   ![Step 6 screenshot](https://images.tango.us/workflows/4a569e1c-9ecf-4f99-ab9d-a40276d05712/steps/90d46aef-6ed5-419b-b55a-76e4b652e76e/298eac80-6d87-49a8-bdaf-86483c385401.png?crop=focalpoint&fit=crop&fp-x=0.4903&fp-y=0.2912&fp-z=2.7181&w=1200&blend-align=bottom&blend-mode=normal&blend-x=800&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n)

4. Click on Nodemailer
   ![Step 7 screenshot](https://images.tango.us/workflows/4a569e1c-9ecf-4f99-ab9d-a40276d05712/steps/1156a1c2-6851-46a2-a777-fcd821309ef0/2933e425-6917-45d5-a383-b36d627773d5.png?crop=focalpoint&fit=crop&fp-x=0.4505&fp-y=0.4830&fp-z=2.8207&w=1200&blend-align=bottom&blend-mode=normal&blend-x=800&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n)
5. Copy the host, port, user, and pass values.

---


#### Installing dependencies and seeding the database

```bash
npm install
npm run build
npm run dev
```

This will generate the DB schema, seed the DB and run a local development server on [`localhost:3000`](https://localhost:3000) by default.

<!-- TODO(@jasonappah): Copy this over to Confluence, link here. Would probably be worth revisiting/possibly rewriting other docs in this repo as well -->
<!-- Check out this [blog](https://btt.skgr.xyz/blog/nebula-planner-tech-stack) to learn about the stack we are using and a basic overview of the codebase. -->

### Contact

This project is maintained by Nebula Labs, which is an open-source initiative to build projects that improve student life at UTD. If you have
any questions about this project or Nebula Labs, join the Nebula Labs [discord](https://discord.gg/wcHs2PPXeM).

For more formal inquiries, send us a message at core-maintainers@utdnebula.com
with "[nebula-planner]" in the title. Please be as detailed as possible so we can
best assist you.
