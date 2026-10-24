# Onde o TikTok é proibido ou limitado?

Estado: versão completa renderizada em `output/tiktok-completo.mp4`: 180 entradas, 552,064 segundos de contêiner, 1920×1080, 30 fps, sem narração. Base de referência fornecida pelo usuário; não é checagem mundial atualizada. Consulte sources.md para o alcance das classificações e render-notes.md para a verificação técnica. A prévia antiga não representa a ordem nem o visual final.

## Entrega

170–180 países; alvo 180 eventos de aproximadamente 3 segundos, abertura de 6 segundos e encerramento de 6 segundos = 9min12s. Sem narração. Ajustar ritmo para dar poucos segundos extras aos casos importantes, mantendo limite de dez minutos. Países por regiões, com aproximações próprias para os pequenos.

## Interface aprovada

Correções posteriores à prévia: percurso Canadá → EUA → México → demais países da América do Norte → América do Sul → Europa → Ásia → África → Oceania. `storyboard.json` foi reordenado mantendo 180 entradas e 552 segundos. A amostra antiga de oito exceções não representa a cobertura final. Textos institucionais passam a dizer explicitamente “Proibido em aparelhos do governo”, evitando a interpretação oposta. Países disponíveis não recebem painel explicativo. Em produção final, `productionStage: final` remove o rodapé de produção. Os olhos de raiva agora têm recorte SVG na esclera e na íris, abaixo da pálpebra; quadro 645 renderizado e inspecionado após a correção. O MP4 da prévia anterior ainda não foi renderizado novamente.

Somente Livre e Bloqueado nos números e na barra. Denominador = livres + bloqueados já revelados; limitados e casos incertos ficam fora. VS acompanha a fronteira verde/vermelha. Sem contador de limitados. Flash laranja com duas pulsações suaves na chegada, duração total 0,6s, sem loop e sem tonalidade permanente. Status limitado no card. Exceções: uma frase curta. Olhos com uma cor fixa por país, igual nos dois olhos; expressão de raiva com sobrancelhas espelhadas inclinadas para o centro. Câmera chega antes de revelar o resultado. Pop leve no card e nos números, whoosh discreto e sons de status.

## Pesquisa necessária

Pesquisar primeiro listas consolidadas de bloqueios e restrições, cruzar a cobertura entre elas e conferir as exceções, sobretudo reversões e mudanças recentes. Não é necessário procurar 180 leis individualmente. Construir o roteiro mundial a partir dessa base. O grupo sem bloqueio identificado pode ser apresentado como disponível segundo o levantamento, com o alcance dessa classificação documentado no arquivo de fontes. Ausência numa lista isolada e incompleta não basta. Não transformar as restrições das instituições da UE em proibições nacionais de todos os membros. Datas do levantamento e procedência ficam nos arquivos do episódio; não adicionar rodapés extensos ou estatísticas na tela.

Entrada recebida: `research-input.md`. É uma lista fornecida pelo usuário, não uma conferência independente concluída.

Listas consolidadas são aceitáveis como ponto de partida; verificar datas e mudanças de status dos casos especiais. Distinguir bloqueio nacional, proibição em aparelhos governamentais, restrição de recursos e bloqueios temporários já revogados. Ausência de um país numa lista incompleta não comprova acesso livre. TikTok e Douyin são serviços diferentes. Não classificar Nepal como bloqueado apenas por notícia antiga. Confirmar a situação dos EUA na data de corte. North Korea exige fonte específica sobre disponibilidade de acesso, não inferência automática.

## Acesso testado

Em 24/10/2026, consultas HTTPS autorizadas a en.wikipedia.org, www.comparitech.com, www.reuters.com, www.gov.uk e api.github.com falharam com CONNECT 403 no proxy. www.bbc.com respondeu, mas a busca por TikTok retornou notícias sem relação com a consulta, portanto não foi aceita como evidência. A solicitação de permissão de rede retornou network:null, sem ampliar acesso.

Para prosseguir na pesquisa, liberar os destinos de fontes/listas nas configurações de rede do ambiente ou fornecer uma lista de referência local. Esse requisito bloqueia a classificação factual e o render de publicação; os ajustes independentes do motor foram implementados e passaram no TypeScript.
