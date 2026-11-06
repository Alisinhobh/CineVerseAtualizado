// ==========================================
// AVALIAÇÕES DE EXEMPLO (ilustrativas)
// Servem de molde: cada título recebe automaticamente 4 avaliações
// positivas, neutras e negativas, de acordo com a nota do catálogo.
// Para mudar os textos, edite REVIEW_TEMPLATES abaixo.
// {t} = título do filme/série/anime.
// ==========================================

const REVIEW_AUTHORS = [
    { name: "Marina S.",  avatar: "cat" },
    { name: "Lucas P.",   avatar: "wolf" },
    { name: "Camila R.",  avatar: "fox" },
    { name: "Rafael T.",  avatar: "robot" },
    { name: "Beatriz M.", avatar: "panda" },
    { name: "Diego A.",   avatar: "ninja" },
    { name: "Juliana F.", avatar: "octo" },
    { name: "Thiago C.",  avatar: "rocket" },
    { name: "Larissa N.", avatar: "wizard" },
    { name: "Gustavo H.", avatar: "alien" }
];

const REVIEW_WHEN = ["há 2 dias", "há 5 dias", "há 1 semana", "há 2 semanas", "há 3 semanas", "há 1 mês", "há 2 meses"];

const REVIEW_TEMPLATES = {
    pos: [
        "Simplesmente incrível! {t} me prendeu do início ao fim.",
        "Roteiro bem construído e personagens marcantes. Já quero rever.",
        "Uma das melhores coisas que vi este ano. Recomendo demais!",
        "Direção, trilha e atuações impecáveis. Vale cada minuto.",
        "{t} superou minhas expectativas. Nota máxima!",
        "Daqueles que ficam na cabeça depois que acabam. Obra-prima."
    ],
    mixed: [
        "Bom, mas esperava um pouco mais. Tem ótimos momentos, só o ritmo oscila.",
        "Gostei da proposta de {t}, só que o final não me convenceu totalmente.",
        "Tem qualidades, mas não é para todo mundo. Vale ver com a mente aberta."
    ],
    neg: [
        "Não consegui me envolver com {t}. Achei arrastado e previsível.",
        "Muito hype para pouco resultado. Esperava bem mais.",
        "Personagens rasos e roteiro com buracos. Não repetiria.",
        "Cansativo em vários trechos, definitivamente não é para mim."
    ]
};

function sampleReviews(item) {
    const r = item.rating;
    const plan =
        r >= 8.2 ? ["pos", "pos", "mixed", "pos"] :
        r >= 7.6 ? ["pos", "neg", "pos", "mixed"] :
                   ["neg", "pos", "mixed", "neg"];
    const used = new Set();

    return plan.map((kind, k) => {
        const pool = REVIEW_TEMPLATES[kind];
        let t = (item.id * 7 + k * 3) % pool.length;
        while (used.has(kind + t)) t = (t + 1) % pool.length;
        used.add(kind + t);

        const stars = kind === "pos" ? 4 + ((item.id + k) % 2)
                    : kind === "mixed" ? 3
                    : 1 + ((item.id + k) % 2);
        const author = REVIEW_AUTHORS[(item.id * 5 + k * 3) % REVIEW_AUTHORS.length];

        return {
            name: author.name,
            avatarId: author.avatar,
            stars,
            text: pool[t].replace("{t}", item.title),
            when: REVIEW_WHEN[(item.id + k * 2) % REVIEW_WHEN.length],
            mine: false
        };
    });
}
