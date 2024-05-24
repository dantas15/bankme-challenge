# Notes

## Validação

- [ValidationPipe](https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe) do Nest, com `class-validator`
  - Importante entender sobre [Pipes](https://docs.nestjs.com/pipes):
    - O nest intercepta o método antes de ser chamado, passando os parâmetros para o pipe informado (como decorator), podendo:
      - transformar (parse, por exepmlo)
      - validar (validar e jogar uma exception se não for válido)

## Testes

- Comecei realizando os testes unitários dos controllers de criação de `payables` e `assignors`
- Tentei ao máximo seguir as recomendações da [doc](https://docs.nestjs.com/fundamentals/testing)
- Utilizei [faker-js](https://github.com/faker-js/faker) para criar os dados válidos para testes
  - Para os testes que precisavam estar "errados" eu mexi manualmente
- Para testar as validações eu mockei o ValidationPipe
  - tirei de: <https://stackoverflow.com/questions/60819612/how-to-test-validation-pipe-is-throwing-the-expect-error-for-improperly-shaped-r>

## Persistêcia

- Instalando [prisma](https://docs.nestjs.com/recipes/prisma)
- rodando migrations com `prisma migrate dev` (cria as migrations baseado nas mudanças em `schema.prisma`)
  - em prod, deve-se rodar `prisma migrate deploy`

## Prisma e testes

- Referenciando o serviço do prisma: <https://stackoverflow.com/questions/70228893/testing-a-nestjs-service-that-uses-prisma-without-actually-accessing-the-databas>

## Autenticação

- Baseando em: <https://docs.nestjs.com/security/authentication>
- Nest.js já possui módulo de JWT: `@nestjs/jwt`
- `user.module` deve exportar seu UserModule (será utilizado no módulo de autenticação)
- Mock module: <https://stackoverflow.com/questions/72380764/how-to-mock-node-env-in-unit-test-using-jest>
- Tive muitos problemas em testar o login por conta do UserModule, onde mesmo mockando os métodos, não funcionava
- No entanto, consegui resolveer utilizando `useMocker`antes de compilar o TestingModule no `auth.spec.ts` na própria doc do Nest: <https://docs.nestjs.com/fundamentals/testing#auto-mocking>

## Docker

- <https://pnpm.io/docker>
- <https://github.com/woovibr/woovi-playground>
- <https://github.com/sidpalas/devops-directive-docker-course/blob/main/06-building-container-images/api-node/Dockerfile.9>
- No momento não estou utilizando .dockerignore porque estava tendo erros na hora de copiar os arquivos ()

## Observações

- talvez devesse ter feito os testes unitários por arquivo para melhor entendimento, por exemplo: `x.controller.spec.ts` e `x.service.spec.ts` ao invés de `x.spec.ts` mais generalista de cada módulo

## Test yourself

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/31618362-833b04f0-59e1-470a-af82-235bef3eb8cc?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D31618362-833b04f0-59e1-470a-af82-235bef3eb8cc%26entityType%3Dcollection%26workspaceId%3D4900b586-8375-4755-b31a-1737c1537f91#?env%5BBankme%20challenge%5D=W3sia2V5IjoiYmFzZV91cmwiLCJ2YWx1ZSI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJkZWZhdWx0Iiwic2Vzc2lvblZhbHVlIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwic2Vzc2lvbkluZGV4IjowfSx7ImtleSI6ImJlYXJlcl90b2tlbiIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6InNlY3JldCIsInNlc3Npb25WYWx1ZSI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoxYzJWeVNXUWlPaUl4WVRsa01XUXpaQzA1WWprMUxUUTFOemd0WVRreVpTMHlOakUwWm1NMllqQXpaaklpTENKeWIyeGxJam9pVlZORlVpSXNJblZ6WlhKdVlXMWxJam9pLi4uIiwic2Vzc2lvbkluZGV4IjoxfSx7ImtleSI6InVzZXJfdXNlcm5hbWUiLCJ2YWx1ZSI6ImFkbWluIiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6ImRlZmF1bHQiLCJzZXNzaW9uVmFsdWUiOiJhZG1pbiIsInNlc3Npb25JbmRleCI6Mn0seyJrZXkiOiJ1c2VyX3Bhc3N3b3JkIiwidmFsdWUiOiJhZG1pbiIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJkZWZhdWx0Iiwic2Vzc2lvblZhbHVlIjoiYWRtaW4iLCJzZXNzaW9uSW5kZXgiOjN9XQ==)
