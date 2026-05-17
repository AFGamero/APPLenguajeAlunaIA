-- ============================================================
-- Kogui App — Seed inicial (T-00-08)
-- Módulo 1: "Naturaleza y territorio"
-- Lección 1: El sol, el agua y la montaña
-- Lección 2: El árbol, el río y la piedra
-- Lección 3: El viento, la lluvia y la tierra
-- ============================================================
-- Ejecutar DESPUÉS de 001_initial_schema.sql
-- Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Módulo 1 ──────────────────────────────────────────────────
insert into public.modules (id, title, order_index, description)
values (
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Naturaleza y territorio',
  1,
  'Aprende las palabras Kogui que describen el mundo natural de la Sierra Nevada de Santa Marta.'
)
on conflict (order_index) do nothing;


-- ============================================================
-- Lección 1: El sol, el agua y la montaña
-- ============================================================
insert into public.lessons (id, module_id, title, order_index, xp_reward, content)
values (
  'b1c2d3e4-0001-0001-0001-000000000001',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'El sol, el agua y la montaña',
  1,
  30,
  '{
    "vocab": [
      {
        "word_kogui": "Zaku",
        "phonetic": "/za.ku/",
        "translation": "Sol",
        "cultural_note": "En la cosmología Kogui, el sol es la fuerza vital masculina que da origen al día y al tiempo.",
        "audio_url": null
      },
      {
        "word_kogui": "Nyui",
        "phonetic": "/ɲu.i/",
        "translation": "Agua",
        "cultural_note": "El agua es considerada sagrada. Los Kogui cuidan las fuentes hídricas como guardianes espirituales de la Sierra.",
        "audio_url": null
      },
      {
        "word_kogui": "Teyuna",
        "phonetic": "/te.ju.na/",
        "translation": "Montaña / Sierra",
        "cultural_note": "La Sierra Nevada es llamada Teyuna, el corazón del mundo según la tradición Kogui.",
        "audio_url": null
      }
    ],
    "exercises": [
      {
        "type": "multiple_choice",
        "question": "Zaku",
        "options": ["Agua", "Sol", "Montaña", "Viento"],
        "correct_index": 1,
        "hint": "Piensa en la fuerza que ilumina el día."
      },
      {
        "type": "multiple_choice",
        "question": "Nyui",
        "options": ["Fuego", "Tierra", "Agua", "Árbol"],
        "correct_index": 2,
        "hint": "Es el elemento sagrado que los Kogui protegen."
      },
      {
        "type": "match",
        "pairs": [
          { "kogui": "Zaku",   "spanish": "Sol" },
          { "kogui": "Nyui",   "spanish": "Agua" },
          { "kogui": "Teyuna", "spanish": "Montaña" }
        ],
        "hint": "Recuerda: Zaku suena como un nombre de estrella."
      },
      {
        "type": "write",
        "prompt": "¿Cómo se dice Montaña en Kogui?",
        "answer": "teyuna",
        "hint": "Empieza con la sílaba ''tey''..."
      }
    ]
  }'::jsonb
)
on conflict (module_id, order_index) do nothing;


