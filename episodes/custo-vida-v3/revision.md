V3: marcadores SVG das estrelas dos EUA não apareciam no rasterizador dos holds. Substituídos por 50 polígonos explícitos, usados pelo navegador e pelo bake. Regerados todos os holds.

Olhos: cada país recebe tamanho fixo em coordenadas do mapa, derivado uma vez do enquadramento-alvo. O par pode atingir 225 unidades de tela no enquadramento-alvo para países amplos, com limites relativos à largura e altura de terra. O zoom transforma país e olhos juntos; não há recálculo pelo zoom atual nem compensação inversa.

Cobertura: 167 lugares, sendo 132 valores originais preservados e 35 SEM ESTIMATIVA. São 49 países africanos (48 continentais e Madagascar). África sem países faltantes nessa seleção; cinco microestados insulares continuam fora do escopo. A rota prioriza vizinhos que compartilham fronteira, dentro da mesma região. Em becos sem vizinho não visitado, usa a menor distância geográfica.

132 valores não foram extrapolados para os outros 35. A interface não mostra USD0/BRL0 nesses casos, e o marcador de preço fica oculto. Regiões excluídas são cinza no encerramento.

170 lugares foram considerados inicialmente; KIR/FSM/WSM foram retirados como microilhas remotas para evitar desvios do percurso. Os 167 restantes têm 16392 quadros (9min06,4s), com 96 quadros por evento e 6s de abertura/encerramento.

Reprodução: node scripts/normalize-us-flag.mjs; node scripts/prepare-cost-v3.mjs; node scripts/bake-shots.mjs custo-vida-v3; npm run typecheck; npx remotion render src/index.ts CostOfLiving output/custo-vida-v3-raw.mp4 --browser-executable=/usr/bin/chromium --concurrency=4; node scripts/encode-delivery.mjs output/custo-vida-v3-raw.mp4 output/custo-vida-2026-v3-completo.mp4.

Entrega: output/custo-vida-2026-v3-completo.mp4, H.264/AAC, 1920×1080, 30 fps, 16.392 quadros, 546,453 segundos e 90.744.823 bytes. SHA-256 ae41e1a4873521333bdf737741b75c954780bb05eb79907f06b1d472c762bd7a.

Verificação: 167 códigos únicos e geometrias/bandeiras disponíveis; os 132 valores USD/BRL originais permanecem idênticos; 35 ausências explicitadas sem preço inventado; 49 países africanos. Os 50 polígonos de estrelas dos EUA foram contados. Renderizada sequência de sete quadros na troca vetor/hold dos EUA (312–318), e comparados três momentos com estrelas presentes em todos. Inspecionados Líbia, EUA, Brasil, Chade, mapa global e contact sheet final. O MP4 final passou pela decodificação integral com FFmpeg -xerror sem erros. Áudio sem saturação, pico -19 dBFS e média -39,8 dBFS incluindo silêncios. Revisão visual por quadros e sequência amostrada; não houve reprodução integral assistida nem audição humana.
