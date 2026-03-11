/**
 * Dados da rotina de treino — Treino A, B, C e Cardio
 * imagem: caminho local (images/...) ou URL de imagem explicativa
 */
const ROTINA = {
  A: [
    { id: 'A-1', grupo: 'Peito', exercicio: 'Flexão de braços', equipamento: 'Peso corporal', observacoes: 'Use variações para aumentar dificuldade', imagem: 'images/flexao-bracos.jpg' },
    { id: 'A-2', grupo: 'Peito', exercicio: 'Supino no chão com halteres', equipamento: 'Halteres e colchonete', observacoes: 'Amplitude reduzida mas eficaz', imagem: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Flat-bench-cable-flys-2.png' },
    { id: 'A-3', grupo: 'Peito', exercicio: 'Supino inclinado TRX ou elástico', equipamento: 'TRX ou elástico na porta', observacoes: 'Incline o corpo para simular ângulo', imagem: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Flat-bench-cable-flys-2.png' },
    { id: 'A-4', grupo: 'Peito', exercicio: 'Crucifixo com halteres', equipamento: 'Elástico ou halteres', observacoes: 'Foco na contração peitoral', imagem: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Flat-bench-cable-flys-2.png' },
    { id: 'A-5', grupo: 'Tríceps', exercicio: 'Tríceps deitado testa (leva atrás da cabeça)', equipamento: 'Halteres', observacoes: 'Deitado no chão', imagem: 'images/triceps-testa.gif' },
    { id: 'A-6', grupo: 'Tríceps', exercicio: 'Tríceps francês', equipamento: 'Halteres', observacoes: 'Unilateral ou bilateral', imagem: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Lying-close-grip-triceps-extension-behind-the-head-1.gif' },
    { id: 'A-7', grupo: 'Tríceps', exercicio: 'Tríceps com elástico na porta', equipamento: 'Elástico com âncora', observacoes: 'Simula polia', imagem: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Lying-close-grip-triceps-extension-behind-the-head-1.gif' },
  ],
  B: [
    { id: 'B-1', grupo: 'Pernas', exercicio: 'Agachamento com halteres', equipamento: 'Halteres', observacoes: 'Use elástico acima dos joelhos para ativar glúteo', imagem: 'images/agachamento.png' },
    { id: 'B-2', grupo: 'Pernas', exercicio: 'Avanço com halteres', equipamento: 'Halteres e peso de tornozelo', observacoes: 'Passo à frente ou reverso', imagem: 'images/avancamento.png' },
    { id: 'B-3', grupo: 'Posterior', exercicio: 'Stiff com halteres', equipamento: 'Halteres', observacoes: 'Foco nos posteriores e glúteos', imagem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Straight_leg_deadlift.gif/220px-Straight_leg_deadlift.gif' },
    { id: 'B-4', grupo: 'Glúteo', exercicio: 'Elevação de quadril', equipamento: 'Halteres e peso de perna', observacoes: 'Unilateral ou bilateral', imagem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Hip_bridge.gif/220px-Hip_bridge.gif' },
    { id: 'B-5', grupo: 'Quadríceps', exercicio: 'Extensora improvisada', equipamento: 'Elástico + peso de tornozelo', observacoes: 'Sentado em cadeira', imagem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Leg_extension.gif/220px-Leg_extension.gif' },
    { id: 'B-6', grupo: 'Posterior', exercicio: 'Flexora improvisada', equipamento: 'Elástico + peso de tornozelo', observacoes: 'Deitado de bruços ou em pé', imagem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Leg_curl.gif/220px-Leg_curl.gif' },
    { id: 'B-7', grupo: 'Glúteo', exercicio: 'Abdução de quadril', equipamento: 'Elástico + peso de tornozelo', observacoes: 'Deitado de lado ou em pé', imagem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Hip_abduction.gif/220px-Hip_abduction.gif' },
    { id: 'B-8', grupo: 'Glúteo', exercicio: 'Glúteo 4 apoios', equipamento: 'Colchonete + peso de perna', observacoes: 'Chute para trás', imagem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Donkey_kick.gif/220px-Donkey_kick.gif' },
    { id: 'B-9', grupo: 'Panturrilha', exercicio: 'Panturrilha em pé', equipamento: 'Halteres + peso de perna', observacoes: 'Segure o topo da contração', imagem: 'images/panturrilha.gif' },
  ],
  C: [
    { id: 'C-1', grupo: 'Costas', exercicio: 'Barra fixa', equipamento: 'Barra de porta', observacoes: 'Pegada aberta ou supinada', imagem: 'images/barra-fixa.png' },
    { id: 'C-2', grupo: 'Costas', exercicio: 'Remada curvada', equipamento: 'Halteres', observacoes: 'Técnica controlada', imagem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Bent-over_row.gif/220px-Bent-over_row.gif' },
    { id: 'C-3', grupo: 'Bíceps', exercicio: 'Rosca direta alternada', equipamento: 'Halteres', observacoes: 'Controle na subida e descida', imagem: 'images/rosca-direta.gif' },
    { id: 'C-4', grupo: 'Ombro', exercicio: 'Elevação lateral', equipamento: 'Halteres', observacoes: 'Foco no deltoide medial', imagem: 'images/elevacao-lateral.gif' },
    { id: 'C-5', grupo: 'Bíceps', exercicio: 'Rosca martelo', equipamento: 'Halteres', observacoes: 'Foco no antebraço também', imagem: 'images/rosca-martelo.gif' },
    { id: 'C-6', grupo: 'Ombro', exercicio: 'Desenvolvimento com halteres', equipamento: 'Halteres', observacoes: 'Em pé ou sentado no chão', imagem: 'https://www.hipertrofia.org/blog/wp-content/uploads/2023/09/dumbbell-seated-shoulder-press.gif' },
    { id: 'C-7', grupo: 'Ombro', exercicio: 'Fly reverso', equipamento: 'Halteres ou elástico', observacoes: 'Inclinado à frente para pegar ombro posterior', imagem: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Bent-over-cable-lateral-raises-1.png' },
    { id: 'C-8', grupo: 'Ombro', exercicio: 'Elevação frontal', equipamento: 'Halteres', observacoes: '', imagem: 'https://www.hipertrofia.org/blog/wp-content/uploads/2023/11/dumbbell-front-raise.gif' },
    { id: 'C-9', grupo: 'Ombro', exercicio: 'Crucifixo invertido', equipamento: 'Halteres', observacoes: '', imagem: 'https://www.hipertrofia.org/blog/wp-content/uploads/2023/11/dumbbell-reverse-fly.gif' },
    { id: 'C-10', grupo: 'Ombro', exercicio: 'Desenvolvimento Arnold', equipamento: 'Halteres', observacoes: '', imagem: 'https://c.tenor.com/ZR-_3Mxq0gYAAAAd/tenor.gif' },
  ],
  cardio: [
    { id: 'cardio-1', grupo: 'Cardio', exercicio: 'Corrida', equipamento: 'Tênis / esteira ou rua', observacoes: 'Ritmo confortável', imagem: '' },
    { id: 'cardio-2', grupo: 'Cardio', exercicio: 'Bike', equipamento: 'Bicicleta ergométrica ou externa', observacoes: 'Resistência moderada', imagem: '' },
  ],
};
