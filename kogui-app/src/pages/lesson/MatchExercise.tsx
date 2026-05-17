import { useState, useEffect } from 'react';
import styles from './MatchExercise.module.css';

interface Pair {
  kogui: string;
  spanish: string;
}

interface MatchExerciseData {
  pairs: Pair[];
  hint: string;
}

interface Props {
  data: MatchExerciseData;
  onComplete: (success: boolean) => void;
}

export default function MatchExercise({ data, onComplete }: Props) {
  const [leftItems, setLeftItems] = useState<{ id: number, text: string }[]>([]);
  const [rightItems, setRightItems] = useState<{ id: number, text: string }[]>([]);
  
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  
  const [matchedIds, setMatchedIds] = useState<Set<number>>(new Set());
  const [errorIds, setErrorIds] = useState<[number, number] | null>(null);
  const [mistakes, setMistakes] = useState(0);

  useEffect(() => {
    if (!data || !data.pairs) return;
    const pairs = data.pairs.map((p, i) => ({ id: i, kogui: p.kogui, spanish: p.spanish }));
    
    const left = [...pairs].map(p => ({ id: p.id, text: p.kogui })).sort(() => Math.random() - 0.5);
    const right = [...pairs].map(p => ({ id: p.id, text: p.spanish })).sort(() => Math.random() - 0.5);
    
    setLeftItems(left);
    setRightItems(right);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedIds(new Set());
    setErrorIds(null);
    setMistakes(0);
  }, [data]);

  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      if (selectedLeft === selectedRight) {
        setMatchedIds(prev => new Set(prev).add(selectedLeft));
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        setMistakes(m => m + 1);
        setErrorIds([selectedLeft, selectedRight]);
        setTimeout(() => {
          setErrorIds(null);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 800); 
      }
    }
  }, [selectedLeft, selectedRight]);

  const allMatched = data && data.pairs && matchedIds.size === data.pairs.length && data.pairs.length > 0;

  return (
    <div className={`${styles.container} animate-fadeIn`}>
      <h2 className={styles.instruction}>Empareja las palabras</h2>
      
      <div className={styles.matchGrid}>
        <div className={styles.column}>
          {leftItems.map(item => {
            const isMatched = matchedIds.has(item.id);
            const isSelected = selectedLeft === item.id;
            const isError = errorIds && errorIds[0] === item.id;
            
            let btnClass = styles.itemBtn;
            if (isMatched) btnClass += ` ${styles.matched}`;
            else if (isError) btnClass += ` ${styles.error}`;
            else if (isSelected) btnClass += ` ${styles.selected}`;

            return (
              <button
                key={`l-${item.id}`}
                className={btnClass}
                onClick={() => !isMatched && setSelectedLeft(isSelected ? null : item.id)}
                disabled={isMatched || (errorIds !== null)}
              >
                {item.text}
              </button>
            );
          })}
        </div>

        <div className={styles.column}>
          {rightItems.map(item => {
            const isMatched = matchedIds.has(item.id);
            const isSelected = selectedRight === item.id;
            const isError = errorIds && errorIds[1] === item.id;
            
            let btnClass = styles.itemBtn;
            if (isMatched) btnClass += ` ${styles.matched}`;
            else if (isError) btnClass += ` ${styles.error}`;
            else if (isSelected) btnClass += ` ${styles.selected}`;

            return (
              <button
                key={`r-${item.id}`}
                className={btnClass}
                onClick={() => !isMatched && setSelectedRight(isSelected ? null : item.id)}
                disabled={isMatched || (errorIds !== null)}
              >
                {item.text}
              </button>
            );
          })}
        </div>
      </div>

      {mistakes >= 3 && data.hint && (
        <div className={`${styles.hintBox} animate-fadeIn`}>
          <span className={styles.hintIcon}>💡</span>
          <p>{data.hint}</p>
        </div>
      )}

      {allMatched && (
        <div className={`${styles.feedbackFooter} ${styles.feedbackCorrect} animate-slideIn`}>
          <div className={styles.feedbackContent}>
            <h3>¡Excelente!</h3>
            <p>Has emparejado todas las palabras correctamente.</p>
          </div>
          <button className={styles.continueBtn} onClick={() => onComplete(mistakes === 0)}>
            Continuar
          </button>
        </div>
      )}
    </div>
  );
}
