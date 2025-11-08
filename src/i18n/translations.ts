export type Language = 'en' | 'es' | 'zh' | 'hi' | 'ar' | 'pt';

export interface Translations {
  // PlayerSetup
  scrabbleScore: string;
  howManyPlayers: string;
  names: string;
  enterPlayerName: string;
  player: string;
  startGame: string;
  
  // TurnInput
  turn: string;
  enterScore: string;
  
  // Leaderboard
  leaderboard: string;
  round: string;
  points: string;
  fromLeader: string;
  tiedWithLeader: string;
  editScore: string;
  editPlayer: string;
  playerName: string;
  customTimer: string;
  customTimerDescription: string;
  noCustomTimer: string;
  scoreHistory: string;
  noRoundsYet: string;
  newScore: string;
  cancel: string;
  save: string;
  
  // ConfirmDialog
  resetGame: string;
  resetConfirmation: string;
  cannotUndo: string;
  yes: string;
  reset: string;
  
  // Messages
  gameReset: string;
  scoreUpdated: string;
  
  // Timer
  minute: string;
  minutes: string;
  stopTimer: string;
  
  // Settings
  settings: string;
  colorTheme: string;
  language: string;
  classic: string;
  deluxe: string;
  vintage: string;
  
  // Ko-fi
  supportProject: string;
  supportDescription: string;
  
  // Radio
  radioStopped: string;
  radioError: string;
  radioStarted: string;
  radioLive: string;
  
  // Timer status
  timerOn: string;
  
  // Carousel
  comingSoon: string;
  
  // Share
  shareResults: string;
  copiedToClipboard: string;
  shareNotSupported: string;
  results: string;
  roundsPlayed: string;
  canYouBeatUs: string;
  playHere: string;
  turnTimer: string;
  gameTimer: string;
  timeOut: string;
  bingo: string;
  finishedGame: string;
  endGameConfirmation: string;
  endGameQuestion: string;
  applyPenalties: string;
  unusedTilesPenalty: string;
  penaltyDescription: string;
  enterPenalty: string;
  
