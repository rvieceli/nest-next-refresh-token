# Auth

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="50"></p>
<p style="text-align: center;">This project was generated using <a href="https://nx.dev">Nx</a>.</p>

---

## Development server

Run `nx serve api` for a dev server. Api will respond from http://localhost:3333/api

> create apps/api/.env from [.env.example](/apps/api/.env.example)
> Data is stored in memory (see [UsersService](/apps/api/src/app/users/users.service.ts))

Run `nx serve web` for a dev server. Next app will be on http://localhost:4200/

> create apps/web/.env.development from [.env.development.example](/apps/web/.env.development.example)

Run `nx run-many --target=serve --all --parallel` if you want to run both apps at once in the same terminal tab.
