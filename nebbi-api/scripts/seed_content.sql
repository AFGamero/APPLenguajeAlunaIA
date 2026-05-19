-- ============================================================
-- Nebbi API — Seed de contenido base para Neon
-- Módulo 1 con 5 lecciones usando el JSON que compartiste.
-- Ejecutar en el SQL Editor de Neon después del esquema.
-- ============================================================

begin;

insert into public.modules (id, title, order_index, description)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Naturaleza y territorio',
    1,
    'Vocabulario base sobre elementos naturales y territorio en lengua Kogui.'
  )
on conflict (order_index) do update
set title = excluded.title,
    description = excluded.description;

insert into public.lessons (id, module_id, title, order_index, xp_reward, content)
values
  (
    '22222222-2222-2222-2222-222222222221',
    '11111111-1111-1111-1111-111111111111',
    'Cedro, miel y maíz',
    1,
    30,
    $${
      "vocab": [
        {
          "phonetic": "/ul.dul.da/",
          "audio_url": null,
          "word_kogui": "Uldulda",
          "translation": "Cedro",
          "cultural_note": "El cedro es valorado por su resistencia y utilidad."
        },
        {
          "phonetic": "/ja.tia/",
          "audio_url": null,
          "word_kogui": "Jatia",
          "translation": "Miel",
          "cultural_note": "La miel representa alimento natural y conexión con la biodiversidad."
        },
        {
          "phonetic": "/e.bi/",
          "audio_url": null,
          "word_kogui": "Ebi",
          "translation": "Maíz",
          "cultural_note": "El maíz es base de la alimentación y símbolo de vida."
        }
      ],
      "exercises": [
        {
          "hint": "Es un árbol muy utilizado por su madera.",
          "type": "multiple_choice",
          "options": ["Cedro", "Páramo", "Mar", "Laguna"],
          "question": "Uldulda",
          "correct_index": 0
        },
        {
          "hint": "Es un alimento esencial en muchas culturas indígenas.",
          "type": "multiple_choice",
          "options": ["Miel", "Maíz", "Agua", "Nieve"],
          "question": "Ebi",
          "correct_index": 1
        },
        {
          "hint": "Relaciona correctamente.",
          "type": "match",
          "pairs": [
            {"kogui": "Uldulda", "spanish": "Cedro"},
            {"kogui": "Jatia", "spanish": "Miel"},
            {"kogui": "Ebi", "spanish": "Maíz"}
          ]
        },
        {
          "hint": "Empieza con 'ja'...",
          "type": "write",
          "answer": "jatia",
          "prompt": "¿Cómo se dice Miel en Kogui?"
        }
      ]
    }$$::json
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Roble, higuerón y yarumo',
    2,
    30,
    $${
      "vocab": [
        {
          "phonetic": "/tai.zhi/",
          "audio_url": null,
          "word_kogui": "Taizhi",
          "translation": "Roble",
          "cultural_note": "El roble simboliza fortaleza y permanencia."
        },
        {
          "phonetic": "/misu/",
          "audio_url": null,
          "word_kogui": "Misʉ",
          "translation": "Higuerón",
          "cultural_note": "El higuerón es un árbol importante dentro del bosque de la Sierra."
        },
        {
          "phonetic": "/du.gu.na/",
          "audio_url": null,
          "word_kogui": "Duguna",
          "translation": "Yarumo",
          "cultural_note": "El yarumo es reconocido por sus hojas claras y su presencia en zonas húmedas."
        }
      ],
      "exercises": [
        {
          "hint": "Es un árbol fuerte y resistente.",
          "type": "multiple_choice",
          "options": ["Roble", "Laguna", "Río", "Aire"],
          "question": "Taizhi",
          "correct_index": 0
        },
        {
          "hint": "Árbol grande común en bosques tropicales.",
          "type": "multiple_choice",
          "options": ["Cedro", "Yarumo", "Páramo", "Nieve"],
          "question": "Duguna",
          "correct_index": 1
        },
        {
          "hint": "Relaciona cada palabra.",
          "type": "match",
          "pairs": [
            {"kogui": "Taizhi", "spanish": "Roble"},
            {"kogui": "Misʉ", "spanish": "Higuerón"},
            {"kogui": "Duguna", "spanish": "Yarumo"}
          ]
        },
        {
          "hint": "Empieza con 'mi'...",
          "type": "write",
          "answer": "misʉ",
          "prompt": "¿Cómo se dice Higuerón en Kogui?"
        }
      ]
    }$$::json
  ),
  (
    '22222222-2222-2222-2222-222222222223',
    '11111111-1111-1111-1111-111111111111',
    'Sol, aire y árbol',
    3,
    30,
    $${
      "vocab": [
        {
          "phonetic": "/ma.ma/",
          "audio_url": null,
          "word_kogui": "Mama",
          "translation": "Sol",
          "cultural_note": "El sol representa energía, tiempo y equilibrio natural."
        },
        {
          "phonetic": "/mul.kal.da/",
          "audio_url": null,
          "word_kogui": "Mulkalda",
          "translation": "Aire",
          "cultural_note": "El aire simboliza la conexión entre todos los seres vivos."
        },
        {
          "phonetic": "/ka.dzi/",
          "audio_url": null,
          "word_kogui": "Kadzi",
          "translation": "Árbol",
          "cultural_note": "Los árboles son considerados guardianes de la naturaleza."
        }
      ],
      "exercises": [
        {
          "hint": "Ilumina el día.",
          "type": "multiple_choice",
          "options": ["Luna", "Aire", "Sol", "Árbol"],
          "question": "Mama",
          "correct_index": 2
        },
        {
          "hint": "No se puede ver, pero se puede sentir.",
          "type": "multiple_choice",
          "options": ["Aire", "Agua", "Fuego", "Nieve"],
          "question": "Mulkalda",
          "correct_index": 0
        },
        {
          "hint": "Relaciona correctamente.",
          "type": "match",
          "pairs": [
            {"kogui": "Mama", "spanish": "Sol"},
            {"kogui": "Mulkalda", "spanish": "Aire"},
            {"kogui": "Kadzi", "spanish": "Árbol"}
          ]
        },
        {
          "hint": "Empieza con 'ka'...",
          "type": "write",
          "answer": "kadzi",
          "prompt": "¿Cómo se dice Árbol en Kogui?"
        }
      ]
    }$$::json
  ),
  (
    '22222222-2222-2222-2222-222222222224',
    '11111111-1111-1111-1111-111111111111',
    'Nieve, páramo y mar',
    4,
    30,
    $${
      "vocab": [
        {
          "phonetic": "/nu.a.bi/",
          "audio_url": null,
          "word_kogui": "Nuabi",
          "translation": "Nieve",
          "cultural_note": "La nieve simboliza pureza y conexión con las montañas sagradas."
        },
        {
          "phonetic": "/ge.xa/",
          "audio_url": null,
          "word_kogui": "Gexa",
          "translation": "Páramo",
          "cultural_note": "El páramo es fuente de agua y vida para la Sierra Nevada."
        },
        {
          "phonetic": "/ni.bu.ni/",
          "audio_url": null,
          "word_kogui": "Níbuni",
          "translation": "Mar",
          "cultural_note": "El mar representa el equilibrio entre la Sierra y el mundo exterior."
        }
      ],
      "exercises": [
        {
          "hint": "Se encuentra en las partes más altas y frías.",
          "type": "multiple_choice",
          "options": ["Nieve", "Laguna", "Mar", "Río"],
          "question": "Nuabi",
          "correct_index": 0
        },
        {
          "hint": "Es un ecosistema de altura muy importante.",
          "type": "multiple_choice",
          "options": ["Bosque", "Páramo", "Desierto", "Valle"],
          "question": "Gexa",
          "correct_index": 1
        },
        {
          "hint": "Une cada palabra con su traducción.",
          "type": "match",
          "pairs": [
            {"kogui": "Nuabi", "spanish": "Nieve"},
            {"kogui": "Gexa", "spanish": "Páramo"},
            {"kogui": "Níbuni", "spanish": "Mar"}
          ]
        },
        {
          "hint": "Empieza con 'ní'...",
          "type": "write",
          "answer": "níbuni",
          "prompt": "¿Cómo se dice Mar en Kogui?"
        }
      ]
    }$$::json
  ),
  (
    '22222222-2222-2222-2222-222222222225',
    '11111111-1111-1111-1111-111111111111',
    'Agua, río y laguna',
    5,
    30,
    $${
      "vocab": [
        {
          "phonetic": "/ni/",
          "audio_url": null,
          "word_kogui": "Ni",
          "translation": "Agua",
          "cultural_note": "El agua representa pureza y equilibrio espiritual para el pueblo Kogui."
        },
        {
          "phonetic": "/ni.na/",
          "audio_url": null,
          "word_kogui": "Nina",
          "translation": "Río",
          "cultural_note": "Los ríos son caminos sagrados que conectan la Sierra Nevada."
        },
        {
          "phonetic": "/ni.wa/",
          "audio_url": null,
          "word_kogui": "Niwa",
          "translation": "Laguna",
          "cultural_note": "Las lagunas son espacios ceremoniales de gran importancia espiritual."
        }
      ],
      "exercises": [
        {
          "hint": "Es el elemento más importante para la vida.",
          "type": "multiple_choice",
          "options": ["Montaña", "Agua", "Sol", "Árbol"],
          "question": "Ni",
          "correct_index": 1
        },
        {
          "hint": "Fluye desde la Sierra hacia el mar.",
          "type": "multiple_choice",
          "options": ["Laguna", "Páramo", "Río", "Nieve"],
          "question": "Nina",
          "correct_index": 2
        },
        {
          "hint": "Relaciona cada palabra con su significado.",
          "type": "match",
          "pairs": [
            {"kogui": "Ni", "spanish": "Agua"},
            {"kogui": "Nina", "spanish": "Río"},
            {"kogui": "Niwa", "spanish": "Laguna"}
          ]
        },
        {
          "hint": "Empieza con 'ni'...",
          "type": "write",
          "answer": "niwa",
          "prompt": "¿Cómo se dice Laguna en Kogui?"
        }
      ]
    }$$::json
  )
on conflict (module_id, order_index) do update
set title = excluded.title,
    xp_reward = excluded.xp_reward,
    content = excluded.content;

commit;