-- ============================================================
-- Lección 2: El árbol, el río y la piedra
-- ============================================================
insert into public.lessons (id, module_id, title, order_index, xp_reward, content)
values (
  'b1c2d3e4-0001-0001-0001-000000000002',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'El árbol, el río y la piedra',
  2,
  30,
  '{
    "vocab": [
      {
        "word_kogui": "Kai",
        "phonetic": "/kai/",
        "translation": "Árbol / Palo",
        "cultural_note": "Los árboles son mensajeros entre la tierra y el mundo espiritual en la tradición Kogui.",
        "audio_url": null
      },
      {
        "word_kogui": "Duina",
        "phonetic": "/du.i.na/",
        "translation": "Río",
        "cultural_note": "Los ríos de la Sierra Nevada son considerados venas de la Madre Tierra. Los Kogui realizan pagamentos en sus orillas.",
        "audio_url": null
      },
      {
        "word_kogui": "Kaku",
        "phonetic": "/ka.ku/",
        "translation": "Piedra / Roca",
        "cultural_note": "Las piedras sagradas son usadas por los Mamos Kogui en rituales de consulta espiritual.",
        "audio_url": null
      }
    ],
    "exercises": [
      {
        "type": "multiple_choice",
        "question": "Kai",
        "options": ["Piedra", "Río", "Árbol", "Tierra"],
        "correct_index": 2,
        "hint": "Es un ser vivo que crece hacia el cielo."
      },
      {
        "type": "multiple_choice",
        "question": "Duina",
        "options": ["Lago", "Río", "Mar", "Lluvia"],
        "correct_index": 1,
        "hint": "Son las venas de la Madre Tierra."
      },
      {
        "type": "match",
        "pairs": [
          { "kogui": "Kai",   "spanish": "Árbol" },
          { "kogui": "Duina", "spanish": "Río" },
          { "kogui": "Kaku",  "spanish": "Piedra" }
        ],
        "hint": "Kaku y Zaku riman — uno es piedra, el otro sol."
      },
      {
        "type": "write",
        "prompt": "¿Cómo se dice Río en Kogui?",
        "answer": "duina",
        "hint": "Empieza con ''du''..."
      }
    ]
  }'::jsonb
)
on conflict (module_id, order_index) do nothing;


-- ============================================================
-- Lección 3: El viento, la lluvia y la tierra
-- ============================================================
insert into public.lessons (id, module_id, title, order_index, xp_reward, content)
values (
  'b1c2d3e4-0001-0001-0001-000000000003',
  'a1b2c3d4-0001-0001-0001-000000000001',
  'El viento, la lluvia y la tierra',
  3,
  30,
  '{
    "vocab": [
      {
        "word_kogui": "Seiku",
        "phonetic": "/sei.ku/",
        "translation": "Viento",
        "cultural_note": "El viento lleva los mensajes de los ancestros Kogui entre los planos espirituales.",
        "audio_url": null
      },
      {
        "word_kogui": "Uga",
        "phonetic": "/u.ga/",
        "translation": "Lluvia",
        "cultural_note": "La lluvia es vista como la bendición de la Madre Universal sobre la Sierra Nevada.",
        "audio_url": null
      },
      {
        "word_kogui": "Zhigoneshi",
        "phonetic": "/ʒi.go.ne.ʃi/",
        "translation": "Tierra / Suelo",
        "cultural_note": "Zhigoneshi es también el nombre del movimiento de comunicación intercultural Kogui.",
        "audio_url": null
      }
    ],
    "exercises": [
      {
        "type": "multiple_choice",
        "question": "Uga",
        "options": ["Nube", "Lluvia", "Tormenta", "Niebla"],
        "correct_index": 1,
        "hint": "Cae del cielo y hace crecer las plantas."
      },
      {
        "type": "multiple_choice",
        "question": "Seiku",
        "options": ["Fuego", "Trueno", "Viento", "Luz"],
        "correct_index": 2,
        "hint": "Lo sientes pero no lo puedes ver."
      },
      {
        "type": "match",
        "pairs": [
          { "kogui": "Seiku",      "spanish": "Viento" },
          { "kogui": "Uga",        "spanish": "Lluvia" },
          { "kogui": "Zhigoneshi", "spanish": "Tierra" }
        ],
        "hint": "Zhigoneshi es la palabra más larga — también la más especial."
      },
      {
        "type": "write",
        "prompt": "¿Cómo se dice Viento en Kogui?",
        "answer": "seiku",
        "hint": "Empieza con ''sei''..."
      }
    ]
  }'::jsonb
)
on conflict (module_id, order_index) do nothing;

-- ============================================================
-- Verificación rápida (opcional — ejecutar por separado)
-- ============================================================
-- select m.title as modulo, l.order_index, l.title as leccion, l.xp_reward
-- from public.modules m
-- join public.lessons l on l.module_id = m.id
-- order by m.order_index, l.order_index;
