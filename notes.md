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