  // Game persistence
  gameInProgress: string;
  savedGameFound: string;
  continueGame: string;
  newGame: string;
  continueOrNewQuestion: string;
  lastPlayed: string;
  justNow: string;
  ago: string;
  hour: string;
  hours: string;
  day: string;
  days: string;
  gameRestored: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    scrabbleScore: 'Scrabble Score',
    howManyPlayers: 'How many players?',
    names: 'Names',
    enterPlayerName: 'Enter the name of each player',
    player: 'Player',
    startGame: 'Start Game',
    turn: 'Turn',
    enterScore: 'Enter score',
    leaderboard: 'Leaderboard',
    round: 'Round',
    points: 'points',
    fromLeader: 'from leader',
    tiedWithLeader: 'Tied with leader',
    editScore: 'Edit score',
    editPlayer: 'Edit Player',
    playerName: 'Player Name',
    customTimer: 'Custom Timer',
    customTimerDescription: 'Custom timer for this player\'s turns (minutes)',
    noCustomTimer: 'No custom timer',
    scoreHistory: 'Score History',
    noRoundsYet: 'No rounds completed yet',
    newScore: 'New score',
    cancel: 'Cancel',
    save: 'Save',
    resetGame: 'Reset game?',
    resetConfirmation: 'This action will delete all scores and restart the game.',
    cannotUndo: 'This action cannot be undone.',
    yes: 'Yes',
    reset: 'Reset',
    gameReset: 'Game reset',
    scoreUpdated: 'Score updated',
    minute: 'minute',
    minutes: 'minutes',
    stopTimer: 'Stop timer',
    settings: 'Settings',
    colorTheme: 'Color Theme',
    language: 'Language',
    classic: 'Classic',
    deluxe: 'Deluxe',
    vintage: 'Vintage',
    supportProject: 'Support the Project',
    supportDescription: 'Help us keep improving Scrabble Score. Your support means a lot!',
    radioStopped: 'Radio stopped',
    radioError: 'Error playing radio',
    radioStarted: 'Radio started',
    radioLive: 'live',
    timerOn: 'on',
    comingSoon: 'Coming soon',
    shareResults: 'Share results',
    copiedToClipboard: 'Copied to clipboard!',
    shareNotSupported: 'Copy text to share',
    results: 'Results',
    roundsPlayed: 'rounds played',
    canYouBeatUs: 'Can you beat us?',
    playHere: 'Play here:',
    turnTimer: 'Turn Timer',
    gameTimer: 'Game Timer',
    timeOut: 'time out',
    bingo: 'Bingo!',
    finishedGame: 'Finished Game',
    endGameConfirmation: 'Are you sure you want to end the game?',
    endGameQuestion: 'The game will end and penalties for unused tiles will be applied.',
    applyPenalties: 'Apply Penalties',
    unusedTilesPenalty: 'Unused Tiles Penalty',
    penaltyDescription: 'Enter the penalty points for each player (will be subtracted from total score)',
    enterPenalty: 'Penalty points',
    gameInProgress: 'Game in Progress',
    savedGameFound: 'We found a saved game from your last session.',
    continueGame: 'Continue Game',
    newGame: 'New Game',
    continueOrNewQuestion: 'Would you like to continue where you left off or start fresh?',
    lastPlayed: 'Last played',
    justNow: 'just now',
    ago: 'ago',
    hour: 'hour',
    hours: 'hours',
    day: 'day',
    days: 'days',
    gameRestored: 'Game restored successfully',
  },
  es: {
    scrabbleScore: 'Scrabble Score',
    howManyPlayers: '¿Cuántos jugadores?',
    names: 'Nombres',
    enterPlayerName: 'Ingresa el nombre de cada jugador',
    player: 'Jugador',
    startGame: 'Comenzar Juego',
    turn: 'Turno',
    enterScore: 'Ingresa puntaje',
    leaderboard: 'Tabla de Posiciones',
    round: 'Ronda',
    points: 'puntos',
    fromLeader: 'del líder',
    tiedWithLeader: 'Empate con líder',
    editScore: 'Editar puntaje',
    editPlayer: 'Editar Jugador',
    playerName: 'Nombre del Jugador',
    customTimer: 'Temporizador Personalizado',
    customTimerDescription: 'Temporizador personalizado para los turnos de este jugador (minutos)',
    noCustomTimer: 'Sin temporizador personalizado',
    scoreHistory: 'Historial de Puntajes',
    noRoundsYet: 'No hay rondas completadas aún',
    newScore: 'Nuevo puntaje',
    cancel: 'Cancelar',
    save: 'Guardar',
    resetGame: '¿Reiniciar el juego?',
    resetConfirmation: 'Esta acción borrará todos los puntajes y reiniciará el juego.',
    cannotUndo: 'Esta acción no se puede deshacer.',
    yes: 'Sí',
    reset: 'Reiniciar',
    gameReset: 'Juego reiniciado',
    scoreUpdated: 'Puntaje actualizado',
    minute: 'minuto',
    minutes: 'minutos',
    stopTimer: 'Detener temporizador',
    settings: 'Configuración',
    colorTheme: 'Tema de Color',
    language: 'Idioma',
    classic: 'Clásico',
    deluxe: 'Deluxe',
    vintage: 'Vintage',
    supportProject: 'Apoyar el Proyecto',
    supportDescription: '¡Ayúdanos a seguir mejorando Scrabble Score. Tu apoyo significa mucho!',
    radioStopped: 'Radio detenida',
    radioError: 'Error al reproducir la radio',
    radioStarted: 'Radio iniciada',
    radioLive: 'en vivo',
    timerOn: 'activo',
    comingSoon: 'Próxima funcionalidad',
    shareResults: 'Compartir resultados',
    copiedToClipboard: '¡Copiado al portapapeles!',
    shareNotSupported: 'Copia el texto para compartir',
    results: 'Resultados',
    roundsPlayed: 'rondas jugadas',
    canYouBeatUs: '¿Puedes superarnos?',
    playHere: 'Juega aquí:',
    turnTimer: 'Tiempo por Turno',
    gameTimer: 'Tiempo de Partida',
    timeOut: 'tiempo fuera',
    bingo: '¡Bingo!',
    finishedGame: 'Terminar Juego',
    endGameConfirmation: '¿Estás seguro de dar fin al juego?',
    endGameQuestion: 'El juego terminará y se aplicarán las penalizaciones por fichas sin usar.',
    applyPenalties: 'Aplicar Penalizaciones',
    unusedTilesPenalty: 'Penalización por Fichas Sin Usar',
    penaltyDescription: 'Ingresa los puntos de penalización para cada jugador (se restarán del puntaje total)',
    enterPenalty: 'Puntos de penalización',
    gameInProgress: 'Partida en Curso',
    savedGameFound: 'Encontramos una partida guardada de tu última sesión.',
    continueGame: 'Continuar Partida',
    newGame: 'Nueva Partida',
    continueOrNewQuestion: '¿Quieres continuar donde lo dejaste o empezar de nuevo?',
    lastPlayed: 'Última vez jugada',
    justNow: 'justo ahora',
    ago: 'hace',
    hour: 'hora',
    hours: 'horas',
    day: 'día',
    days: 'días',
    gameRestored: 'Partida restaurada exitosamente',
  },
  zh: {
    scrabbleScore: 'Scrabble Score',
    howManyPlayers: '多少位玩家？',
    names: '名字',
    enterPlayerName: '输入每位玩家的名字',
    player: '玩家',
    startGame: '开始游戏',
    turn: '回合',
    enterScore: '输入分数',
    leaderboard: '排行榜',
    round: '轮',
    points: '分',
    fromLeader: '落后领先者',
    tiedWithLeader: '与领先者并列',
    editScore: '编辑分数',
    editPlayer: '编辑玩家',
    playerName: '玩家名字',
    customTimer: '自定义计时器',
    customTimerDescription: '此玩家回合的自定义计时器（分钟）',
    noCustomTimer: '无自定义计时器',
    scoreHistory: '分数历史',
    noRoundsYet: '尚未完成任何回合',
    newScore: '新分数',
    cancel: '取消',
    save: '保存',
    resetGame: '重置游戏？',
    resetConfirmation: '此操作将删除所有分数并重新开始游戏。',
    cannotUndo: '此操作无法撤销。',
    yes: '是',
    reset: '重置',
    gameReset: '游戏已重置',
    scoreUpdated: '分数已更新',
    minute: '分钟',
    minutes: '分钟',
    stopTimer: '停止计时器',
    settings: '设置',
    colorTheme: '颜色主题',
    language: '语言',
    classic: '经典',
    deluxe: '豪华',
    vintage: '复古',
    supportProject: '支持项目',
    supportDescription: '帮助我们继续改进 Scrabble Score。您的支持意义重大！',
    radioStopped: '电台已停止',
    radioError: '播放电台时出错',
    radioStarted: '电台已启动',
    radioLive: '直播',
    timerOn: '开启',
    comingSoon: '即将推出',
    shareResults: '分享结果',
    copiedToClipboard: '已复制到剪贴板！',
    shareNotSupported: '复制文本以分享',
    results: '结果',
    roundsPlayed: '已玩轮数',
    canYouBeatUs: '你能超越我们吗？',
    playHere: '在此玩：',
    turnTimer: '回合计时器',
    gameTimer: '游戏计时器',
    timeOut: '时间到',
    bingo: 'Bingo!',
    finishedGame: '结束游戏',
    endGameConfirmation: '您确定要结束游戏吗？',
    endGameQuestion: '游戏将结束，并将应用未使用牌的罚分。',
    applyPenalties: '应用罚分',
    unusedTilesPenalty: '未使用牌罚分',
    penaltyDescription: '输入每位玩家的罚分（将从总分中扣除）',
    enterPenalty: '罚分',
    gameInProgress: '游戏进行中',
    savedGameFound: '我们找到了您上次会话的保存游戏。',
    continueGame: '继续游戏',
    newGame: '新游戏',
    continueOrNewQuestion: '您想继续上次的游戏还是重新开始？',
    lastPlayed: '上次游戏',
    justNow: '刚刚',
    ago: '前',
    hour: '小时',
    hours: '小时',
    day: '天',
    days: '天',
    gameRestored: '游戏恢复成功',
  },
  hi: {
    scrabbleScore: 'Scrabble Score',
    howManyPlayers: 'कितने खिलाड़ी?',
    names: 'नाम',
    enterPlayerName: 'प्रत्येक खिलाड़ी का नाम दर्ज करें',
    player: 'खिलाड़ी',
    startGame: 'खेल शुरू करें',
    turn: 'बारी',
    enterScore: 'स्कोर दर्ज करें',
    leaderboard: 'लीडरबोर्ड',
    round: 'राउंड',
    points: 'अंक',
    fromLeader: 'लीडर से',
    tiedWithLeader: 'लीडर के साथ बराबरी',
    editScore: 'स्कोर संपादित करें',
    editPlayer: 'खिलाड़ी संपादित करें',
    playerName: 'खिलाड़ी का नाम',
    customTimer: 'कस्टम टाइमर',
    customTimerDescription: 'इस खिलाड़ी की बारी के लिए कस्टम टाइमर (मिनट)',
    noCustomTimer: 'कोई कस्टम टाइमर नहीं',
    scoreHistory: 'स्कोर इतिहास',
    noRoundsYet: 'अभी तक कोई राउंड पूरा नहीं हुआ',
    newScore: 'नया स्कोर',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    resetGame: 'खेल रीसेट करें?',
    resetConfirmation: 'यह क्रिया सभी स्कोर हटा देगी और खेल को पुनः आरंभ करेगी।',
    cannotUndo: 'यह क्रिया पूर्ववत नहीं की जा सकती।',
    yes: 'हाँ',
    reset: 'रीसेट',
    gameReset: 'खेल रीसेट हो गया',
    scoreUpdated: 'स्कोर अपडेट हो गया',
    minute: 'मिनट',
    minutes: 'मिनट',
    stopTimer: 'टाइमर बंद करें',
    settings: 'सेटिंग्स',
    colorTheme: 'रंग थीम',
    language: 'भाषा',
    classic: 'क्लासिक',
    deluxe: 'डीलक्स',
    vintage: 'विंटेज',
    supportProject: 'परियोजना का समर्थन करें',
    supportDescription: 'Scrabble Score को बेहतर बनाने में हमारी मदद करें। आपका समर्थन बहुत मायने रखता है!',
    radioStopped: 'रेडियो बंद हो गया',
    radioError: 'रेडियो चलाने में त्रुटि',
    radioStarted: 'रेडियो शुरू हो गया',
    radioLive: 'लाइव',
    timerOn: 'चालू',
    comingSoon: 'जल्द आ रहा है',
    shareResults: 'परिणाम साझा करें',
    copiedToClipboard: 'क्लिपबोर्ड में कॉपी किया गया!',
    shareNotSupported: 'साझा करने के लिए टेक्स्ट कॉपी करें',
    results: 'परिणाम',
    roundsPlayed: 'राउंड खेले गए',
    canYouBeatUs: 'क्या आप हमें हरा सकते हैं?',
    playHere: 'यहां खेलें:',
    turnTimer: 'टर्न टाइमर',
    gameTimer: 'गेम टाइमर',
    timeOut: 'समय समाप्त',
    bingo: 'बिंगो!',
    finishedGame: 'खेल समाप्त',
    endGameConfirmation: 'क्या आप निश्चित रूप से खेल समाप्त करना चाहते हैं?',
    endGameQuestion: 'खेल समाप्त हो जाएगा और अप्रयुक्त टाइलों के लिए दंड लागू किया जाएगा।',
    applyPenalties: 'दंड लागू करें',
    unusedTilesPenalty: 'अप्रयुक्त टाइलों का दंड',
    penaltyDescription: 'प्रत्येक खिलाड़ी के लिए दंड अंक दर्ज करें (कुल स्कोर से घटाया जाएगा)',
    enterPenalty: 'दंड अंक',
    gameInProgress: 'खेल जारी है',
    savedGameFound: 'हमें आपके पिछले सत्र से एक सहेजा गया खेल मिला।',
    continueGame: 'खेल जारी रखें',
    newGame: 'नया खेल',
    continueOrNewQuestion: 'क्या आप जहां छोड़ा था वहीं से जारी रखना चाहते हैं या नया शुरू करना चाहते हैं?',
    lastPlayed: 'अंतिम बार खेला गया',
    justNow: 'अभी',
    ago: 'पहले',
    hour: 'घंटा',
    hours: 'घंटे',
    day: 'दिन',
    days: 'दिन',
    gameRestored: 'खेल सफलतापूर्वक पुनर्स्थापित हो गया',
  },
  ar: {
    scrabbleScore: 'Scrabble Score',
    howManyPlayers: 'كم عدد اللاعبين؟',
    names: 'الأسماء',
    enterPlayerName: 'أدخل اسم كل لاعب',
    player: 'لاعب',
    startGame: 'ابدأ اللعبة',
    turn: 'الدور',
    enterScore: 'أدخل النتيجة',
    leaderboard: 'لوحة المتصدرين',
    round: 'جولة',
    points: 'نقاط',
    fromLeader: 'من المتصدر',
    tiedWithLeader: 'تعادل مع المتصدر',
    editScore: 'تحرير النتيجة',
    editPlayer: 'تحرير اللاعب',
    playerName: 'اسم اللاعب',
    customTimer: 'مؤقت مخصص',
    customTimerDescription: 'مؤقت مخصص لأدوار هذا اللاعب (دقائق)',
    noCustomTimer: 'لا يوجد مؤقت مخصص',
    scoreHistory: 'سجل النقاط',
    noRoundsYet: 'لم تكتمل أي جولات بعد',
    newScore: 'نتيجة جديدة',
    cancel: 'إلغاء',
    save: 'حفظ',
    resetGame: 'إعادة تعيين اللعبة؟',
    resetConfirmation: 'سيؤدي هذا الإجراء إلى حذف جميع النتائج وإعادة تشغيل اللعبة.',
    cannotUndo: 'لا يمكن التراجع عن هذا الإجراء.',
    yes: 'نعم',
    reset: 'إعادة تعيين',
    gameReset: 'تم إعادة تعيين اللعبة',
    scoreUpdated: 'تم تحديث النتيجة',
    minute: 'دقيقة',
    minutes: 'دقائق',
    stopTimer: 'إيقاف المؤقت',
    settings: 'الإعدادات',
    colorTheme: 'موضوع اللون',
    language: 'اللغة',
    classic: 'كلاسيكي',
    deluxe: 'ديلوكس',
    vintage: 'عتيق',
    supportProject: 'دعم المشروع',
    supportDescription: 'ساعدنا في الاستمرار في تحسين Scrabble Score. دعمك يعني الكثير!',
    radioStopped: 'توقف الراديو',
    radioError: 'خطأ في تشغيل الراديو',
    radioStarted: 'بدأ الراديو',
    radioLive: 'مباشر',
    timerOn: 'قيد التشغيل',
    comingSoon: 'قريباً',
    shareResults: 'مشاركة النتائج',
    copiedToClipboard: 'تم النسخ إلى الحافظة!',
    shareNotSupported: 'انسخ النص للمشاركة',
    results: 'النتائج',
    roundsPlayed: 'جولات لعبت',
    canYouBeatUs: 'هل يمكنك التفوق علينا؟',
    playHere: 'العب هنا:',
    turnTimer: 'مؤقت الدور',
    gameTimer: 'مؤقت اللعبة',
    timeOut: 'انتهى الوقت',
    bingo: 'بينغو!',
    finishedGame: 'إنهاء اللعبة',
    endGameConfirmation: 'هل أنت متأكد من رغبتك في إنهاء اللعبة؟',
    endGameQuestion: 'ستنتهي اللعبة وسيتم تطبيق عقوبات البلاط غير المستخدم.',
    applyPenalties: 'تطبيق العقوبات',
    unusedTilesPenalty: 'عقوبة البلاط غير المستخدم',
    penaltyDescription: 'أدخل نقاط العقوبة لكل لاعب (سيتم طرحها من النتيجة الإجمالية)',
    enterPenalty: 'نقاط العقوبة',
    gameInProgress: 'اللعبة قيد التقدم',
    savedGameFound: 'لقد وجدنا لعبة محفوظة من جلستك الأخيرة.',
    continueGame: 'متابعة اللعبة',
    newGame: 'لعبة جديدة',
    continueOrNewQuestion: 'هل تريد المتابعة من حيث توقفت أم البدء من جديد؟',
    lastPlayed: 'آخر لعب',
    justNow: 'الآن',
    ago: 'منذ',
    hour: 'ساعة',
    hours: 'ساعات',
    day: 'يوم',
    days: 'أيام',
    gameRestored: 'تم استعادة اللعبة بنجاح',
  },
  pt: {
    scrabbleScore: 'Scrabble Score',
    howManyPlayers: 'Quantos jogadores?',
    names: 'Nomes',
    enterPlayerName: 'Digite o nome de cada jogador',
    player: 'Jogador',
    startGame: 'Iniciar Jogo',
    turn: 'Turno',
    enterScore: 'Digite a pontuação',
    leaderboard: 'Classificação',
    round: 'Rodada',
    points: 'pontos',
    fromLeader: 'do líder',
    tiedWithLeader: 'Empatado com o líder',
    editScore: 'Editar pontuação',
    editPlayer: 'Editar Jogador',
    playerName: 'Nome do Jogador',
    customTimer: 'Timer Personalizado',
    customTimerDescription: 'Timer personalizado para os turnos deste jogador (minutos)',
    noCustomTimer: 'Sem timer personalizado',
    scoreHistory: 'Histórico de Pontuações',
    noRoundsYet: 'Nenhuma rodada concluída ainda',
    newScore: 'Nova pontuação',
    cancel: 'Cancelar',
    save: 'Salvar',
    resetGame: 'Reiniciar o jogo?',
    resetConfirmation: 'Esta ação apagará todas as pontuações e reiniciará o jogo.',
    cannotUndo: 'Esta ação não pode ser desfeita.',
    yes: 'Sim',
    reset: 'Reiniciar',
    gameReset: 'Jogo reiniciado',
    scoreUpdated: 'Pontuação atualizada',
    minute: 'minuto',
    minutes: 'minutos',
    stopTimer: 'Parar cronômetro',
    settings: 'Configurações',
    colorTheme: 'Tema de Cores',
    language: 'Idioma',
    classic: 'Clássico',
    deluxe: 'Deluxe',
    vintage: 'Vintage',
    supportProject: 'Apoiar o Projeto',
    supportDescription: 'Ajude-nos a continuar melhorando o Scrabble Score. Seu apoio significa muito!',
    radioStopped: 'Rádio parada',
    radioError: 'Erro ao reproduzir rádio',
    radioStarted: 'Rádio iniciada',
    radioLive: 'ao vivo',
    timerOn: 'ligado',
    comingSoon: 'Em breve',
    shareResults: 'Compartilhar resultados',
    copiedToClipboard: 'Copiado para a área de transferência!',
    shareNotSupported: 'Copie o texto para compartilhar',
    results: 'Resultados',
    roundsPlayed: 'rodadas jogadas',
    canYouBeatUs: 'Você pode nos superar?',
    playHere: 'Jogue aqui:',
    turnTimer: 'Timer de Turno',
    gameTimer: 'Timer de Partida',
    timeOut: 'tempo esgotado',
    bingo: 'Bingo!',
    finishedGame: 'Terminar Jogo',
    endGameConfirmation: 'Tem certeza de que deseja encerrar o jogo?',
    endGameQuestion: 'O jogo terminará e as penalidades por peças não utilizadas serão aplicadas.',
    applyPenalties: 'Aplicar Penalidades',
    unusedTilesPenalty: 'Penalidade por Peças Não Utilizadas',
    penaltyDescription: 'Digite os pontos de penalidade para cada jogador (serão subtraídos da pontuação total)',
    enterPenalty: 'Pontos de penalidade',
    gameInProgress: 'Jogo em Andamento',
    savedGameFound: 'Encontramos um jogo salvo da sua última sessão.',
    continueGame: 'Continuar Jogo',
    newGame: 'Novo Jogo',
    continueOrNewQuestion: 'Você gostaria de continuar de onde parou ou começar do zero?',
    lastPlayed: 'Última vez jogado',
    justNow: 'agora mesmo',
    ago: 'atrás',
    hour: 'hora',
    hours: 'horas',
    day: 'dia',
    days: 'dias',
    gameRestored: 'Jogo restaurado com sucesso',
  },
};

export const languageFlags: Record<Language, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  zh: '🇨🇳',
  hi: '🇮🇳',
  ar: '🇸🇦',
  pt: '🇧🇷',
};

export const languageNames: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  zh: '中文',
  hi: 'हिन्दी',
  ar: 'العربية',
  pt: 'Português',
};