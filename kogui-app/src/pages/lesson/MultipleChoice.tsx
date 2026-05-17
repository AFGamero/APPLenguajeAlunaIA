import { useState, useEffect } from 'react';
import styles from './MultipleChoice.module.css';

interface MultipleChoiceData {
  question: string;
  options: string[];
  correct_index: number;
  hint: string;
}

interface Props {
  data: MultipleChoiceData;
  onComplete: (success: boolean) => void;
}

export default function MultipleChoice({ data, onComplete }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [wrongIndexes, setWrongIndexes] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  // Reset state when data changes (for sequential exercises of the same type)
  useEffect(() => {
    setSelected(null);
    setWrongIndexes([]);
    setIsCorrect(null);
    setShowHint(false);
    setHasFailed(false);
  }, [data]);

  const handleSelect = (index: number) => {
    if (isCorrect) return; // Ya acertó, no hace nada

    setSelected(index);
    const correct = index === data.correct_index;
    
    if (correct) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      setHasFailed(true);
      setShowHint(true);
      if (!wrongIndexes.includes(index)) {
        setWrongIndexes([...wrongIndexes, index]);
      }
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setIsCorrect(null);
  };

  const handleNext = () => {
    if (!isCorrect) return;
    // Si ha fallado, el score no sumará punto, pero se le permite avanzar porque ya encontró la correcta
    onComplete(!hasFailed);
  };

  return (
    <div className={`${styles.container} animate-fadeIn`}>
      <h2 className={styles.instruction}>Selecciona el significado correcto</h2>
      <h1 className={styles.question}>{data.question}</h1>

      <div className={styles.optionsGrid}>
        {data.options.map((option, idx) => {
          let btnClass = styles.optionBtn;
          const isWrongOption = wrongIndexes.includes(idx);
          
          if (selected !== null) {
            if (idx === selected) {
              btnClass = `${styles.optionBtn} ${isCorrect ? styles.correct : styles.incorrect}`;
            } else if (isCorrect && idx === data.correct_index) {
              btnClass = `${styles.optionBtn} ${styles.correct}`;
            } else {
              btnClass = `${styles.optionBtn} ${styles.disabled}`;
            }
          } else if (isWrongOption) {
            btnClass = `${styles.optionBtn} ${styles.disabled}`;
          }

          return (
            <button
              key={idx}
              className={btnClass}
              onClick={() => handleSelect(idx)}
              disabled={selected !== null || isWrongOption}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showHint && hasFailed && (
        <div className={`${styles.hintBox} animate-fadeIn`}>
          <span className={styles.hintIcon}>💡</span>
          <p>{data.hint}</p>
        </div>
      )}

      {selected !== null && (
        <div className={`${styles.feedbackFooter} ${isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect} animate-fadeIn`}>
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
