import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/apiClient';
import type { LessonDetailResponse } from '@/types/api';
import VocabScreen from './VocabScreen';
import MultipleChoice from './MultipleChoice';
import MatchExercise from './MatchExercise';
import WriteExercise from './WriteExercise';
import ResultScreen from './ResultScreen';
import styles from './LessonPage.module.css';

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<LessonDetailResponse | null>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function loadLesson() {
      if (!user || !id) return;
      try {
        const typedData = await apiClient.lessons.get(id);
        const content = typedData.content;
        
        // Flatten into a single array of steps
        const vocabSteps = (content.vocab || []).map((v) => ({ ...v, type: 'vocab_card' }));
        const exerciseSteps = content.exercises || [];
        
        const combinedSteps = [...vocabSteps, ...exerciseSteps];

        if (isMounted) {
          setLesson(typedData);
          setSteps(combinedSteps);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Error al cargar la lección:', err);
        if (isMounted) {
          setError(err.message || 'Error al cargar la lección');
          setLoading(false);
        }
      }
    }

    loadLesson();
    return () => { isMounted = false; };
  }, [user, id]);

  const handleNext = (success?: boolean) => {
    if (success) {
      setScore(prev => prev + 1);
    }
    setCurrentIndex(prev => prev + 1);
  };

  const handleExit = () => {
    if (window.confirm('¿Seguro que quieres salir? Perderás tu progreso en esta lección.')) {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>{error || 'Lección no encontrada'}</p>
        <button className={styles.btnSecondary} onClick={() => navigate('/')}>Volver al mapa</button>
      </div>
    );
  }

  // Si ya pasamos todos los pasos, mostramos la pantalla de resultados
  if (currentIndex >= steps.length) {
    return (
      <div className={styles.page}>
        <main className={styles.contentArea}>
          <ResultScreen 
            lessonId={lesson.id} 
            score={score} 
            total={steps.length} 
            xpReward={lesson.xp_reward} 
          />
        </main>
      </div>
    );
  }

  const currentStep = steps[currentIndex];
  const progressPercentage = ((currentIndex) / steps.length) * 100;

  // Renderizar componente según el tipo
  const renderStep = () => {
    switch (currentStep.type) {
      case 'vocab_card':
        return <VocabScreen data={currentStep} onNext={() => handleNext(true)} />;
      case 'multiple_choice':
        return <MultipleChoice data={currentStep} onComplete={handleNext} />;
      case 'match':
        return <MatchExercise data={currentStep} onComplete={handleNext} />;
      case 'write':
        return <WriteExercise data={currentStep} onComplete={handleNext} />;
      default:
        return (
          <div>
            <p>Tipo de ejercicio desconocido: {currentStep.type}</p>
            <button onClick={() => handleNext(false)}>Saltar</button>
          </div>
        );
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button onClick={handleExit} className={styles.closeBtn} title="Salir">✖</button>
        <div className={styles.progressBarBg}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      <main className={styles.contentArea}>
        {renderStep()}
      </main>
    </div>
  );
}
