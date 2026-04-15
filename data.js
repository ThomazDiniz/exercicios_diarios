/**
 * Dados da rotina de treino — Treino A, B, C e Cardio
 * imagem: caminho local (images/...) — todas as imagens na pasta images
 * video: caminho local .webm (videos/... ou Dicas/...) ou URL YouTube — vídeo de correção (opcional)
 */
const ROTINA = {
  A: [
    { id: 'A-suplementos', grupo: 'Suplementação', exercicio: 'Tomar Omega 3, multivitamínico e creatina', equipamento: 'Conforme orientação', observacoes: 'Siga a dosagem do rótulo ou do profissional. Tome com água e, se indicado, junto às refeições.', imagem: 'images/Omega3_Premium_Creatin_Gummy.webp', video: null, pinnedFirst: true, pinnedRank: 0 },
    { id: 'A-alongamento', grupo: 'Alongamento', exercicio: 'Alongamento', equipamento: 'Sem equipamento', observacoes: 'Faça um aquecimento leve e alongue sem dor. Respire fundo e mantenha 20–30s cada posição.', imagem: 'images/alongamentos-dicas.png', video: null, pinnedFirst: true, pinnedRank: 1 },
    { id: 'A-aquecimento', grupo: 'Aquecimento', exercicio: 'Aquecimento', equipamento: 'Tênis / bike ergométrica ou externa', observacoes: 'Corrida ou bike por 5-10 minutos em ritmo leve a moderado, para preparar o corpo antes do treino.', imagem: 'images/cardio-corrida-giphy.gif', video: null, pinnedFirst: true, pinnedRank: 2 },
    { id: 'A-1', grupo: 'Peito', exercicio: 'Flexão de braços', equipamento: 'Peso corporal', observacoes: 'Corpo alinhado, cotovelos não abrem demais. Para dificultar: pés elevados ou mãos fechadas.', imagem: 'images/flexao-bracos.gif', video: null },
    { id: 'A-2', grupo: 'Peito', exercicio: 'Supino no chão com halteres', equipamento: 'Halteres e colchonete', observacoes: 'Omoplatas levemente encaixadas. Desça até os cotovelos formarem ~90°.', imagem: 'images/supino-chao.gif', video: null },
    { id: 'A-4', grupo: 'Peito', exercicio: 'Crucifixo com halteres', equipamento: 'Elástico ou halteres', observacoes: 'Braços levemente flexionados. Abra até sentir alongamento no peito, sem forçar o ombro.', imagem: 'images/crucifixo.gif', video: null },
    { id: 'A-5', grupo: 'Tríceps', exercicio: 'Tríceps deitado testa (leva atrás da cabeça)', equipamento: 'Halteres', observacoes: 'Cotovelos fixos, apontando para cima. Desça controlado até atrás da cabeça.', imagem: 'images/triceps-testa.gif', video: null },
    { id: 'A-6', grupo: 'Tríceps', exercicio: 'Tríceps francês', equipamento: 'Halteres', observacoes: 'Cotovelos próximos, movimento só no antebraço. Pode fazer alternado ou com as duas mãos.', imagem: 'images/triceps-frances.gif', video: null },
    { id: 'A-3', grupo: 'Peito', exercicio: 'Supino inclinado TRX ou elástico', equipamento: 'TRX ou elástico na porta', observacoes: 'Incline o tronco para dar ângulo. Contraia o peito no topo do movimento.', imagem: 'images/supino-inclinado.gif', video: null },
    { id: 'A-abdominal', grupo: 'Abdominal', exercicio: 'Abdominal', equipamento: 'Colchonete', observacoes: 'Crunch: suba só as escápulas, expire ao contrair. Ou prancha para isometria.', imagem: 'images/abdominal-crunch-pinimg.gif', video: null },
    { id: 'A-prancha', grupo: 'Core', exercicio: 'Prancha', equipamento: 'Colchonete', observacoes: 'Cabeça, quadril e tornozelos alinhados. Contraia o abdômen e não deixe o quadril subir ou cair.', imagem: 'images/abdominal-prancha-frontal-atletis.png', video: 'videos/Prancha Correção.webm' },
  ],
  B: [
    { id: 'B-suplementos', grupo: 'Suplementação', exercicio: 'Tomar Omega 3, multivitamínico e creatina', equipamento: 'Conforme orientação', observacoes: 'Siga a dosagem do rótulo ou do profissional. Tome com água e, se indicado, junto às refeições.', imagem: 'images/Omega3_Premium_Creatin_Gummy.webp', video: null, pinnedFirst: true, pinnedRank: 0 },
    { id: 'B-alongamento', grupo: 'Alongamento', exercicio: 'Alongamento', equipamento: 'Sem equipamento', observacoes: 'Faça um aquecimento leve e alongue sem dor. Respire fundo e mantenha 20–30s cada posição.', imagem: 'images/alongamentos-dicas.png', video: null, pinnedFirst: true, pinnedRank: 1 },
    { id: 'B-aquecimento', grupo: 'Aquecimento', exercicio: 'Aquecimento', equipamento: 'Tênis / bike ergométrica ou externa', observacoes: 'Corrida ou bike por 5-10 minutos em ritmo leve a moderado, para preparar o corpo antes do treino.', imagem: 'images/cardio-corrida-giphy.gif', video: null, pinnedFirst: true, pinnedRank: 2 },
    { id: 'B-1', grupo: 'Pernas', exercicio: 'Agachamento com halteres', equipamento: 'Halteres', observacoes: 'Joelhos na linha dos pés, desça até coxas paralelas ao chão. Elástico acima dos joelhos ativa mais o glúteo.', imagem: 'images/agachamento.gif', video: null },
    { id: 'B-2', grupo: 'Pernas', exercicio: 'Avanço com halteres', equipamento: 'Halteres e peso de tornozelo', observacoes: 'Passo largo, joelho da frente a 90°. Não deixe o joelho passar da ponta do pé.', imagem: 'images/avancamento.gif', video: null },
    { id: 'B-4', grupo: 'Glúteo', exercicio: 'Elevação pélvica', equipamento: 'Halteres e peso de perna', observacoes: 'Pés no chão, empurre o quadril para cima e contraia o glúteo no topo. Uma perna ou duas.', imagem: 'images/elevacao-pelvica.gif', video: null },
    { id: 'B-7', grupo: 'Glúteo', exercicio: 'Abdução de quadril', equipamento: 'Elástico + peso de tornozelo', observacoes: 'Deitado de lado ou em pé: leve a perna para fora sem girar o quadril. Foco no glúteo médio.', imagem: 'images/abducao-quadril.gif', video: null },
    { id: 'B-8', grupo: 'Glúteo', exercicio: 'Glúteo 4 apoios', equipamento: 'Colchonete + peso de perna', observacoes: 'Joelho a 90°, estenda a perna para trás sem arquear a lombar. Contraia o glúteo no topo.', imagem: 'images/gluteo-4-apoios.gif', video: null },
    { id: 'B-9', grupo: 'Panturrilha', exercicio: 'Panturrilha em pé', equipamento: 'Halteres + peso de perna', observacoes: 'Suba na ponta dos pés e segure 1–2 s no topo. Desça controlado para alongar.', imagem: 'images/panturrilha.gif', video: null },
    { id: 'B-abdominal', grupo: 'Abdominal', exercicio: 'Abdominal', equipamento: 'Colchonete', observacoes: 'Crunch: suba só as escápulas, expire ao contrair. Ou prancha para isometria.', imagem: 'images/abdominal-crunch-pinimg.gif', video: null },
    { id: 'B-prancha', grupo: 'Core', exercicio: 'Prancha', equipamento: 'Colchonete', observacoes: 'Cabeça, quadril e tornozelos alinhados. Contraia o abdômen e não deixe o quadril subir ou cair.', imagem: 'images/abdominal-prancha-frontal-atletis.png', video: 'videos/Prancha Correção.webm' },
  ],
  C: [
    { id: 'C-suplementos', grupo: 'Suplementação', exercicio: 'Tomar Omega 3, multivitamínico e creatina', equipamento: 'Conforme orientação', observacoes: 'Siga a dosagem do rótulo ou do profissional. Tome com água e, se indicado, junto às refeições.', imagem: 'images/Omega3_Premium_Creatin_Gummy.webp', video: null, pinnedFirst: true, pinnedRank: 0 },
    { id: 'C-alongamento', grupo: 'Alongamento', exercicio: 'Alongamento', equipamento: 'Sem equipamento', observacoes: 'Faça um aquecimento leve e alongue sem dor. Respire fundo e mantenha 20–30s cada posição.', imagem: 'images/alongamentos-dicas.png', video: null, pinnedFirst: true, pinnedRank: 1 },
    { id: 'C-aquecimento', grupo: 'Aquecimento', exercicio: 'Aquecimento', equipamento: 'Tênis / bike ergométrica ou externa', observacoes: 'Corrida ou bike por 5-10 minutos em ritmo leve a moderado, para preparar o corpo antes do treino.', imagem: 'images/cardio-corrida-giphy.gif', video: null, pinnedFirst: true, pinnedRank: 2 },
    { id: 'C-dead-hang', grupo: 'Costas e pegada', exercicio: 'Dead Hang', equipamento: 'Barra fixa', observacoes: '3 series de 30 segundos. Segure a barra com pegada pronada na largura dos ombros, bracos estendidos, core levemente ativo e pernas juntas. Evite balancar, mantenha respiracao continua e desca se houver dor no ombro.', imagem: 'images/dead-hang-hearst.png', video: null },
    { id: 'C-manguito', grupo: 'Ombro', exercicio: 'Manguito com halter', equipamento: 'Halter leve (1 a 3 kg)', observacoes: '2 a 3 series de 10 a 15 repeticoes por lado. Cotovelo a 90 graus, colado ao tronco (pode usar toalha entre o cotovelo e o corpo). Gire o antebraco para fora devagar, sem subir o ombro e sem balancar o corpo.', imagem: 'images/manguito2.gif', video: null },
    { id: 'C-1', grupo: 'Costas', exercicio: 'Barra fixa', equipamento: 'Barra de porta', observacoes: 'Pegada aberta (costas) ou supinada (bíceps). Suba até o queixo passar da barra, desça controlado.', imagem: 'images/barrafixa.gif', video: 'videos/Barra fixa não é só força.webm' },
    { id: 'C-3', grupo: 'Bíceps', exercicio: 'Rosca direta alternada', equipamento: 'Halteres', observacoes: 'Cotovelos fixos ao lado do corpo. Suba e desça com controle, sem balançar.', imagem: 'images/rosca-direta.gif', video: null },
    { id: 'C-4', grupo: 'Ombro', exercicio: 'Elevação lateral', equipamento: 'Halteres', observacoes: 'Levante até a altura dos ombros, cotovelos levemente flexionados. Não impulsione com o corpo.', imagem: 'images/elevacao-lateral.gif', video: null },
    { id: 'C-5', grupo: 'Bíceps', exercicio: 'Rosca martelo', equipamento: 'Halteres', observacoes: 'Palmas voltadas uma para a outra. Trabalha bíceps e antebraço. Controle na descida.', imagem: 'images/rosca-martelo.gif', video: null },
    { id: 'C-8', grupo: 'Ombro', exercicio: 'Elevação frontal', equipamento: 'Halteres', observacoes: 'Levante o halter à frente até a altura do ombro. Alternado ou os dois juntos.', imagem: 'images/elevacao-frontal.gif', video: null },
    { id: 'C-6', grupo: 'Ombro', exercicio: 'Desenvolvimento com halteres', equipamento: 'Halteres', observacoes: 'Em pé ou sentado: empurre para cima sem travar os cotovelos. Core firme.', imagem: 'images/desenvolvimento-halteres.gif', video: null },
    { id: 'C-9', grupo: 'Ombro', exercicio: 'Crucifixo invertido', equipamento: 'Halteres', observacoes: 'Tronco inclinado, abra os braços para trás. Foco no deltoide posterior.', imagem: 'images/crucifixo-invertido.gif', video: null },
    { id: 'C-2', grupo: 'Costas', exercicio: 'Remada martelo no banco inclinado com halteres', equipamento: 'Halteres e banco', observacoes: 'Puxe o halter em direção ao quadril, cotovelo próximo ao corpo. Contraia as costas no topo.', imagem: 'images/remada-martelo-banco-inclinado.gif', video: null },
    { id: 'C-10', grupo: 'Ombro', exercicio: 'Desenvolvimento Arnold', equipamento: 'Halteres', observacoes: 'Comece com palmas para você; ao subir, gire até virar para fora. Movimento contínuo.', imagem: 'images/desenvolvimento-arnold.gif', video: null },
    { id: 'C-abdominal', grupo: 'Abdominal', exercicio: 'Abdominal', equipamento: 'Colchonete', observacoes: 'Crunch: suba só as escápulas, expire ao contrair. Ou prancha para isometria.', imagem: 'images/abdominal-crunch-pinimg.gif', video: null },
    { id: 'C-prancha', grupo: 'Core', exercicio: 'Prancha', equipamento: 'Colchonete', observacoes: 'Cabeça, quadril e tornozelos alinhados. Contraia o abdômen e não deixe o quadril subir ou cair.', imagem: 'images/abdominal-prancha-frontal-atletis.png', video: 'videos/Prancha Correção.webm' },
  ],
  cardio: [
    { id: 'cardio-suplementos', grupo: 'Suplementação', exercicio: 'Tomar Omega 3, multivitamínico e creatina', equipamento: 'Conforme orientação', observacoes: 'Siga a dosagem do rótulo ou do profissional. Tome com água e, se indicado, junto às refeições.', imagem: 'images/Omega3_Premium_Creatin_Gummy.webp', video: null, pinnedFirst: true, pinnedRank: 0 },
    { id: 'cardio-alongamento', grupo: 'Alongamento', exercicio: 'Alongamento', equipamento: 'Sem equipamento', observacoes: 'Faça um aquecimento leve e alongue sem dor. Respire fundo e mantenha 20–30s cada posição.', imagem: 'images/alongamentos-dicas.png', video: null, pinnedFirst: true, pinnedRank: 1 },
    { id: 'cardio-aquecimento', grupo: 'Aquecimento', exercicio: 'Aquecimento', equipamento: 'Tênis / bike ergométrica ou externa', observacoes: 'Corrida ou bike por 5-10 minutos em ritmo leve a moderado, para preparar o corpo antes do treino.', imagem: 'images/cardio-corrida-giphy.gif', video: null, pinnedFirst: true, pinnedRank: 2 },
    { id: 'cardio-prancha', grupo: 'Core', exercicio: 'Prancha', equipamento: 'Colchonete', observacoes: 'Cabeça, quadril e tornozelos alinhados. Contraia o abdômen e não deixe o quadril subir ou cair.', imagem: 'images/abdominal-prancha-frontal-atletis.png', video: 'videos/Prancha Correção.webm' },
    { id: 'cardio-1', grupo: 'Cardio', exercicio: 'Corrida', equipamento: 'Tênis / esteira ou rua', observacoes: 'Ritmo em que consiga falar. Aqueça 5 min e alongue ao final.', imagem: 'images/cardio-corrida-giphy.gif', video: null },
    { id: 'cardio-2', grupo: 'Cardio', exercicio: 'Bike', equipamento: 'Bicicleta ergométrica ou externa', observacoes: 'Resistência que exija esforço sem perder o fôlego. Ajuste o banco na altura do quadril.', imagem: 'images/cardio-bike-tenor.gif', video: null },
  ],
};

/**
 * Dicas — exibidos ao abrir a página (ex.: alimentação, alongamento).
 * Adicione mais entradas aqui quando quiser. video: caminho .webm (use convert-to-webm.ps1 para converter .mp4).
 */
const VIDEOS_LEGAIS = [
  { titulo: 'O que comer', descricao: 'Dicas para comer bem', video: 'Dicas/O que comer.webm' },
  { titulo: 'Se você passa muito tempo sentada, faça isso', descricao: '', video: 'Dicas/Se você passa muito tempo sentada, faça isso.webm' },
  { titulo: 'Manguito rotador com halteres - como fazer', descricao: '', video: 'videos/MANGUITO ROTADOR COM HALTERES - COMO FAZER.webm' },
  { titulo: 'Exercícios para dor no ombro - bursite e tendinite', descricao: '', video: 'videos/Exercícios para Dor no Ombro - Bursite e tendinite.webm' },
];
