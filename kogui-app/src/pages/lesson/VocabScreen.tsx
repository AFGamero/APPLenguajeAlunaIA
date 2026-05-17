import { useState } from 'react';
import styles from './VocabScreen.module.css';

interface VocabData {
  word_kogui: string;
  phonetic: string;
  translation: string;
  cultural_note: string;
  audio_url: string | null;
}

interface Props {
  data: VocabData;
  onNext: () => void;
}

export default function VocabScreen({ data, onNext }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    
    if (data.audio_url) {
      const audio = new Audio(data.audio_url);
      audio.onended = () => setIsPlaying(false);
      audio.play().catch(e => {
        console.error('Audio play failed', e);
        fallbackSpeech();
      });
    } else {
      fallbackSpeech();
    }
  };

  const fallbackSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(data.word_kogui);
      utterance.lang = 'es-CO'; 
      utterance.rate = 0.8;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className={`${styles.container} animate-fadeIn`}>
      <h2 className={styles.title}>Nueva Palabra</h2>
      
      <div className={styles.card}>
        <div className={styles.wordSection}>
          <h1 className={styles.koguiWord}>{data.word_kogui}</h1>
          <p className={styles.phonetic}>{data.phonetic}</p>
        </div>

        <button 
          className={`${styles.audioBtn} ${isPlaying ? styles.playing : ''}`} 
          onClick={handlePlayAudio}
          title="Escuchar pronunciación"
        >
          {isPlaying ? '🔊' : '🔈'}
        </button>

        <div className={styles.translationSection}>
          <span className={styles.translationLabel}>Significa:</span>
          <p className={styles.translation}>{data.translation}</p>
        </div>
      </div>

      {data.cultural_note && (
        <div className={styles.culturalNote}>
          <span className={styles.culturalIcon}>🌿</span>
          <p>{data.cultural_note}</p>
        </div>
      )}

      <button className={styles.nextBtn} onClick={onNext}>
        Continuar
      </button>
    </div>
  );
}
