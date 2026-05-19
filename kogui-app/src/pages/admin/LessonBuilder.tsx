import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import { useNavigate, useParams } from 'react-router-dom';
import type { AdminLessonUpsert, AdminModule } from '@/types/api';
import styles from './LessonBuilder.module.css';

export default function LessonBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [modules, setModules] = useState<AdminModule[]>([]);
  const [formData, setFormData] = useState({
    module_id: '',
    title: '',
    order_index: 1,
    xp_reward: 20
  });

  const [vocabList, setVocabList] = useState<any[]>([]);
  const [exercisesList, setExercisesList] = useState<any[]>([]);
  
  // Advanced JSON Mode
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [jsonContent, setJsonContent] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const mods = await apiClient.admin.modules();
        setModules(mods);
        if (!isEditMode && mods.length > 0) {
          setFormData(prev => ({ ...prev, module_id: mods[0].id }));
        }

        if (isEditMode) {
          const lesson = await apiClient.admin.getLesson(id!);
          setFormData({
            module_id: lesson.module_id,
            title: lesson.title,
            order_index: lesson.order_index,
            xp_reward: lesson.xp_reward
          });
          if (lesson.content) {
            setVocabList(lesson.content.vocab || []);
              
            // Mapear ejercicios de base de datos a formato de editor
            const mappedExercises = (lesson.content.exercises || []).map((ex: any) => {
              if (ex.type === 'match') {
                const mappedPairs = (ex.pairs || []).map((p: any) => ({
                  kogui: p.kogui || '',
                  espanol: p.spanish || p.espanol || ''
                }));
                while (mappedPairs.length < 4) {
                  mappedPairs.push({ kogui: '', espanol: '' });
                }
                return {
                  type: 'match',
                  pairs: mappedPairs,
                  hint: ex.hint || ''
                };
              } else if (ex.type === 'write') {
                return {
                  type: 'write',
                  question: ex.prompt || '',
                  answer: ex.answer || '',
                  hint: ex.hint || ''
                };
              } else if (ex.type === 'multiple_choice') {
                return {
                  type: 'multiple_choice',
                  question: ex.question || '',
                  options: ex.options || ['', '', '', ''],
                  correct_index: ex.correct_index !== undefined ? ex.correct_index : 0,
                  hint: ex.hint || ''
                };
              }
              return ex;
            });
            setExercisesList(mappedExercises);
          }
        } else {
          // Inicializar con listas vacías si es nuevo
          setVocabList([{ word_kogui: '', phonetic: '', translation: '', cultural_note: '' }]);
          setExercisesList([{ type: 'multiple_choice', question: '', options: ['', '', '', ''], correct_index: 0, hint: '' }]);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error cargando datos';
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, isEditMode]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let content;
      if (isAdvancedMode) {
        try {
          content = JSON.parse(jsonContent);
        } catch (err) {
          throw new Error("El JSON es inválido. Corrige los errores de sintaxis antes de guardar.");
        }
      } else {
        const mappedExercises = exercisesList
          .filter(e => e.question?.trim() !== '' || (e.type === 'match' && e.pairs?.some((p: any) => p.kogui?.trim() !== '')))
          .map((ex: any) => {
            if (ex.type === 'match') {
              const pairs = (ex.pairs || [])
                .filter((p: any) => p.kogui?.trim() !== '' && p.espanol?.trim() !== '')
                .map((p: any) => ({
                  kogui: p.kogui,
                  spanish: p.espanol
                }));
              return {
                type: 'match',
                pairs,
                hint: ex.hint || ''
              };
            } else if (ex.type === 'write') {
              return {
                type: 'write',
                prompt: ex.question,
                answer: ex.answer,
                hint: ex.hint || ''
              };
            } else if (ex.type === 'multiple_choice') {
              return {
                type: 'multiple_choice',
                question: ex.question,
                options: ex.options,
                correct_index: ex.correct_index,
                hint: ex.hint || ''
              };
            }
            return ex;
          });

        content = {
          vocab: vocabList.filter(v => v.word_kogui?.trim() !== ''),
          exercises: mappedExercises
        };
      }

      const lessonPayload: AdminLessonUpsert = {
        ...formData,
        content
      };

      if (isEditMode) {
        await apiClient.admin.updateLesson(id!, lessonPayload);
      } else {
        await apiClient.admin.createLesson(lessonPayload);
      }

      navigate('/admin/lessons');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error guardando la lección';
      setError(message);
      setSaving(false);
    }
  };

  // Vocab Handlers
  const addVocab = () => setVocabList([...vocabList, { word_kogui: '', phonetic: '', translation: '', cultural_note: '' }]);
  const removeVocab = (idx: number) => setVocabList(vocabList.filter((_, i) => i !== idx));
  const updateVocab = (idx: number, field: string, value: string) => {
    const newList = [...vocabList];
    newList[idx][field] = value;
    setVocabList(newList);
  };

  // Exercises Handlers
  const addExercise = () => setExercisesList([...exercisesList, { type: 'multiple_choice', question: '', options: ['', '', '', ''], correct_index: 0, hint: '' }]);
  const removeExercise = (idx: number) => setExercisesList(exercisesList.filter((_, i) => i !== idx));
  const updateExercise = (idx: number, field: string, value: any) => {
    const newList = [...exercisesList];
    newList[idx][field] = value;
    setExercisesList(newList);
  };

  const updateOption = (exIdx: number, optIdx: number, value: string) => {
    const newList = [...exercisesList];
    newList[exIdx].options[optIdx] = value;
    setExercisesList(newList);
  };

  const updatePair = (exIdx: number, pairIdx: number, field: 'kogui' | 'espanol', value: string) => {
    const newList = [...exercisesList];
    newList[exIdx].pairs[pairIdx][field] = value;
    setExercisesList(newList);
  };

  const toggleAdvancedMode = () => {
    if (!isAdvancedMode) {
      // Switching to Advanced Mode: serialize visual state to JSON string
      const currentContent = {
        vocab: vocabList.filter(v => v.word_kogui?.trim() !== ''),
        exercises: exercisesList.filter(e => e.question?.trim() !== '' || e.pairs?.length > 0)
      };
      setJsonContent(JSON.stringify(currentContent, null, 2));
      setIsAdvancedMode(true);
    } else {
      // Switching to Visual Mode: try to parse JSON string back to visual state
      try {
        const parsed = JSON.parse(jsonContent);
        setVocabList(parsed.vocab || []);
        setExercisesList(parsed.exercises || []);
        setIsAdvancedMode(false);
        setError(null);
      } catch (err) {
        setError("El JSON es inválido. No se puede volver al modo visual hasta que se arregle la sintaxis.");
      }
    }
  };

  if (loading) return <div className={styles.loading}>Cargando constructor...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{isEditMode ? 'Editar Lección' : 'Crear Nueva Lección'}</h3>
        <div className={styles.headerActions}>
          <button type="button" onClick={toggleAdvancedMode} className={styles.advancedBtn}>
            {isAdvancedMode ? '🔄 Volver a Modo Visual' : '⚙️ Modo JSON Avanzado'}
          </button>
          <button type="button" onClick={() => navigate('/admin/lessons')} className={styles.cancelBtn}>
            Cancelar
          </button>
        </div>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      <form onSubmit={handleSave} className={styles.formLayout}>
        {/* Basic Info */}
        <section className={styles.sectionPanel}>
          <h4 className={styles.sectionTitle}>1. Información Básica</h4>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Módulo</label>
              <select value={formData.module_id} onChange={e => setFormData({...formData, module_id: e.target.value})} required>
                {modules.map(m => (
                  <option key={m.id} value={m.id}>Módulo {m.order_index}: {m.title}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>Título de la Lección</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className={styles.field}>
              <label>Orden</label>
              <input type="number" min="1" value={formData.order_index} onChange={e => setFormData({...formData, order_index: parseInt(e.target.value)})} required />
            </div>
            <div className={styles.field}>
              <label>XP</label>
              <input type="number" min="0" step="5" value={formData.xp_reward} onChange={e => setFormData({...formData, xp_reward: parseInt(e.target.value)})} required />
            </div>
          </div>
        </section>

        {isAdvancedMode ? (
          <section className={styles.sectionPanel}>
            <div className={styles.sectionHeader}>
              <h4 className={styles.sectionTitle}>Edición Avanzada JSON</h4>
              <span className={styles.jsonHelp}>Estructura requerida: {`{ vocab: [], exercises: [] }`}</span>
            </div>
            <textarea
              className={styles.jsonEditor}
              value={jsonContent}
              onChange={e => setJsonContent(e.target.value)}
              spellCheck="false"
              required
            />
          </section>
        ) : (
          <>
            {/* Vocabulario */}
            <section className={styles.sectionPanel}>
          <div className={styles.sectionHeader}>
            <h4 className={styles.sectionTitle}>2. Vocabulario ({vocabList.length})</h4>
            <button type="button" className={styles.addBtn} onClick={addVocab}>+ Agregar Palabra</button>
          </div>
          <div className={styles.listContainer}>
            {vocabList.map((v, idx) => (
              <div key={idx} className={styles.itemCard}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemBadge}>Palabra #{idx + 1}</span>
                  <button type="button" className={styles.deleteBtn} onClick={() => removeVocab(idx)}>🗑️ Eliminar</button>
                </div>
                <div className={styles.itemGrid}>
                  <div className={styles.field}>
                    <label>Palabra en Kogui</label>
                    <input type="text" value={v.word_kogui} onChange={e => updateVocab(idx, 'word_kogui', e.target.value)} required />
                  </div>
                  <div className={styles.field}>
                    <label>Traducción</label>
                    <input type="text" value={v.translation} onChange={e => updateVocab(idx, 'translation', e.target.value)} required />
                  </div>
                  <div className={styles.field}>
                    <label>Fonética</label>
                    <input type="text" value={v.phonetic || ''} onChange={e => updateVocab(idx, 'phonetic', e.target.value)} />
                  </div>
                  <div className={styles.field}>
                    <label>Nota Cultural</label>
                    <input type="text" value={v.cultural_note || ''} onChange={e => updateVocab(idx, 'cultural_note', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
            {vocabList.length === 0 && <p className={styles.emptyMsg}>No hay palabras en el vocabulario.</p>}
          </div>
        </section>

        {/* Ejercicios */}
        <section className={styles.sectionPanel}>
          <div className={styles.sectionHeader}>
            <h4 className={styles.sectionTitle}>3. Ejercicios ({exercisesList.length})</h4>
            <button type="button" className={styles.addBtn} onClick={addExercise}>+ Agregar Ejercicio</button>
          </div>
          <div className={styles.listContainer}>
            {exercisesList.map((ex, idx) => (
              <div key={idx} className={styles.itemCard}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemBadge}>Ejercicio #{idx + 1}</span>
                  <div className={styles.typeSelector}>
                    <select value={ex.type} onChange={e => {
                      const type = e.target.value;
                      const newEx: any = { type };
                      if (type === 'multiple_choice') { newEx.question = ''; newEx.options = ['', '', '', '']; newEx.correct_index = 0; newEx.hint = ''; }
                      else if (type === 'match') { 
                        newEx.pairs = [
                          { kogui: '', espanol: '' },
                          { kogui: '', espanol: '' },
                          { kogui: '', espanol: '' },
                          { kogui: '', espanol: '' }
                        ]; 
                        newEx.hint = '';
                      }
                      else if (type === 'write') { newEx.question = ''; newEx.answer = ''; newEx.hint = ''; }
                      
                      const newList = [...exercisesList];
                      newList[idx] = newEx;
                      setExercisesList(newList);
                    }}>
                      <option value="multiple_choice">Selección Múltiple</option>
                      <option value="match">Emparejar (Match)</option>
                      <option value="write">Escribir Traducción</option>
                    </select>
                  </div>
                  <button type="button" className={styles.deleteBtn} onClick={() => removeExercise(idx)}>🗑️ Eliminar</button>
                </div>

                <div className={styles.exerciseBody}>
                  {ex.type === 'multiple_choice' && (
                    <>
                      <div className={styles.field}>
                        <label>Pregunta</label>
                        <input type="text" value={ex.question || ''} onChange={e => updateExercise(idx, 'question', e.target.value)} required />
                      </div>
                      <div className={styles.optionsGrid}>
                        {ex.options?.map((opt: string, optIdx: number) => (
                          <div key={optIdx} className={styles.optionField}>
                            <input 
                              type="radio" 
                              name={`correct_${idx}`} 
                              checked={ex.correct_index === optIdx} 
                              onChange={() => updateExercise(idx, 'correct_index', optIdx)} 
                            />
                            <input 
                              type="text" 
                              value={opt} 
                              placeholder={`Opción ${optIdx + 1}`}
                              onChange={e => updateOption(idx, optIdx, e.target.value)} 
                              required 
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {ex.type === 'match' && (
                    <div className={styles.matchPairsContainer}>
                      <label className={styles.pairsLabel}>Pares a Emparejar (Kogui - Español)</label>
                      <div className={styles.pairsGrid}>
                        {ex.pairs?.map((pair: any, pairIdx: number) => (
                          <div key={pairIdx} className={styles.pairRow}>
                            <span className={styles.pairNumber}>{pairIdx + 1}.</span>
                            <input 
                              type="text" 
                              placeholder="Kogui (Ej: shiká)" 
                              value={pair.kogui} 
                              onChange={e => updatePair(idx, pairIdx, 'kogui', e.target.value)} 
                              required 
                            />
                            <span className={styles.pairArrow}>→</span>
                            <input 
                              type="text" 
                              placeholder="Español (Ej: sol)" 
                              value={pair.espanol} 
                              onChange={e => updatePair(idx, pairIdx, 'espanol', e.target.value)} 
                              required 
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {ex.type === 'write' && (
                    <>
                      <div className={styles.field}>
                        <label>Pregunta (Ej: Traduce 'sol')</label>
                        <input type="text" value={ex.question || ''} onChange={e => updateExercise(idx, 'question', e.target.value)} required />
                      </div>
                      <div className={styles.field}>
                        <label>Respuesta Correcta (Ej: shiká)</label>
                        <input type="text" value={ex.answer || ''} onChange={e => updateExercise(idx, 'answer', e.target.value)} required />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
            {exercisesList.length === 0 && <p className={styles.emptyMsg}>No hay ejercicios.</p>}
          </div>
        </section>
        </>
        )}

        <div className={styles.footerSticky}>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Publicar Lección')}
          </button>
        </div>
      </form>
    </div>
  );
}
