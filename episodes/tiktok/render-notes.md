# Entrega técnica

Alvo: 180 entradas, 1920×1080, 30 fps, 16.560 quadros (9min12s), sem narração.

Os mapas usam a mesma base world-atlas 50m e bandeiras SVG do projeto. O script bake-map.mjs rasteriza mapas em blocos e texturas para deslocamentos. bake-shots.mjs gera imagens dos enquadramentos estáveis a partir dos SVGs originais em resolução de saída; o renderer continua animando olhos, câmera, cards, flashes e som por quadro. As âncoras são compartilhadas em src/camera-anchors.json. Não é geração de mapas por modelo de imagem.

Reprodução: npm ci; node scripts/bake-map.mjs; node scripts/bake-shots.mjs tiktok; npm run render -- tiktok. O browser usado é /usr/bin/chromium. Assets pré-processados devem existir antes da composição final. O script de render valida os dados e constrói as props. Limitações factuais estão em sources.md; não confundir a validação de formato com confirmação dos fatos.

Entrega: output/tiktok-completo.mp4, H.264/AAC, 1920×1080, 30 fps, 16.560 quadros, duração 552,064 segundos, 72.414.665 bytes. SHA-256: b2c5b333597294c623e9ccd265642c476545a76b00461cc5c039a60115ebaffd.

Conferidos quadros distribuídos pelo episódio e amostras de Jamaica, Andorra, China e encerramento. Barra 100% verde após países livres com limitados anteriores fora do denominador; encerramento 153 livres e 8 bloqueados, 95%/5% (14 limitados e 5 incertos excluídos). Os quadros amostrados de Jamaica e Andorra incluíram piscadas; os olhos não são estáticos.

Detectada colisão do ID 036 entre Australia e Ashmore and Cartier Is. na geometria de origem. O bake-map passou a preservar a primeira feição canônica, em vez de sobrescrever a textura australiana com uma imagem minúscula. Checadas as dimensões das 180 texturas contra os limites geométricos: zero divergências. Renderizados novamente os quadros 15570–16559 (33s finais) e incorporados ao original, preservando o áudio e a quantidade de quadros.

Na finalização foi incluída uma definição curta de Livre na abertura, sem notas de produção persistentes. Compressão H.264 com limite de bitrate para download no GitHub, preservando resolução e fps. Ganho de áudio +12dB; análise do AAC final: pico -14,0 dBFS, sem saturação. Sem narração ou música, apenas efeitos pontuais. A revisão visual foi por amostras de quadros, não reprodução integral; não houve audição humana.
