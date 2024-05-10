# Notes

## Validação

- [ValidationPipe](https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe) do Nest, com `class-validator`
  - Importante entender sobre [Pipes](https://docs.nestjs.com/pipes):
    - O nest intercepta o método antes de ser chamado, passando os parâmetros para o pipe informado (como decorator), podendo:
      - transformar (parse, por exepmlo)
      - validar (validar e jogar uma exception se não for válido)
