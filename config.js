// ==========================================
// CONFIGURAÇÃO DO CINEVERSE
// ==========================================
// Pôsteres via TMDB (The Movie Database).
// 1) Crie uma conta grátis em https://www.themoviedb.org/signup
// 2) Vá em Configurações > API (https://www.themoviedb.org/settings/api)
// 3) Cole abaixo a "Chave da API (v3 auth)" OU o "Token de Leitura da API (v4)".
//
// Sem chave, o site continua funcionando com as fontes alternativas
// (Jikan, TVmaze e iTunes), mas o TMDB dá resultados bem mais completos.
const CINEVERSE_CONFIG = {
    TMDB_API_KEY: "",        // ex.: "a1b2c3d4e5f6..."  (chave v3, 32 caracteres)
    TMDB_READ_TOKEN: "",     // alternativa: token v4 (começa com "eyJ...")
    TMDB_LANGUAGE: "pt-BR",
    TMDB_IMG_BASE: "https://image.tmdb.org/t/p/w500"
};
