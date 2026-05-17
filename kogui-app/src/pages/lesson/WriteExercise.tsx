import { useState, useEffect } from 'react';
import styles from './WriteExercise.module.css';

interface WriteExerciseData {
  prompt: string;
  answer: string;
  hint: string;
}

interface Props {
  data: WriteExerciseData;
  onComplete: (success: boolean) => void;
}

export default function WriteExercise({ data, onComplete }: Props) {
  const [value, setValue] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    setValue('');
    setIsCorrect(null);
    setShowHint(false);
    setHasFailed(false);
    
    const timer = setTimeout(() => {
      setShowHint(true);
    }, 6000);
    
    return () => clearTimeout(timer);
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    
    const correct = normalize(value) === normalize(data.answer);
    setIsCorrect(correct);
    if (!correct) {
      setHasFailed(true);
      setShowHint(true);
    }
  };

  const handleRetry = () => {
    setIsCorrect(null);
  };

  const handleNext = () => {
    onComplete(!hasFailed);
  };

  return (
    <div className={`${styles.container} animate-fadeIn`}>
      <h2 className={styles.instruction}>Escribe la traducción</h2>
      <h1 className={styles.prompt}>{data.prompt}</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input 
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`${styles.input} ${isCorrect === false ? styles.inputError : ''} ${isCorrect === true ? styles.inputSuccess : ''}`}
          placeholder="Escribe tu respuesta aquí..."
          autoFocus
          disabled={isCorrect !== null}
        />
        {isCorrect === null && (
          <button type="submit" className={styles.submitBtn} disabled={!value.trim()}>
            Comprobar
          </button>
        )}
      </form>

      {showHint && isCorrect !== true && (
        <div className={`${styles.hintBox} animate-fadeIn`}>
          <span className={styles.hintIcon}>💡</span>
          <p>{data.hint}</p>
        </div>
      )}

      {isCorrect !== null && (
        <div className={`${styles.feedbackFooter} ${isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect} animate-slideIn`}>
          <div className={styles.feedbackContent}>
            <h3>{isCorrect ? '¡Excelente!' : 'Respuesta incorrecta'}</h3>
            {!isCorrect && <p>Sigue intentando.</p>}
          </div>
          <button className={styles.continueBtn} onClick={isCorrect ? handleNext : handleRetry}>
            {isCorrect ? 'Continuar' : 'Intentar de nuevo'}
          </button>
        </div>
      )}
    </div>
  );
}
