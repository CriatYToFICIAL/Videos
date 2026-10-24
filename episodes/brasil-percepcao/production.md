# Quem realmente AMA e ODEIA o Brasil?

Estado: dados extraídos da fonte primária BBC/GlobeScan 2017; 18 registros estruturados, roteiro visual de 480 segundos e render completo concluídos. Correção pontual do enquadramento da Rússia incorporada na entrega `output/brasil-percepcao-completo.mp4`. Consulte `review.md` para o alcance da revisão.

## Entrega planejada

MP4 de 8 minutos, 1080p/30 fps, linguagem visual do demo v5, sem narração por escolha do usuário, sons discretos e descrição com fontes. Pesquisa histórica explicitamente identificada como 2017.

## Regra editorial

A pergunta do título é um gancho. A classificação precisa corresponder ao instrumento consultado: opinião favorável/desfavorável sobre Brasil, brasileiros ou influência do país são perguntas diferentes. Registrar a pergunta exata, data do levantamento, população, amostra, percentuais, margem de erro quando publicada e limites de comparação. Não chamar opinião desfavorável de ódio, nem opinião favorável de amor como se fossem resultados literais da pesquisa.

Turismo, comércio, futebol, imigração e diplomacia podem dar contexto aos cartões, mas não substituem opinião pública. Não criar um índice composto desses fatores sem justificar e apresentar a medida como índice editorial, sem a atribuir à população.

Não prometer 180 classificações antes de conhecer a cobertura. Países sem pesquisa adequada ficam sem dados; nunca preencher por estereótipo ou intuição. Brasil é o país-alvo, não um respondente estrangeiro. Territórios dependentes não herdam automaticamente opiniões do país responsável.

## Estrutura de 480 segundos

| Tempo | Conteúdo | Direção visual |
| --- | --- | --- |
| 00:00–00:15 | Pergunta inicial e surpresa que a pesquisa sustentar | Brasil em destaque, mapa global e aproximação |
| 00:15–00:40 | Como ler o mapa e o que foi medido | Legenda, fonte e ano visíveis |
| 00:40–02:00 | Américas | Visitas locais, olhos e cartões contextualizados |
| 02:00–03:20 | Europa | Âncoras de câmera novas e insets para microestados |
| 03:20–04:20 | África | Cobertura real de pesquisas, relações culturais como contexto |
| 04:20–05:20 | Oriente Médio | Distinguir população, governo e opinião sobre influência |
| 05:20–06:45 | Ásia e Oceania | Comparações apenas entre perguntas compatíveis |
| 06:45–07:35 | Casos de contraste e limites | Destacar casos realmente documentados |
| 07:35–08:00 | Mapa final e conclusão | Retirar rostos/rótulos sobrepostos, resumo com denominadores |

Essa distribuição é um alvo editorial, não tempo já renderizado. Se as fontes cobrirem poucos países, aprofundar os casos úteis em vez de alongar sequências vazias para atingir oito minutos.

## Abertura provisória

“O Brasil desperta curiosidade pelo mundo inteiro. Mas isso significa que todo mundo gosta da gente? Neste mapa, vamos separar a impressão dos números — e descobrir onde existem opiniões favoráveis, desfavoráveis e onde simplesmente faltam dados. Uma rivalidade no futebol não significa ódio a um povo. E uma parceria entre governos não prova o que a população pensa.”

## Fila de pesquisa

- GlobeScan: localizar estudos que efetivamente tenham o Brasil como país avaliado. Confirmar cobertura, pergunta e período no relatório original.
- BBC: investigar relatórios de percepção da influência dos países. Não tratar levantamento antigo como opinião em 2026.
- Pew Research: verificar existência de dados específicos sobre Brasil; a página inicial não confirma que esses dados existam.
- Itamaraty: contexto bilateral, sem usar relações diplomáticas como medida de amor/ódio.

## Bloqueios observados no ambiente

Em 24/10/2026, HTTPS para globescan.com e www.pewresearch.org retornou CONNECT 403 pelo proxy. Sem acesso ao conteúdo, não foi possível avaliar cobertura nem extrair classificações. A liberação dos destinos foi salva no rascunho do ambiente, mas ainda precisa ser aplicada. Não existe ferramenta de busca web disponível nesta sessão.

Acesso ao texto primário da GlobeScan obtido com execução autorizada em 24/10/2026. A fonte contém percentuais e classificação de 17 países estrangeiros mais a autoavaliação brasileira. A limitação de rede anterior não impede mais a extração desses dados. Locução removida do escopo por instrução do usuário.

## Antes do render final

Concluir fontes e cobertura; preparar dados com proveniência; adaptar rótulos e cartões genéricos para percepção do Brasil; autorar câmera fora das Américas (o motor atual só possui poses revisadas nas Américas); sincronizar roteiro/voz; revisar frames e áudio; renderizar; criar thumbnail e descrição.
