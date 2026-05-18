from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.database import SessionLocal
from app.models import Lesson, Module


MODULE_DATA = {
    "title": "Naturaleza y territorio",
    "order_index": 1,
    "description": "Vocabulario inicial sobre elementos de la naturaleza en lengua Kogui.",
    "lessons": [
        {
            "title": "El sol, el agua y la montaña",
            "order_index": 1,
            "xp_reward": 30,
            "content": {
                "vocab": [
                    {"word": "Zaku", "translation": "Sol"},
                    {"word": "Nyui", "translation": "Agua"},
                    {"word": "Teyuna", "translation": "Montaña"},
                ],
                "exercises": [
                    {
                        "type": "multiple_choice",
                        "prompt": "¿Cómo se dice 'sol' en kogui?",
                        "options": ["Zaku", "Kai", "Seiku"],
                        "answer": "Zaku",
                    },
                    {
                        "type": "match",
                        "prompt": "Relaciona cada palabra con su significado.",
                        "pairs": [
                            {"left": "Nyui", "right": "Agua"},
                            {"left": "Teyuna", "right": "Montaña"},
                        ],
                    },
                ],
            },
        },
        {
            "title": "El árbol, el río y la piedra",
            "order_index": 2,
            "xp_reward": 30,
            "content": {
                "vocab": [
                    {"word": "Kai", "translation": "Árbol"},
                    {"word": "Duina", "translation": "Río"},
                    {"word": "Kaku", "translation": "Piedra"},
                ],
                "exercises": [
                    {
                        "type": "multiple_choice",
                        "prompt": "¿Qué palabra significa 'río'?",
                        "options": ["Uga", "Duina", "Zhigoneshi"],
                        "answer": "Duina",
                    },
                    {
                        "type": "fill_blank",
                        "prompt": "Completa: '___' significa piedra.",
                        "answer": "Kaku",
                    },
                ],
            },
        },
        {
            "title": "El viento, la lluvia y la tierra",
            "order_index": 3,
            "xp_reward": 30,
            "content": {
                "vocab": [
                    {"word": "Seiku", "translation": "Viento"},
                    {"word": "Uga", "translation": "Lluvia"},
                    {"word": "Zhigoneshi", "translation": "Tierra"},
                ],
                "exercises": [
                    {
                        "type": "multiple_choice",
                        "prompt": "¿Cómo se dice 'tierra' en kogui?",
                        "options": ["Zhigoneshi", "Nyui", "Kai"],
                        "answer": "Zhigoneshi",
                    },
                    {
                        "type": "true_false",
                        "prompt": "'Seiku' significa viento.",
                        "answer": True,
                    },
                ],
            },
        },
    ],
}


def upsert_seed() -> None:
    db = SessionLocal()
    try:
        module = db.query(Module).filter(Module.order_index == MODULE_DATA["order_index"]).first()
        if module is None:
            module = Module(
                title=MODULE_DATA["title"],
                order_index=MODULE_DATA["order_index"],
                description=MODULE_DATA["description"],
            )
            db.add(module)
            db.flush()
        else:
            module.title = MODULE_DATA["title"]
            module.description = MODULE_DATA["description"]

        existing_lessons = {
            lesson.order_index: lesson
            for lesson in db.query(Lesson).filter(Lesson.module_id == module.id).all()
        }

        for lesson_data in MODULE_DATA["lessons"]:
            lesson = existing_lessons.get(lesson_data["order_index"])
            if lesson is None:
                lesson = Lesson(module_id=module.id)
                db.add(lesson)

            lesson.title = lesson_data["title"]
            lesson.order_index = lesson_data["order_index"]
            lesson.xp_reward = lesson_data["xp_reward"]
            lesson.content = lesson_data["content"]

        db.commit()
        print("Seed completado: módulo y lecciones base insertados/actualizados.")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    upsert_seed()
