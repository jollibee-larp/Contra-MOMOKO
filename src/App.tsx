import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Question, WeaponType, AnswerRecord } from './types/game';
import { DEFAULT_QUESTIONS, CATEGORY_LABELS } from './data/defaultQuestions';
import { STAGES, generateStageElements } from './data/stages';
import { soundEngine } from './utils/audio';

import { RetroHeader } from './components/RetroHeader';
import { TitleScreen } from './components/TitleScreen';
import { HUD } from './components/HUD';
import { GameCanvas } from './components/GameCanvas';
import { TouchControls } from './components/TouchControls';
import { QuestionModal } from './components/QuestionModal';
import { QuizManagerModal } from './components/QuizManagerModal';
import { RulesModal } from './components/RulesModal';
import { GameOverModal } from './components/GameOverModal';

const HIGH_SCORE_KEY = 'magical_girls_high_score';
const QUESTIONS_KEY = 'magical_girls_questions';
const SELECTED_CATEGORY_KEY = 'magical_girls_selected_category';

export default function App() {
  // Game state
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [currentStageId, setCurrentStageId] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem(HIGH_SCORE_KEY);
    return saved ? parseInt(saved, 10) : 10000;
  });

  // Selected topic/category for the quiz challenge
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return localStorage.getItem(SELECTED_CATEGORY_KEY) || 'all';
  });

  // Question bank state with localStorage persistence
  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem(QUESTIONS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // use default
      }
    }
    return DEFAULT_QUESTIONS;
  });

  // Player in-game state
  const [playerLives, setPlayerLives] = useState<number>(5);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [playerMaxHp] = useState<number>(100);
  const [playerMana, setPlayerMana] = useState<number>(100);
  const [playerMaxMana] = useState<number>(100);
  const [playerWeapon, setPlayerWeapon] = useState<WeaponType>('NORMAL');
  const [invincibleTimer, setInvincibleTimer] = useState<number>(0);
  const [quizStreak, setQuizStreak] = useState<number>(0);
  const [dayPhase, setDayPhase] = useState<'day' | 'sunset' | 'night'>('day');

  // Active stage configuration and elements
  const currentStage = STAGES.find(s => s.id === currentStageId) || STAGES[0];
  const [stageElements, setStageElements] = useState(() => generateStageElements(1, 380));

  // Boss tracking for HUD
  const [bossHp, setBossHp] = useState<number | null>(null);
  const [bossMaxHp, setBossMaxHp] = useState<number | null>(null);

  // Active quiz modal state
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [pendingRewardWeapon, setPendingRewardWeapon] = useState<WeaponType>('SPREAD');
  const [answersHistory, setAnswersHistory] = useState<AnswerRecord[]>([]);
  const [activeGateId, setActiveGateId] = useState<string | null>(null);
  const [isQuizFromGate, setIsQuizFromGate] = useState<boolean>(false);
  const [skillTriggerTime, setSkillTriggerTime] = useState<number>(0);

  // Modals state
  const [showQuizManager, setShowQuizManager] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [sfxOn, setSfxOn] = useState<boolean>(true);
  const [bgmOn, setBgmOn] = useState<boolean>(true);

  // Touch virtual controller & on-screen buttons
  const [touchInput, setTouchInput] = useState({
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    shoot: false
  });

  // Save selected category to localStorage
  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    localStorage.setItem(SELECTED_CATEGORY_KEY, cat);
  };

  // Save questions when changed
  const handleSaveQuestions = (updated: Question[]) => {
    setQuestions(updated);
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(updated));
  };

  const handleResetDefaultQuestions = () => {
    setQuestions(DEFAULT_QUESTIONS);
    localStorage.removeItem(QUESTIONS_KEY);
  };

  // High score tracking
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(HIGH_SCORE_KEY, score.toString());
    }
  }, [score, highScore]);

  // Audio toggles
  const handleToggleSfx = () => {
    const next = soundEngine.toggleSfx();
    setSfxOn(next);
  };

  const handleToggleBgm = () => {
    const next = soundEngine.toggleBgm();
    setBgmOn(next);
  };

  // Start stage
  const startStage = useCallback((stageId: number) => {
    setCurrentStageId(stageId);
    setStageElements(generateStageElements(stageId, 380));
    setPlayerLives(5);
    setPlayerHp(100);
    setPlayerMana(100);
    setPlayerWeapon('NORMAL');
    setBossHp(null);
    setBossMaxHp(null);
    setActiveGateId(null);
    setGameState('PLAYING');
    if (bgmOn) {
      soundEngine.startBgm();
    }
  }, [bgmOn]);

  const handleStartGame = (stageId: number = 1, category: string = selectedCategory) => {
    setSelectedCategory(category);
    setScore(0);
    setAnswersHistory([]);
    setQuizStreak(0);
    startStage(stageId);
  };

  // Question Block or Seal Gate trigger - STRICTLY draw from chosen topic!
  const handleTriggerQuestion = useCallback((sourceId: string, rewardWeapon?: WeaponType, isGate?: boolean) => {
    setIsQuizFromGate(!!isGate);
    if (isGate) {
      setActiveGateId(sourceId);
    }

    // 1. Filter pool by chosen category
    const categoryQuestions = selectedCategory === 'all'
      ? questions
      : questions.filter(q => q.category === selectedCategory);

    // Fallback if specific category has no questions
    const activePool = categoryQuestions.length > 0 ? categoryQuestions : questions;

    // Filter unasked questions in this session
    const unasked = activePool.filter(
      q => !answersHistory.some(a => a.question.id === q.id)
    );

    const chosen = (unasked.length > 0
      ? unasked[Math.floor(Math.random() * unasked.length)]
      : activePool[Math.floor(Math.random() * activePool.length)]) || DEFAULT_QUESTIONS[0];

    setActiveQuestion(chosen);
    setPendingRewardWeapon(rewardWeapon || 'SPREAD');
    setGameState('QUIZ_PAUSED');
  }, [questions, selectedCategory, answersHistory]);

  // Question answered
  const handleAnswerSubmit = (isCorrect: boolean, timeTakenSec: number) => {
    if (!activeQuestion) return;

    const record: AnswerRecord = {
      question: activeQuestion,
      selectedAnswer: isCorrect ? activeQuestion.correctIndex : -1,
      isCorrect,
      timeTakenSec
    };

    setAnswersHistory(prev => [record, ...prev]);

    if (isCorrect) {
      setPlayerWeapon(pendingRewardWeapon);
      const timeBonus = Math.max(0, (30 - timeTakenSec) * 20);
      const pointsEarned = 600 + timeBonus;
      setScore(s => s + pointsEarned);
      setQuizStreak(streak => streak + 1);
      setPlayerHp(hp => Math.min(playerMaxHp, hp + 35));
      setPlayerMana(mana => Math.min(playerMaxMana, mana + 40));

      if (quizStreak + 1 >= 3) {
        setInvincibleTimer(120);
      }
    } else {
      setQuizStreak(0);
    }
  };

  const handleCloseQuestionModal = () => {
    setActiveQuestion(null);
    setGameState('PLAYING');
  };

  // Stage clear & progression
  const handleStageClear = useCallback(() => {
    soundEngine.playStageClear();
    setScore(s => s + 3000);
    setGameState('STAGE_CLEAR');
  }, []);

  const handleNextStage = () => {
    if (currentStageId < 3) {
      startStage(currentStageId + 1);
    } else {
      setGameState('VICTORY');
    }
  };

  // Game over
  const handleGameOver = useCallback(() => {
    soundEngine.stopBgm();
    setGameState('GAME_OVER');
  }, []);

  const handleResetGame = () => {
    soundEngine.stopBgm();
    setGameState('TITLE');
    setScore(0);
    setAnswersHistory([]);
    setBossHp(null);
    setBossMaxHp(null);
  };

  const isPlaying = gameState === 'PLAYING' || gameState === 'QUIZ_PAUSED';
  const categoryLabel = selectedCategory === 'all'
    ? 'Tất Cả Môn'
    : CATEGORY_LABELS[selectedCategory]?.label || selectedCategory;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-pink-500 selection:text-white">
      {/* Top Header */}
      <RetroHeader
        score={score}
        highScore={highScore}
        stageName={currentStage.name}
        categoryLabel={categoryLabel}
        onOpenQuizManager={() => setShowQuizManager(true)}
        onOpenRules={() => setShowRules(true)}
        onResetGame={handleResetGame}
        isPlaying={isPlaying}
        sfxOn={sfxOn}
        bgmOn={bgmOn}
        onToggleSfx={handleToggleSfx}
        onToggleBgm={handleToggleBgm}
      />

      {/* Main Game Content */}
      <main className="flex-1 flex flex-col justify-center items-center w-full">
        {gameState === 'TITLE' ? (
          <TitleScreen
            onStartGame={handleStartGame}
            onOpenQuizManager={() => setShowQuizManager(true)}
            onOpenRules={() => setShowRules(true)}
            highScore={highScore}
            totalQuestions={questions.length}
            questions={questions}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
        ) : (
          <div className="w-full flex-1 flex flex-col items-center justify-between max-w-6xl mx-auto">
            {/* Retro Magical HUD */}
            <HUD
              score={score}
              lives={playerLives}
              hp={playerHp}
              maxHp={playerMaxHp}
              mana={playerMana}
              maxMana={playerMaxMana}
              weapon={playerWeapon}
              stageName={currentStage.name}
              stageId={currentStageId}
              bossHp={bossHp}
              bossMaxHp={bossMaxHp}
              bossName={currentStage.bossName}
              quizStreak={quizStreak}
              invincibleTimer={invincibleTimer}
              categoryLabel={categoryLabel}
              dayPhase={dayPhase}
            />

            {/* 60fps HTML5 Canvas Engine */}
            <div className="w-full flex-1 flex items-center justify-center bg-black/95">
              <GameCanvas
                stageId={currentStageId}
                stageName={currentStage.name}
                levelWidth={currentStage.levelWidth}
                skyColorTop={currentStage.skyColorTop}
                skyColorBottom={currentStage.skyColorBottom}
                backgroundTheme={currentStage.backgroundTheme}
                platforms={stageElements.platforms}
                questionBlocks={stageElements.questionBlocks}
                sealGates={stageElements.sealGates}
                supplyPods={stageElements.supplyPods}
                enemies={stageElements.enemies}
                playerLives={playerLives}
                playerHp={playerHp}
                playerMaxHp={playerMaxHp}
                playerMana={playerMana}
                playerMaxMana={playerMaxMana}
                playerWeapon={playerWeapon}
                invincibleTimer={invincibleTimer}
                score={score}
                isPaused={gameState === 'QUIZ_PAUSED'}
                activeGateId={activeGateId}
                onPlayerHpManaChange={(hp, mana, lives) => {
                  setPlayerHp(hp);
                  setPlayerMana(mana);
                  setPlayerLives(lives);
                }}
                onPlayerWeaponChange={(weapon) => {
                  setPlayerWeapon(weapon);
                }}
                onAddScore={(pts) => setScore(s => s + pts)}
                onTriggerQuestion={handleTriggerQuestion}
                onStageClear={handleStageClear}
                onGameOver={handleGameOver}
                onBossHpUpdate={(hp, maxHp) => {
                  setBossHp(hp);
                  setBossMaxHp(maxHp);
                }}
                onDayPhaseChange={(phase) => setDayPhase(phase)}
                touchInput={touchInput}
                skillTriggerTime={skillTriggerTime}
              />
            </div>

            {/* On-Screen Action Bar: NHẢY, TẤN CÔNG & KỸ NĂNG MANA */}
            <TouchControls
              onDirectionChange={(dirs) => {
                setTouchInput(prev => ({
                  ...prev,
                  left: dirs.left,
                  right: dirs.right,
                  up: dirs.up,
                  down: dirs.down
                }));
              }}
              onJumpPress={() => setTouchInput(prev => ({ ...prev, jump: true }))}
              onJumpRelease={() => setTouchInput(prev => ({ ...prev, jump: false }))}
              onShootPress={() => setTouchInput(prev => ({ ...prev, shoot: true }))}
              onShootRelease={() => setTouchInput(prev => ({ ...prev, shoot: false }))}
              onSkillPress={() => setSkillTriggerTime(Date.now())}
            />
          </div>
        )}
      </main>

      {/* Quiz Modal */}
      {gameState === 'QUIZ_PAUSED' && activeQuestion && (
        <QuestionModal
          question={activeQuestion}
          rewardWeapon={pendingRewardWeapon}
          isSealGate={isQuizFromGate}
          onAnswer={handleAnswerSubmit}
          onClose={handleCloseQuestionModal}
        />
      )}

      {/* Stage Clear / Game Over / Victory Modal */}
      {(gameState === 'STAGE_CLEAR' || gameState === 'GAME_OVER' || gameState === 'VICTORY') && (
        <GameOverModal
          type={gameState}
          score={score}
          highScore={highScore}
          stageName={currentStage.name}
          stageId={currentStageId}
          answers={answersHistory}
          categoryLabel={categoryLabel}
          onRestart={() => handleStartGame(1, selectedCategory)}
          onNextStage={handleNextStage}
          onExitToTitle={handleResetGame}
        />
      )}

      {/* Question Bank Manager Modal (Full CRUD: Thêm, Sửa, Xóa, Lọc) */}
      {showQuizManager && (
        <QuizManagerModal
          questions={questions}
          onSaveQuestions={handleSaveQuestions}
          onResetDefault={handleResetDefaultQuestions}
          onClose={() => setShowQuizManager(false)}
        />
      )}

      {/* Rules / Keybindings Modal */}
      {showRules && (
        <RulesModal onClose={() => setShowRules(false)} />
      )}
    </div>
  );
}
