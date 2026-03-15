# Rotina de Treino

App simples para acompanhar a rotina de treino (Treino A, B, C e Cardio), com checklist por exercício, imagens e vídeos de correção.

**Página:** [GitHub Pages](https://tumais.github.io/Daily-Exercises/)

## Estrutura

- **Treino A** — Peito e Tríceps  
- **Treino B** — Pernas e posterior  
- **Treino C** — Costas, Bíceps e Ombros  
- **Cardio** — Corrida ou bike  

Cada exercício pode ter imagem, vídeo de correção (botão "Ver vídeo") e link para buscar no YouTube.

## Dicas

Na parte superior da página há uma seção **"Dicas"** com vídeos (por exemplo, alimentação — "O que comer"). Eles aparecem ao abrir a página para você revisar quando quiser.

**Para adicionar mais vídeos:** edite o array `VIDEOS_LEGAIS` em `data.js`. Cada item deve ter:

- `titulo` — nome do vídeo  
- `descricao` — texto opcional  
- `video` — caminho do arquivo (ex.: `videos/nome-do-video.mp4`) ou URL do YouTube  

Exemplo:

```js
{ titulo: 'Outro vídeo', descricao: 'Descrição opcional', video: 'videos/outro-video.mp4' }
```

## Vídeos em WebM

O app usa apenas vídeos **WebM** (menor e bom no navegador). Converta qualquer `.mp4` para `.webm` com o script abaixo.

### Converter MP4 para WebM

Com [FFmpeg](https://ffmpeg.org/) instalado, use o script na pasta do projeto:

**Windows (PowerShell):**
```powershell
.\convert-to-webm.ps1
```

Ou manualmente, para cada vídeo:
```bash
ffmpeg -i "videos/nome.mp4" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus "videos/nome.webm"
```

O script gera o `.webm` na mesma pasta do `.mp4`. Atualize os caminhos em `data.js` para `.webm` e remova o `.mp4` se quiser.

## Uso

Abra `index.html` no navegador. O progresso (checklist "Feito") é salvo no navegador (localStorage).
