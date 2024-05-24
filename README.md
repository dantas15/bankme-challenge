<div id="top"></div>

<p align="center">
  <img src="./.github/logo-bankme.png" alt="Logo Bankme" width="91" height="108">
</p>
<h1 align="center">
  Bankme Challenge
</h1>

### Built With

[![pnpm][pnpm]][pnpm-url]
[![Next][next.js]][next-url]
[![React][react.js]][react-url]
[![Node][node.js]][node-url]
[![Nest][nest.js]][nest-url]
[![Docker][docker]][docker-url]

## Getting started

Make sure you got the prerequisites and follow the steps below to have a local copy of this project up and running.

- You can see the notes I had during development [here][notes]
- You can see the challenge instructions [here][instructions], or you can see the original github repo of the challenge [here][challenge-repo]

## Prerequisites

You can use only Docker if you'd like, but `node` and `pnpm` are recommended for development

- Node.js

  ```sh
  https://nodejs.org/en/download/
  ```

- PNPM

  ```sh
  npm install pnpm -g
  ```

- Docker

  ```sh
  https://www.docker.com/get-started/
  ```

## Installation

Clone the repo

```sh
git clone https://github.com/dantas15/bankme-challenge.git
```

Setup configuration

```sh
pnpm config:local
```

Run the whole project

```sh
pnpm start:dev
```

- The frontend will be running at <http://localhost:3000>
- The backend will be running at <http://localhost:8080>

## Run with Docker

Build the images

```sh
docker build . --target server --tag bankme-server:latest 
```

Run the containers

```sh
docker run -d --name server -p 8080:8080 -e DATABASE_URL="file:./dev.db" -e JWT_SECRET="super_jwt_secret" bankme-server:latest
```

## Postman

You can test the API requests using Postman:

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/31618362-833b04f0-59e1-470a-af82-235bef3eb8cc?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D31618362-833b04f0-59e1-470a-af82-235bef3eb8cc%26entityType%3Dcollection%26workspaceId%3D4900b586-8375-4755-b31a-1737c1537f91#?env%5BBankme%20challenge%5D=W3sia2V5IjoiYmFzZV91cmwiLCJ2YWx1ZSI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJkZWZhdWx0Iiwic2Vzc2lvblZhbHVlIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwic2Vzc2lvbkluZGV4IjowfSx7ImtleSI6ImJlYXJlcl90b2tlbiIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6InNlY3JldCIsInNlc3Npb25WYWx1ZSI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoxYzJWeVNXUWlPaUl5T1dSaFltWm1OaTFtWWpnMUxUUm1Zak10T1RReU15MW1ZelpsTW1GaU9HTm1NVGdpTENKeWIyeGxJam9pVlZORlVpSXNJblZ6WlhKdVlXMWxJam9pLi4uIiwic2Vzc2lvbkluZGV4IjoxfSx7ImtleSI6InVzZXJfdXNlcm5hbWUiLCJ2YWx1ZSI6ImFkbWluIiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6ImRlZmF1bHQiLCJzZXNzaW9uVmFsdWUiOiJhZG1pbiIsInNlc3Npb25JbmRleCI6Mn0seyJrZXkiOiJ1c2VyX3Bhc3N3b3JkIiwidmFsdWUiOiJhZG1pbiIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJkZWZhdWx0Iiwic2Vzc2lvblZhbHVlIjoiYWRtaW4iLCJzZXNzaW9uSW5kZXgiOjN9XQ==)
<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[next.js]: https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[next-url]: https://nextjs.org/
[react.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://reactjs.org/
[node.js]: https://img.shields.io/badge/NodeJS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[node-url]: https://nodejs.org/
[nest.js]: https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white
[nest-url]: https://nestjs.com/
[pnpm]: https://img.shields.io/badge/pnpm-4B4B4B?style=for-the-badge&logo=pnpm&logoColor=F69220
[pnpm-url]: https://pnpm.io/
[docker]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[docker-url]: https://www.docker.com/

[notes]: ./notes.md
[instructions]: ./instructions.md
[challenge-repo]: https://github.com/bankme-tech/aprove-me
