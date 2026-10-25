# Produção

Composição CostOfLiving: 150 registros, 96 quadros por lugar, abertura e encerramento de 180 quadros cada. Total de 14.760 quadros, 30 fps, 1920×1080, 8min12s. Sem narração.

Dados numéricos transcritos do arquivo fornecido: 150 códigos únicos, valores USD 350–4.800, zero bandeiras ausentes. Conversões em reais preservadas. TypeScript passou. A verificação estrutural não confirma a metodologia ou a atualidade dos valores compilados pelo Gemini; ver sources.md e description.pt-BR.md.

IU específica de custo: régua logarítmica, card de custo mensal em USD e BRL aproximado, faixa de cor, progresso e cinco valores recentes. Mapas vetoriais Natural Earth 110m; pequenos territórios ausentes recebem inset de localização com bandeira. Olhos e sons reutilizam componentes originais do projeto. Não há barra binária de acesso.

Reprodução: node scripts/prepare-cost.mjs; npm run typecheck; npx remotion render src/index.ts CostOfLiving output/custo-vida-2026.mp4 --browser-executable=/usr/bin/chromium --concurrency=4; node scripts/encode-delivery.mjs output/custo-vida-2026.mp4 output/custo-vida-2026-completo.mp4.

Compressão em duas passagens com média de 1.300 kbps e teto de movimento de 7.000 kbps; AAC 64 kbps com ganho de áudio de +12 dB.

Entrega: output/custo-vida-2026-completo.mp4, 81.553.575 bytes, duração 492,053 segundos, H.264/AAC, 14.760 quadros. SHA-256: 0a45b15b20e519eaa92855b647a049366b15b3ced20f4d13ce923331f202613a.

Inspecionados quadros do Brasil, encerramento, Suíça, Índia e Malta, incluindo amostras do MP4 comprimido. Áudio analisado tecnicamente: pico -19,0 dBFS, sem saturação; média -39,8 dBFS incluindo os intervalos entre efeitos. Não houve audição humana nem reprodução integral assistida; revisão visual por quadros amostrados.

Decodificação integral do MP4 final com FFmpeg -xerror concluída sem erros. Contact sheet distribuído ao longo do episódio e abertura do arquivo comprimido conferidos. O último espaço preto do contact sheet é apenas preenchimento do mosaico de 32 posições.
