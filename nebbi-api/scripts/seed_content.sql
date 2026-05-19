-- ============================================================
-- Nebbi API — Seed de contenido base para Neon
-- Ejecutar después de crear el esquema.
-- ============================================================

begin;

insert into public.modules (id, title, order_index, description)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Naturaleza y territorio',
    1,
    'Vocabulario inicial sobre elementos de la naturaleza en lengua Kogui.'
  )
on conflict (order_index) do update
set title = excluded.title,
    description = excluded.description;

insert into public.lessons (id, module_id, title, order_index, xp_reward, content)
values
  (
    '22222222-2222-2222-2222-222222222221',
    '11111111-1111-1111-1111-111111111111',
    'El sol, el agua y la montaña',
    1,
    30,
    '{
      "vocab": [
        {"word": "Zaku", "translation": "Sol"},
        {"word": "Nyui", "translation": "Agua"},
        {"word": "Teyuna", "translation": "Montaña"}
      ],
      "exercises": [
        {
          "type": "multiple_choice",
          "prompt": "¿Cómo se dice ''sol'' en kogui?",
          "options": ["Zaku", "Kai", "Seiku"],
          "answer": "Zaku"
        },
        {
          "type": "match",
          "prompt": "Relaciona cada palabra con su significado.",
          "pairs": [
            {"left": "Nyui", "right": "Agua"},
            {"left": "Teyuna", "right": "Montaña"}
          ]
        }
      ]
    }'::json
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'El árbol, el río y la piedra',
    2,
    30,
    '{
      "vocab": [
        {"word": "Kai", "translation": "Árbol"},
        {"word": "Duina", "translation": "Río"},
        {"word": "Kaku", "translation": "Piedra"}
      ],
      "exercises": [
        {
          "type": "multiple_choice",
          "prompt": "¿Qué palabra significa ''río''?",
          "options": ["Uga", "Duina", "Zhigoneshi"],
          "answer": "Duina"
        },
        {
          "type": "fill_blank",
          "prompt": "Completa: ''___'' significa piedra.",
          "answer": "Kaku"
        }
      ]
    }'::json
  ),
  (
    '22222222-2222-2222-2222-222222222223',
    '11111111-1111-1111-1111-111111111111',
    'El viento, la lluvia y la tierra',
    3,
    30,
    '{
      "vocab": [
        {"word": "Seiku", "translation": "Viento"},
        {"word": "Uga", "translation": "Lluvia"},
        {"word": "Zhigoneshi", "translation": "Tierra"}
      ],
      "exercises": [
        {
          "type": "multiple_choice",
          "prompt": "¿Cómo se dice ''tierra'' en kogui?",
          "options": ["Zhigoneshi", "Nyui", "Kai"],
          "answer": "Zhigoneshi"
        },
        {
          "type": "true_false",
          "prompt": "''Seiku'' significa viento.",
          "answer": true
        }
      ]
    }'::json
  )
on conflict (module_id, order_index) do update
set title = excluded.title,
    xp_reward = excluded.xp_reward,
    content = excluded.content;

commit;
