// Catálogo do CineVerse.
// 'query' = nome original usado para buscar o pôster oficial.
// Quer fixar um pôster manualmente? Adicione  poster: "URL_DA_IMAGEM"  em qualquer título.
const titles = [
  {
    "id": 1,
    "title": "Interestelar",
    "category": "Filme",
    "year": 2014,
    "genre": "Ficção científica",
    "rating": 8.7,
    "description": "Uma equipe parte em uma jornada espacial em busca de um futuro para a humanidade.",
    "query": "Interstellar"
  },
  {
    "id": 2,
    "title": "A Origem",
    "category": "Filme",
    "year": 2010,
    "genre": "Ação / Ficção",
    "rating": 8.8,
    "description": "Um especialista em sonhos recebe uma missão que desafia os limites entre realidade e imaginação.",
    "query": "Inception"
  },
  {
    "id": 3,
    "title": "O Batman",
    "category": "Filme",
    "year": 2022,
    "genre": "Ação / Crime",
    "rating": 7.8,
    "description": "Um vigilante investiga uma série de crimes que abala Gotham City.",
    "query": "The Batman"
  },
  {
    "id": 4,
    "title": "Duna",
    "category": "Filme",
    "year": 2021,
    "genre": "Ficção científica",
    "rating": 8.0,
    "description": "Em um planeta desértico, uma família se vê no centro de uma disputa pelo futuro.",
    "query": "Dune"
  },
  {
    "id": 5,
    "title": "Duna: Parte Dois",
    "category": "Filme",
    "year": 2024,
    "genre": "Aventura / Ficção",
    "rating": 8.5,
    "description": "Uma jornada de alianças e escolhas muda o destino de um planeta.",
    "query": "Dune: Part Two"
  },
  {
    "id": 6,
    "title": "Homem-Aranha: Através do Aranhaverso",
    "category": "Filme",
    "year": 2023,
    "genre": "Animação / Ação",
    "rating": 8.6,
    "description": "Miles Morales atravessa universos e encontra versões inesperadas de heróis.",
    "query": "Spider-Man: Across the Spider-Verse"
  },
  {
    "id": 7,
    "title": "Divertida Mente 2",
    "category": "Filme",
    "year": 2024,
    "genre": "Animação / Família",
    "rating": 7.6,
    "description": "Novas emoções chegam para transformar a vida de Riley.",
    "query": "Inside Out 2"
  },
  {
    "id": 8,
    "title": "Oppenheimer",
    "category": "Filme",
    "year": 2023,
    "genre": "Drama / História",
    "rating": 8.3,
    "description": "A história de um cientista diante de uma descoberta que mudou o mundo.",
    "query": "Oppenheimer"
  },
  {
    "id": 9,
    "title": "Barbie",
    "category": "Filme",
    "year": 2023,
    "genre": "Comédia / Fantasia",
    "rating": 7.0,
    "description": "Uma aventura colorida sobre identidade, amizade e autodescoberta.",
    "query": "Barbie"
  },
  {
    "id": 10,
    "title": "Top Gun: Maverick",
    "category": "Filme",
    "year": 2022,
    "genre": "Ação / Drama",
    "rating": 8.2,
    "description": "Um piloto experiente retorna para treinar uma nova geração.",
    "query": "Top Gun: Maverick"
  },
  {
    "id": 11,
    "title": "Tudo em Todo o Lugar ao Mesmo Tempo",
    "category": "Filme",
    "year": 2022,
    "genre": "Aventura / Ficção",
    "rating": 7.8,
    "description": "Uma mulher comum descobre conexões surpreendentes entre diferentes realidades.",
    "query": "Everything Everywhere All at Once"
  },
  {
    "id": 12,
    "title": "O Grande Hotel Budapeste",
    "category": "Filme",
    "year": 2014,
    "genre": "Comédia / Aventura",
    "rating": 8.1,
    "description": "Um concierge e seu jovem aprendiz vivem uma aventura cheia de reviravoltas.",
    "query": "The Grand Budapest Hotel"
  },
  {
    "id": 13,
    "title": "Parasita",
    "category": "Filme",
    "year": 2019,
    "genre": "Suspense / Drama",
    "rating": 8.5,
    "description": "Duas famílias de realidades muito diferentes têm seus caminhos entrelaçados.",
    "query": "Parasite"
  },
  {
    "id": 14,
    "title": "Whiplash",
    "category": "Filme",
    "year": 2014,
    "genre": "Drama / Música",
    "rating": 8.5,
    "description": "Um jovem baterista enfrenta desafios intensos em busca da excelência musical.",
    "query": "Whiplash"
  },
  {
    "id": 15,
    "title": "La La Land",
    "category": "Filme",
    "year": 2016,
    "genre": "Romance / Musical",
    "rating": 8.0,
    "description": "Dois artistas tentam equilibrar sonhos, amor e carreira em Los Angeles.",
    "query": "La La Land"
  },
  {
    "id": 16,
    "title": "Jurassic Park",
    "category": "Filme",
    "year": 1993,
    "genre": "Aventura / Ficção",
    "rating": 8.2,
    "description": "Uma visita a um parque extraordinário toma um rumo inesperado.",
    "query": "Jurassic Park"
  },
  {
    "id": 17,
    "title": "De Volta para o Futuro",
    "category": "Filme",
    "year": 1985,
    "genre": "Aventura / Ficção",
    "rating": 8.5,
    "description": "Uma viagem no tempo provoca mudanças surpreendentes no passado.",
    "query": "Back to the Future"
  },
  {
    "id": 18,
    "title": "Gladiador",
    "category": "Filme",
    "year": 2000,
    "genre": "Ação / Drama",
    "rating": 8.5,
    "description": "Um general luta para recuperar sua honra em uma Roma cheia de intrigas.",
    "query": "Gladiator"
  },
  {
    "id": 19,
    "title": "Mad Max: Estrada da Fúria",
    "category": "Filme",
    "year": 2015,
    "genre": "Ação / Aventura",
    "rating": 8.1,
    "description": "Uma fuga eletrizante atravessa um deserto pós-apocalíptico.",
    "query": "Mad Max: Fury Road"
  },
  {
    "id": 20,
    "title": "O Senhor dos Anéis: A Sociedade do Anel",
    "category": "Filme",
    "year": 2001,
    "genre": "Fantasia / Aventura",
    "rating": 8.8,
    "description": "Uma jornada começa para proteger um objeto de poder extraordinário.",
    "query": "The Lord of the Rings: The Fellowship of the Ring"
  },
  {
    "id": 21,
    "title": "O Senhor dos Anéis: As Duas Torres",
    "category": "Filme",
    "year": 2002,
    "genre": "Fantasia / Aventura",
    "rating": 8.8,
    "description": "A jornada se divide enquanto diferentes grupos enfrentam grandes desafios.",
    "query": "The Lord of the Rings: The Two Towers"
  },
  {
    "id": 22,
    "title": "O Senhor dos Anéis: O Retorno do Rei",
    "category": "Filme",
    "year": 2003,
    "genre": "Fantasia / Aventura",
    "rating": 9.0,
    "description": "O destino da Terra-média é decidido em uma batalha decisiva.",
    "query": "The Lord of the Rings: The Return of the King"
  },
  {
    "id": 23,
    "title": "Harry Potter e a Pedra Filosofal",
    "category": "Filme",
    "year": 2001,
    "genre": "Fantasia / Aventura",
    "rating": 7.6,
    "description": "Um jovem descobre um mundo mágico e inicia seus estudos em Hogwarts.",
    "query": "Harry Potter and the Sorcerer's Stone"
  },
  {
    "id": 24,
    "title": "Harry Potter e o Prisioneiro de Azkaban",
    "category": "Filme",
    "year": 2004,
    "genre": "Fantasia / Mistério",
    "rating": 7.9,
    "description": "Um novo ano em Hogwarts traz segredos sobre o passado.",
    "query": "Harry Potter and the Prisoner of Azkaban"
  },
  {
    "id": 25,
    "title": "Pantera Negra",
    "category": "Filme",
    "year": 2018,
    "genre": "Ação / Aventura",
    "rating": 7.3,
    "description": "Um novo rei precisa proteger seu reino e decidir seu futuro.",
    "query": "Black Panther"
  },
  {
    "id": 26,
    "title": "Guardiões da Galáxia",
    "category": "Filme",
    "year": 2014,
    "genre": "Ação / Comédia",
    "rating": 8.0,
    "description": "Um grupo improvável se une para proteger a galáxia.",
    "query": "Guardians of the Galaxy"
  },
  {
    "id": 27,
    "title": "Vingadores: Ultimato",
    "category": "Filme",
    "year": 2019,
    "genre": "Ação / Ficção",
    "rating": 8.4,
    "description": "Heróis se reúnem para tentar reverter uma grande perda.",
    "query": "Avengers: Endgame"
  },
  {
    "id": 28,
    "title": "Ratatouille",
    "category": "Filme",
    "year": 2007,
    "genre": "Animação / Comédia",
    "rating": 8.1,
    "description": "Um pequeno cozinheiro prova que talento pode surgir nos lugares mais inesperados.",
    "query": "Ratatouille"
  },
  {
    "id": 29,
    "title": "Procurando Nemo",
    "category": "Filme",
    "year": 2003,
    "genre": "Animação / Aventura",
    "rating": 8.2,
    "description": "Um peixe atravessa o oceano para encontrar seu filho.",
    "query": "Finding Nemo"
  },
  {
    "id": 30,
    "title": "Como Treinar o Seu Dragão",
    "category": "Filme",
    "year": 2010,
    "genre": "Animação / Fantasia",
    "rating": 8.1,
    "description": "Um jovem viking cria uma amizade improvável com um dragão.",
    "query": "How to Train Your Dragon"
  },
  {
    "id": 31,
    "title": "Stranger Things",
    "category": "Série",
    "year": 2016,
    "genre": "Mistério / Drama",
    "rating": 8.7,
    "description": "O desaparecimento de um garoto revela acontecimentos inexplicáveis em uma pequena cidade.",
    "query": "Stranger Things"
  },
  {
    "id": 32,
    "title": "The Last of Us",
    "category": "Série",
    "year": 2023,
    "genre": "Drama / Aventura",
    "rating": 8.6,
    "description": "Duas pessoas atravessam um mundo transformado por uma pandemia.",
    "query": "The Last of Us"
  },
  {
    "id": 33,
    "title": "Wandinha",
    "category": "Série",
    "year": 2022,
    "genre": "Comédia / Mistério",
    "rating": 8.0,
    "description": "Uma estudante investiga mistérios em uma escola cheia de alunos peculiares.",
    "query": "Wednesday"
  },
  {
    "id": 34,
    "title": "Breaking Bad",
    "category": "Série",
    "year": 2008,
    "genre": "Drama / Crime",
    "rating": 9.5,
    "description": "Um professor toma decisões que transformam completamente sua vida.",
    "query": "Breaking Bad"
  },
  {
    "id": 35,
    "title": "Better Call Saul",
    "category": "Série",
    "year": 2015,
    "genre": "Drama / Crime",
    "rating": 9.0,
    "description": "Um advogado tenta construir sua carreira em meio a escolhas difíceis.",
    "query": "Better Call Saul"
  },
  {
    "id": 36,
    "title": "The Office",
    "category": "Série",
    "year": 2005,
    "genre": "Comédia",
    "rating": 9.0,
    "description": "O cotidiano de um escritório vira uma sequência de situações inusitadas.",
    "query": "The Office"
  },
  {
    "id": 37,
    "title": "Brooklyn Nine-Nine",
    "category": "Série",
    "year": 2013,
    "genre": "Comédia / Policial",
    "rating": 8.4,
    "description": "Uma equipe de detetives resolve casos enquanto enfrenta confusões diárias.",
    "query": "Brooklyn Nine-Nine"
  },
  {
    "id": 38,
    "title": "The Bear",
    "category": "Série",
    "year": 2022,
    "genre": "Drama / Comédia",
    "rating": 8.5,
    "description": "Um chef retorna para administrar o restaurante da família.",
    "query": "The Bear"
  },
  {
    "id": 39,
    "title": "Sherlock",
    "category": "Série",
    "year": 2010,
    "genre": "Mistério / Crime",
    "rating": 9.1,
    "description": "Um detetive brilhante resolve casos complexos na Londres contemporânea.",
    "query": "Sherlock"
  },
  {
    "id": 40,
    "title": "Dark",
    "category": "Série",
    "year": 2017,
    "genre": "Ficção / Mistério",
    "rating": 8.7,
    "description": "O desaparecimento de crianças revela conexões entre famílias e gerações.",
    "query": "Dark"
  },
  {
    "id": 41,
    "title": "Black Mirror",
    "category": "Série",
    "year": 2011,
    "genre": "Ficção científica",
    "rating": 8.7,
    "description": "Histórias independentes exploram relações entre tecnologia e sociedade.",
    "query": "Black Mirror"
  },
  {
    "id": 42,
    "title": "The Crown",
    "category": "Série",
    "year": 2016,
    "genre": "Drama / História",
    "rating": 8.6,
    "description": "Uma série acompanha acontecimentos e relações da família real britânica.",
    "query": "The Crown"
  },
  {
    "id": 43,
    "title": "Round 6",
    "category": "Série",
    "year": 2021,
    "genre": "Drama / Suspense",
    "rating": 7.9,
    "description": "Participantes enfrentam desafios extremos em uma competição misteriosa.",
    "query": "Squid Game"
  },
  {
    "id": 44,
    "title": "Arcane",
    "category": "Série",
    "year": 2021,
    "genre": "Animação / Fantasia",
    "rating": 9.0,
    "description": "Duas irmãs seguem caminhos diferentes em cidades divididas por conflitos.",
    "query": "Arcane"
  },
  {
    "id": 45,
    "title": "Chernobyl",
    "category": "Série",
    "year": 2019,
    "genre": "Drama / História",
    "rating": 9.3,
    "description": "Uma minissérie retrata os acontecimentos de um desastre nuclear.",
    "query": "Chernobyl"
  },
  {
    "id": 46,
    "title": "The Mandalorian",
    "category": "Série",
    "year": 2019,
    "genre": "Aventura / Ficção",
    "rating": 8.6,
    "description": "Um caçador de recompensas percorre a galáxia em uma missão inesperada.",
    "query": "The Mandalorian"
  },
  {
    "id": 47,
    "title": "Anne with an E",
    "category": "Série",
    "year": 2017,
    "genre": "Drama",
    "rating": 8.6,
    "description": "Uma jovem imaginativa encontra um novo lar e novas possibilidades.",
    "query": "Anne with an E"
  },
  {
    "id": 48,
    "title": "Peaky Blinders",
    "category": "Série",
    "year": 2013,
    "genre": "Drama / Crime",
    "rating": 8.8,
    "description": "Uma família tenta ampliar sua influência na Inglaterra do pós-guerra.",
    "query": "Peaky Blinders"
  },
  {
    "id": 49,
    "title": "House",
    "category": "Série",
    "year": 2004,
    "genre": "Drama / Mistério",
    "rating": 8.7,
    "description": "Um médico brilhante resolve casos difíceis com métodos pouco convencionais.",
    "query": "House"
  },
  {
    "id": 50,
    "title": "Modern Family",
    "category": "Série",
    "year": 2009,
    "genre": "Comédia",
    "rating": 8.5,
    "description": "Três famílias mostram, de forma divertida, os desafios da vida cotidiana.",
    "query": "Modern Family"
  },
  {
    "id": 51,
    "title": "One Piece",
    "category": "Série",
    "year": 2023,
    "genre": "Aventura / Fantasia",
    "rating": 8.3,
    "description": "Um jovem pirata reúne uma tripulação em busca de um tesouro lendário.",
    "query": "One Piece"
  },
  {
    "id": 52,
    "title": "Demon Slayer",
    "category": "Anime",
    "year": 2019,
    "genre": "Ação / Fantasia",
    "rating": 8.6,
    "description": "Um jovem parte em uma jornada para proteger sua família e ajudar sua irmã.",
    "query": "Kimetsu no Yaiba"
  },
  {
    "id": 53,
    "title": "Your Name",
    "category": "Anime",
    "year": 2016,
    "genre": "Romance / Fantasia",
    "rating": 8.4,
    "description": "Dois jovens começam a trocar de corpos e tentam compreender essa conexão.",
    "query": "Kimi no Na wa."
  },
  {
    "id": 54,
    "title": "Attack on Titan",
    "category": "Anime",
    "year": 2013,
    "genre": "Ação / Drama",
    "rating": 9.1,
    "description": "A humanidade luta para sobreviver atrás de enormes muralhas.",
    "query": "Shingeki no Kyojin"
  },
  {
    "id": 55,
    "title": "Jujutsu Kaisen",
    "category": "Anime",
    "year": 2020,
    "genre": "Ação / Sobrenatural",
    "rating": 8.5,
    "description": "Um estudante entra em um mundo de maldições e feiticeiros.",
    "query": "Jujutsu Kaisen"
  },
  {
    "id": 56,
    "title": "One Piece (Anime)",
    "category": "Anime",
    "year": 1999,
    "genre": "Aventura / Fantasia",
    "rating": 9.0,
    "description": "Uma tripulação navega por mares perigosos em busca de um sonho.",
    "query": "One Piece"
  },
  {
    "id": 57,
    "title": "Naruto",
    "category": "Anime",
    "year": 2002,
    "genre": "Ação / Aventura",
    "rating": 8.4,
    "description": "Um jovem ninja busca reconhecimento e sonha em liderar sua vila.",
    "query": "Naruto"
  },
  {
    "id": 58,
    "title": "Naruto Shippuden",
    "category": "Anime",
    "year": 2007,
    "genre": "Ação / Aventura",
    "rating": 8.7,
    "description": "Naruto retorna mais experiente e enfrenta desafios ainda maiores.",
    "query": "Naruto: Shippuuden"
  },
  {
    "id": 59,
    "title": "Fullmetal Alchemist: Brotherhood",
    "category": "Anime",
    "year": 2009,
    "genre": "Aventura / Fantasia",
    "rating": 9.1,
    "description": "Dois irmãos procuram recuperar o que perderam por meio da alquimia.",
    "query": "Fullmetal Alchemist: Brotherhood"
  },
  {
    "id": 60,
    "title": "Death Note",
    "category": "Anime",
    "year": 2006,
    "genre": "Suspense / Mistério",
    "rating": 8.9,
    "description": "Um estudante encontra um caderno com um poder extraordinário.",
    "query": "Death Note"
  },
  {
    "id": 61,
    "title": "Spy x Family",
    "category": "Anime",
    "year": 2022,
    "genre": "Comédia / Ação",
    "rating": 8.3,
    "description": "Uma família incomum tenta manter suas identidades em segredo.",
    "query": "Spy x Family"
  },
  {
    "id": 62,
    "title": "Haikyuu!!",
    "category": "Anime",
    "year": 2014,
    "genre": "Esporte / Comédia",
    "rating": 8.7,
    "description": "Um jovem apaixonado por vôlei busca melhorar e competir em alto nível.",
    "query": "Haikyuu!!"
  },
  {
    "id": 63,
    "title": "My Hero Academia",
    "category": "Anime",
    "year": 2016,
    "genre": "Ação / Fantasia",
    "rating": 8.2,
    "description": "Um garoto sonha em se tornar herói em um mundo de superpoderes.",
    "query": "Boku no Hero Academia"
  },
  {
    "id": 64,
    "title": "Chainsaw Man",
    "category": "Anime",
    "year": 2022,
    "genre": "Ação / Fantasia",
    "rating": 8.4,
    "description": "Um jovem passa a trabalhar em missões envolvendo criaturas perigosas.",
    "query": "Chainsaw Man"
  },
  {
    "id": 65,
    "title": "Blue Lock",
    "category": "Anime",
    "year": 2022,
    "genre": "Esporte / Drama",
    "rating": 8.1,
    "description": "Jogadores disputam uma oportunidade única no futebol.",
    "query": "Blue Lock"
  },
  {
    "id": 66,
    "title": "Violet Evergarden",
    "category": "Anime",
    "year": 2018,
    "genre": "Drama / Fantasia",
    "rating": 8.5,
    "description": "Uma jovem aprende a compreender sentimentos por meio de cartas.",
    "query": "Violet Evergarden"
  },
  {
    "id": 67,
    "title": "Frieren e a Jornada para o Além",
    "category": "Anime",
    "year": 2023,
    "genre": "Fantasia / Aventura",
    "rating": 9.0,
    "description": "Uma maga elfa reflete sobre o tempo e as relações após uma grande aventura.",
    "query": "Sousou no Frieren"
  },
  {
    "id": 68,
    "title": "Mob Psycho 100",
    "category": "Anime",
    "year": 2016,
    "genre": "Comédia / Sobrenatural",
    "rating": 8.6,
    "description": "Um jovem com poderes extraordinários tenta levar uma vida equilibrada.",
    "query": "Mob Psycho 100"
  },
  {
    "id": 69,
    "title": "Hunter x Hunter",
    "category": "Anime",
    "year": 2011,
    "genre": "Aventura / Fantasia",
    "rating": 9.0,
    "description": "Um garoto parte em uma jornada para encontrar seu pai e se tornar um Hunter.",
    "query": "Hunter x Hunter (2011)"
  },
  {
    "id": 70,
    "title": "Cowboy Bebop",
    "category": "Anime",
    "year": 1998,
    "genre": "Ficção científica",
    "rating": 8.9,
    "description": "Caçadores de recompensas viajam pelo espaço em busca de novos trabalhos.",
    "query": "Cowboy Bebop"
  },
  {
    "id": 71,
    "title": "Sailor Moon",
    "category": "Anime",
    "year": 1992,
    "genre": "Fantasia / Romance",
    "rating": 7.8,
    "description": "Uma estudante descobre poderes e assume a missão de proteger o mundo.",
    "query": "Bishoujo Senshi Sailor Moon"
  },
  {
    "id": 72,
    "title": "O Castelo Animado",
    "category": "Anime",
    "year": 2004,
    "genre": "Fantasia / Romance",
    "rating": 8.2,
    "description": "Uma jovem encontra um castelo mágico e vive uma aventura inesperada.",
    "query": "Howl no Ugoku Shiro"
  },
  {
    "id": 73,
    "title": "A Viagem de Chihiro",
    "category": "Anime",
    "year": 2001,
    "genre": "Fantasia / Aventura",
    "rating": 8.6,
    "description": "Uma garota entra em um mundo mágico e precisa encontrar o caminho de volta.",
    "query": "Sen to Chihiro no Kamikakushi"
  },
  {
    "id": 74,
    "title": "Akira",
    "category": "Anime",
    "year": 1988,
    "genre": "Ficção científica",
    "rating": 8.0,
    "description": "Uma história futurista acompanha acontecimentos em uma cidade em transformação.",
    "query": "Akira"
  },
  {
    "id": 75,
    "title": "Pokémon",
    "category": "Anime",
    "year": 1997,
    "genre": "Aventura / Família",
    "rating": 7.5,
    "description": "Treinadores viajam para conhecer criaturas e participar de desafios.",
    "query": "Pokemon"
  },
  {
    "id": 76,
    "title": "Dragon Ball Z",
    "category": "Anime",
    "year": 1989,
    "genre": "Ação / Aventura",
    "rating": 8.8,
    "description": "Guerreiros defendem a Terra de ameaças cada vez maiores.",
    "query": "Dragon Ball Z"
  },
  {
    "id": 77,
    "title": "Tokyo Revengers",
    "category": "Anime",
    "year": 2021,
    "genre": "Ação / Drama",
    "rating": 7.8,
    "description": "Um jovem tenta mudar acontecimentos do passado para proteger pessoas importantes.",
    "query": "Tokyo Revengers"
  },
  {
    "id": 78,
    "title": "Dr. Stone",
    "category": "Anime",
    "year": 2019,
    "genre": "Aventura / Ficção",
    "rating": 8.1,
    "description": "A ciência se torna essencial para reconstruir a civilização.",
    "query": "Dr. Stone"
  },
  {
    "id": 79,
    "title": "Kaguya-sama: Love Is War",
    "category": "Anime",
    "year": 2019,
    "genre": "Comédia / Romance",
    "rating": 8.4,
    "description": "Dois estudantes tentam fazer o outro confessar primeiro seus sentimentos.",
    "query": "Kaguya-sama wa Kokurasetai"
  },
  {
    "id": 80,
    "title": "Bocchi the Rock!",
    "category": "Anime",
    "year": 2022,
    "genre": "Comédia / Música",
    "rating": 8.4,
    "description": "Uma guitarrista tímida encontra amigos e começa a tocar em uma banda.",
    "query": "Bocchi the Rock!"
  },
  {
    "id": 81,
    "title": "Solo Leveling",
    "category": "Anime",
    "year": 2024,
    "genre": "Ação / Fantasia",
    "rating": 8.5,
    "description": "Um caçador considerado fraco recebe uma oportunidade incomum de evoluir.",
    "query": "Ore dake Level Up na Ken"
  },
  {
    "id": 82,
    "title": "Blue Period",
    "category": "Anime",
    "year": 2021,
    "genre": "Drama",
    "rating": 7.8,
    "description": "Um estudante descobre a paixão pela arte e decide seguir esse caminho.",
    "query": "Blue Period"
  }
];
