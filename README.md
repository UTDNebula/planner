# Nebula Planner

Nebula Planner is a degree planning tool for UTD students.

### Features

- Drag-and-drop interface for planning coursework by semester for any degree plan
- Real-time degree validation and prerequisite validation
- Export to file to share your custom plan with someone else

## Contributing

Contributions are welcome! Join the Discord and request access to the Planner dev team.

<a href="https://discord.utdnebula.com/"><img src=".github/discord-join-banner.svg" /></a>

### Set-up

This project requires [Node v16+](https://nodejs.org/en/) and NPM
installation. It also requires local environment variables since it uses [Neon](https://neon.tech) (hosted PostgresDB service), a SMTP server, and Discord as authentication provider.

<details>
<summary>
Pre-requisites
</summary> <br />
To be able to start development on Planner make sure that you have the following pre-requisites installed:

- [Node.js v16 or above](https://nodejs.org/en)
- [Git](https://git-scm.com/downloads)
- [Python3.11](https://www.python.org/downloads)
</details>

<details>
<summary>
Installation and configuration
</summary> <br />

1. Clone repository and install web dependencies:

```bash
git clone https://github.com/UTDNebula/planner.git
cd planner
npm install
```

2.  Copy `.env.example file` to `.env`:

    Copy the contents of the `.env.example` file at the root of the repo to a new file called `.env`.

3.  Setting up Neon:

    Neon is a hosting service for PostgreSQL.

    1.  Install the [Neon CLI](https://neon.tech/docs/reference/cli-install).
    2.  Run `neonctl auth` and follow the on-screen prompts to login or create an account.
    3.  Run `neonctl projects create --name planner-dev` to create a Neon project for Planner.
    4.  Copy the string listed under 'Connection Uri' (ex: `postgres://my-user:my-password@my-project-id.us-east-2.aws.neon.tech/neondb`) and update the `DATABASE_URL` and `DIRECT_DATABASE_URL` variables in your .env file, as shown below.

        ```bash
        # Prisma
        DATABASE_URL="<your connection uri here>"
        DIRECT_DATABASE_URL="<your connection uri here>"
        ```

4.  Apply database migrations:

    ```bash
    npx prisma migrate dev
    ```

5.  Request `PLATFORM_DATABASE_URL` from someone on the team.

6.  Set `NEXTAUTH_URL` to `http://localhost:3000` and `NEXTAUTH_SECRET=abc123`

7.  Setting up an auth provider. You need at least one of these to log in. We recommend you only add Discord for convenience.

      <details>
      <summary>
      Discord
      </summary> <br />

    1.  [Go to Discord Developer Portal — My Applications](https://discord.com/developers/applications)

    2.  Click on New Application <br />
        <img src="https://images.tango.us/workflows/3a8e357f-f80d-4e7d-ab54-84e04d812a3b/steps/8a6d90a6-766e-4f64-81d2-aad5369e5cc6/37e55606-f5cf-4b65-8d27-a489cf3b2548.png?crop=focalpoint&fit=crop&fp-x=0.8798&fp-y=0.0761&fp-z=2.8622&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1860%3A972" width="500"/>

    3.  Type "planner" <br />
        <img src="https://images.tango.us/workflows/3a8e357f-f80d-4e7d-ab54-84e04d812a3b/steps/c3607164-c3fa-4863-b185-1dbe14024dcf/e808af4c-a2ad-49e6-bae1-46becac64620.png?crop=focalpoint&fit=crop&fp-x=0.5003&fp-y=0.5195&fp-z=1.7367&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1860%3A972" width="500"/>

    4.  Agree to their terms of service <br />
        <img src="https://images.tango.us/workflows/3a8e357f-f80d-4e7d-ab54-84e04d812a3b/steps/3817a6f6-9db3-4d2b-b854-060ea05efb07/bbaaffd2-84af-4f57-993e-fb3e518050e8.png?crop=focalpoint&fit=crop&fp-x=0.3704&fp-y=0.5967&fp-z=3.0224&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1860%3A972" width="500"/>

    5.  Click to create <br />
        <img src="https://images.tango.us/workflows/3a8e357f-f80d-4e7d-ab54-84e04d812a3b/steps/381f5fdc-52a6-432f-aaa7-fd3ad4a0d9fd/d3c413bd-e571-478d-b0bc-943453ea22cd.png?crop=focalpoint&fit=crop&fp-x=0.6067&fp-y=0.6944&fp-z=2.8139&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1860%3A972" width="500"/>

    6.  Click on OAuth2 <br />
        <img src="https://images.tango.us/workflows/3a8e357f-f80d-4e7d-ab54-84e04d812a3b/steps/288e8db5-a787-4d34-b880-d81f0b47c159/7ceb6401-b585-42ad-8caa-6e27c809920b.png?crop=focalpoint&fit=crop&fp-x=0.1145&fp-y=0.3308&fp-z=2.0043&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1860%3A972" width="500"/>

    7.  Click on reset the secret <br />
        <img src="https://images.tango.us/workflows/3a8e357f-f80d-4e7d-ab54-84e04d812a3b/steps/db7245b1-f2b3-4a3d-b6f4-7b97f8083e17/2a275c61-cd86-45b5-a6b8-cb2ac3743ec0.png?crop=focalpoint&fit=crop&fp-x=0.5390&fp-y=0.3889&fp-z=2.6534&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1860%3A972" width="500"/>

    8.  Click on "Yes, do it!" and copy the generated secret <br />
        <img src="https://images.tango.us/workflows/3a8e357f-f80d-4e7d-ab54-84e04d812a3b/steps/d4f78559-7a1a-4830-8db6-4affe5fd1016/c3d73e52-d444-4079-b580-79df13b1c56b.png?crop=focalpoint&fit=crop&fp-x=0.6040&fp-y=0.5828&fp-z=2.7720&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1860%3A972" width="500"/>

    9.  Click on "Add Redirect" <br />
        <img src="https://images.tango.us/workflows/3a8e357f-f80d-4e7d-ab54-84e04d812a3b/steps/1cfa1227-d190-4c8c-be1d-39ceb5695331/4153c637-e000-461c-9ce9-628100e47ca9.png?crop=focalpoint&fit=crop&fp-x=0.3013&fp-y=0.5257&fp-z=2.6458&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1860%3A972" width="500"/>

    10. Paste "http://localhost:3000/api/auth/callback/discord" into input <br />
        <img src="https://images.tango.us/workflows/3a8e357f-f80d-4e7d-ab54-84e04d812a3b/steps/911a3bd2-0c59-49ed-9b84-ee4a38da287c/f86cc139-bed2-4b29-86ba-41b2d8b6ac8d.png?crop=focalpoint&fit=crop&fp-x=0.4237&fp-y=0.5267&fp-z=1.6062&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1860%3A972" width="500"/>

    11. Click on save changes at the bottom <br />
        <img src="https://images.tango.us/workflows/3a8e357f-f80d-4e7d-ab54-84e04d812a3b/steps/e7149cf3-3501-437c-8900-bb38ac380174/cf87bca6-2e88-43e7-993a-256b4901c0ca.png?crop=focalpoint&fit=crop&fp-x=0.8790&fp-y=0.8951&fp-z=6.0984&w=1200&mark-w=0.2&mark-pad=0&mark64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n&ar=1860%3A972" width="500"/>

    12. Copy and paste your secret and clientID (also on the OAuth2 page) into your `.env`:

        ```bash
           # Next Auth Discord Provider
           DISCORD_CLIENT_ID=<discord-client-id-goes-here>
           DISCORD_CLIENT_SECRET=<discord-secret-goes-here>
        ```

      </details>

      <details>
      <summary>
      Nodemailer
      </summary> <br />

    1. [Go to Mailtrap: Email Delivery Platform](https://mailtrap.io/)

    2. Click on Sign up for free and create your account <br />
       <img src="https://images.tango.us/workflows/4a569e1c-9ecf-4f99-ab9d-a40276d05712/steps/7fffd762-ca52-48ae-8f52-9abe8bec674e/2776f9dc-afd5-4d96-9b84-f15edb03c6b2.png?crop=focalpoint&fit=crop&fp-x=0.4401&fp-y=0.4563&fp-z=2.7257&w=1200&blend-align=bottom&blend-mode=normal&blend-x=800&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n" width="500" />

    3. Click on Start Testing <br />
       <img src="https://images.tango.us/workflows/4a569e1c-9ecf-4f99-ab9d-a40276d05712/steps/90d46aef-6ed5-419b-b55a-76e4b652e76e/298eac80-6d87-49a8-bdaf-86483c385401.png?crop=focalpoint&fit=crop&fp-x=0.4903&fp-y=0.2912&fp-z=2.7181&w=1200&blend-align=bottom&blend-mode=normal&blend-x=800&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n" width="500" />

    4. Click on Nodemailer <br />
       <img src="https://images.tango.us/workflows/4a569e1c-9ecf-4f99-ab9d-a40276d05712/steps/1156a1c2-6851-46a2-a777-fcd821309ef0/2933e425-6917-45d5-a383-b36d627773d5.png?crop=focalpoint&fit=crop&fp-x=0.4505&fp-y=0.4830&fp-z=2.8207&w=1200&blend-align=bottom&blend-mode=normal&blend-x=800&blend64=aHR0cHM6Ly9pbWFnZXMudGFuZ28udXMvc3RhdGljL21hZGUtd2l0aC10YW5nby13YXRlcm1hcmsucG5n" width="500" />
    5. Copy the host, port, user, and pass values.

    </details>

8.  Run and configure validator

    ```bash
    cd validator
    python3.11 -m venv venv # Create virtual environment
    source venv/bin/activate # Use virtual enviornment
    pip install -r requirements.txt # Install dependencies
    flask --app api run
    ```

    Add the validator to `.env`:

    ```bash
    # DEGREE VALIDATOR
    NEXT_PUBLIC_VALIDATOR=http://127.0.0.1:5000
    ```

9.  Setup pre-commit hooks:

    ```bash
    npm run prepare
    ```

10. Generate `Prisma` client and run web server:

    ```bash
    npm run prisma:generate
    npm run dev
    ```

   </details>

<br />
<!-- TODO(@jasonappah): Copy this over to Confluence, link here. Would probably be worth revisiting/possibly rewriting other docs in this repo as well -->
<!-- Check out this [blog](https://btt.skgr.xyz/blog/nebula-planner-tech-stack) to learn about the stack we are using and a basic overview of the codebase. -->

Not sure where to start? Join the [Discord](https://discord.utdnebula.com/) to get help.

## Internals

- [Workflows and Deployment](docs/WORKFLOWS_AND_DEPLOYMENT.md)
- [Validator](docs/VALIDATOR.md)

### Contact

For more formal inquiries, send us a message at core-maintainers@utdnebula.com
with "[nebula-planner]" in the title.
