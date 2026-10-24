# Revisão visual V2

Mesma sequência e mesma base de referência do episódio anterior; não houve nova confirmação jurídica mundial. Os limites factuais de sources.md continuam válidos.

Mudanças: vetores durante a câmera em movimento, Upheaval TT nos textos principais, contadores centralizados em colunas separadas e menores a partir de 100, marcador VS separado das áreas coloridas, proporção vermelha inteiramente visível, TikTok ao lado Livre e cadeado ao lado Bloqueado. Restritos ganham aviso temporário no país, além do card e do motivo curto, sem entrar na barra.

Quadros conferidos antes da entrega: barra em 93%/7% (31,5px vermelhos visíveis), restrição no Canadá, contadores 153/8 e câmera em movimento e parada no Caribe. Os testes geométricos e o TypeScript passaram. Fonte exata confirmada por nome interno e licença original, sem substituir por Upheaval Pro.

A exportação integral foi interrompida antes de gravar o índice MP4. Recuperados 13.203 quadros H.264 completos do arquivo temporário, usando SPS/PPS de um render curto com os mesmos parâmetros; a decodificação do fluxo recuperado terminou sem erros. Para a entrega, usar apenas os primeiros 13.200 quadros decodificados, seguidos do novo render dos quadros 13.200–16.559 (3.360 quadros). Os timestamps são reconstruídos a 30 fps durante a compressão, sem depender do índice incompleto. O áudio integral original é o mesmo conjunto de efeitos do episódio, com ganho de +12 dB na entrega.

Compressão: H.264 em duas passagens, média de vídeo 1.300 kbps, teto instantâneo de 7.000 kbps e buffer de 14.000 kbps. O teto não deve ser confundido com a média: a câmera recebe mais bits quando se move. AAC 64 kbps; resolução e taxa de quadros preservadas. Não se aplica novamente o texto de abertura usado na pós-produção V1: a definição curta já é renderizada pela composição V2.

Entrega concluída: output/tiktok-v2-completo.mp4. H.264/AAC, 1920×1080, 30 fps, 16.560 quadros, 552,000 segundos (9min12s), 91.834.325 bytes. SHA-256: 2eca0aacca41500c8687bd3e89bad572cabf8d5aa7f6fdd988c5b2435856c438.

Verificação final: decodificação integral com FFmpeg -xerror concluída sem erros; contact sheet distribuído pelo episódio. Inspecionadas amostras do MP4 comprimido durante movimento no Caribe (57,5s), barra 93%/7% (352,5s), Canadá restrito (7,667s), encerramento (550s) e três quadros consecutivos na junção recuperada (439,967s–440,033s), sem salto visível nessa amostra. Encerramento com 153/8 separados, sem olhos/cards sobrepostos no mapa; Austrália com bandeira correta. Pico de áudio -14,0 dBFS, sem saturação; análise técnica, sem audição humana. Revisão visual por quadros amostrados, não reprodução integral assistida.

O vídeo anterior continua disponível para comparação. Skill atualizada e teste geométrico ampliado para garantir porcentagens complementares também nos casos de arredondamento de meio ponto; essa proteção adicional não altera nenhuma porcentagem da sequência atual.
