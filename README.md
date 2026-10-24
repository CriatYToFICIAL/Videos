# World Map Video Engine

Motor inicial para vídeos de mapa animado orientados por dados. O episódio muda em `episodes/<id>`; a composição, geometrias e validações permanecem reutilizáveis.

## Fluxo de um novo vídeo

1. Crie a pasta: `npm run create:episode -- tema-do-video`.
2. Defina a pergunta, o escopo, as categorias e o roteiro em `metadata.json` e `script.pt-BR.md`.
3. Preencha `countries.json` com uma linha por país, fonte, data de consulta e nível de confiança.
4. Registre a metodologia e as fontes em `sources.md`.
5. Valide: `npm run validate -- episodes/tema-do-video`.
6. Renderize um frame para revisão: `npm run render -- tema-do-video --frame 240`.
7. Renderize o MP4: `npm run render -- tema-do-video`.

Os arquivos resultantes ficam em `output/`, que é ignorado pelo Git.

## Dados e qualidade

`countries.json` usa ISO 3166-1 alpha-3. Os estados aceitos são `yes`, `partial`, `no` e `unknown`. Cada registro precisa de URL de fonte, data de verificação, nota e nível de confiança. O validador cria `validation.json` dentro da pasta do episódio.

O episódio `demo-access` contém dados inteiramente fictícios e existe somente para verificar a instalação do renderer.

## Stack

- Remotion e React: composição, timeline e renderização.
- World Atlas + D3 Geo + TopoJSON: mapa vetorial e projeção.
- FFmpeg: disponível para normalização de áudio e pós-processamento quando o episódio incluir locução e trilha.

Para abrir o editor visual local, execute `npm run studio`.
