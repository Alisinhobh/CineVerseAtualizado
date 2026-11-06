// ==========================================
// CINEVERSE — SISTEMA E FUNCIONALIDADES
// (o catálogo fica em data.js)
// ==========================================

const $ = (id) => document.getElementById(id);

const grid = $("catalogGrid");
const favoritesContent = $("favoritesContent");
const favCount = $("favCount");
const resultCount = $("resultCount");
const searchInput = $("searchInput");
const emptyState = $("emptyState");
const modal = $("detailModal");
const categorySelect = $("categorySelect");
const sortSelect = $("sortSelect");
const genreChips = $("genreChips");

// Autenticação
const authScreen = $("authScreen");
const appShell = $("appShell");
const authForm = $("authForm");
const authTitle = $("authTitle");
const authSubtitle = $("authSubtitle");
const authNameWrap = $("authNameWrap");
const authName = $("authName");
const authEmail = $("authEmail");
const authPassword = $("authPassword");
const authMessage = $("authMessage");
const authSubmit = $("authSubmit");
const authSwitchText = $("authSwitchText");
const authSwitch = $("authSwitch");
const userAvatar = $("userAvatar");
const userName = $("userName");
const logoutBtn = $("logoutBtn");

let activeCategory = "Todos";
const activeGenres = new Set();   // filtro de gêneros (vários ao mesmo tempo)
let activeUser = null;
let selectedTitle = null;
let isRegisterMode = false;
let favorites = loadFavorites();

const HERO_IDS = [54, 5, 44, 34, 73, 22];
let heroIndex = 0;
let heroTimer = null;

const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const genresOf = (item) => item.genre.split("/").map((g) => g.trim());

// ==========================================
// ARMAZENAMENTO
// ==========================================

function readJSON(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
        return fallback;
    }
}

function loadFavorites() { return readJSON("cineverse-favorites", []); }
function getUsers() { return readJSON("cineverse-users", []); }
function saveUsers(users) { localStorage.setItem("cineverse-users", JSON.stringify(users)); }
function getCurrentUser() { return readJSON("cineverse-session", null); }

// ==========================================
// PÔSTERES ORIGINAIS
// Busca a capa oficial de cada título:
//   Principal -> TMDB (configure a chave em config.js)
//   Reserva   -> Animes: Jikan | Séries: TVmaze | Filmes: iTunes
// Dá para fixar um pôster manualmente com  poster: "URL"  em data.js.
// As URLs ficam salvas no navegador, então só buscam uma vez.
// ==========================================

const POSTER_KEY = "cineverse-posters-v2";
let posterCache = readJSON(POSTER_KEY, {});
const posterPending = new Set();
const posterFailed = new Set();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function makeLimiter(gap) {
    let last = Promise.resolve();
    return (task) => {
        const run = last.then(task);
        last = run.catch(() => {}).then(() => sleep(gap));
        return run;
    };
}

const limitJikan = makeLimiter(450);   // Jikan permite ~3 req/s
const limitTvmaze = makeLimiter(150);
const limitItunes = makeLimiter(150);

async function getJSON(url, retry = true) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 9000);
    try {
        const res = await fetch(url, { signal: ctrl.signal });
        if (res.status === 429 && retry) {
            await sleep(1600);
            return getJSON(url, false);
        }
        if (!res.ok) throw new Error(res.status);
        return await res.json();
    } finally {
        clearTimeout(timer);
    }
}

function jsonp(url) {
    return new Promise((resolve, reject) => {
        const cb = "__cv_" + Math.random().toString(36).slice(2);
        const script = document.createElement("script");
        const done = () => { clearTimeout(timer); delete window[cb]; script.remove(); };
        const timer = setTimeout(() => { done(); reject(new Error("timeout")); }, 9000);
        window[cb] = (data) => { done(); resolve(data); };
        script.onerror = () => { done(); reject(new Error("jsonp")); };
        script.src = `${url}&callback=${cb}`;
        document.head.appendChild(script);
    });
}

const pickByYear = (list, year, getYear) =>
    list.find((x) => Math.abs((getYear(x) || 0) - year) <= 1) || list[0];

async function posterFromJikan(item) {
    const data = await limitJikan(() =>
        getJSON(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(item.query)}&limit=6&sfw=true`)
    );
    const list = (data.data || []).filter((a) => a.images?.jpg?.large_image_url);
    const hit = pickByYear(list, item.year, (a) => a.aired?.prop?.from?.year);
    return hit?.images?.jpg?.large_image_url || null;
}

async function posterFromTvmaze(item) {
    const data = await limitTvmaze(() =>
        getJSON(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(item.query)}`)
    );
    const list = data.map((d) => d.show).filter((s) => s.image);
    const hit = pickByYear(list, item.year, (s) => Number((s.premiered || "").slice(0, 4)));
    return hit?.image?.original || hit?.image?.medium || null;
}

async function posterFromItunes(item) {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(item.query)}&media=movie&entity=movie&limit=8&country=us`;
    const data = await limitItunes(() => jsonp(url));
    const list = (data.results || []).filter((r) => r.artworkUrl100);
    const hit = pickByYear(list, item.year, (r) => new Date(r.releaseDate).getFullYear());
    return hit ? hit.artworkUrl100.replace(/\d+x\d+bb/, "600x900bb") : null;
}


const TMDB = (typeof CINEVERSE_CONFIG !== "undefined" && CINEVERSE_CONFIG) || {};
const tmdbEnabled = Boolean(TMDB.TMDB_API_KEY || TMDB.TMDB_READ_TOKEN);
const limitTmdb = makeLimiter(60);

async function tmdbGet(path, params) {
    const qs = new URLSearchParams({ language: TMDB.TMDB_LANGUAGE || "pt-BR", include_adult: "false", ...params });
    const headers = {};
    if (TMDB.TMDB_READ_TOKEN) headers.Authorization = `Bearer ${TMDB.TMDB_READ_TOKEN}`;
    else qs.set("api_key", TMDB.TMDB_API_KEY);

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 9000);
    try {
        const res = await fetch(`https://api.themoviedb.org/3${path}?${qs}`, { headers, signal: ctrl.signal });
        if (res.status === 429) { await sleep(1500); return tmdbGet(path, params); }
        if (!res.ok) throw new Error(res.status);
        return await res.json();
    } finally {
        clearTimeout(timer);
    }
}

async function posterFromTmdb(item) {
    const isMovie = item.category === "Filme";
    const dateOf = (r) => Number(String(isMovie ? r.release_date : r.first_air_date).slice(0, 4));
    const yearParam = isMovie ? { year: item.year } : { first_air_date_year: item.year };

    // 1ª tentativa com o ano; 2ª sem ele (o ano pode variar de país para país)
    for (const extra of [yearParam, {}]) {
        const data = await limitTmdb(() =>
            tmdbGet(isMovie ? "/search/movie" : "/search/tv", { query: item.query, ...extra })
        );
        const list = (data.results || []).filter((r) => r.poster_path);
        if (!list.length) continue;
        const hit = pickByYear(list, item.year, dateOf);
        return `${TMDB.TMDB_IMG_BASE || "https://image.tmdb.org/t/p/w500"}${hit.poster_path}`;
    }
    return null;
}

async function fetchPoster(item) {
    const fallbacks =
        item.category === "Anime" ? [posterFromJikan, posterFromTvmaze]
        : item.category === "Série" ? [posterFromTvmaze]
        : [posterFromItunes];
    const attempts = tmdbEnabled ? [posterFromTmdb, ...fallbacks] : fallbacks;

    for (const attempt of attempts) {
        try {
            const url = await attempt(item);
            if (url) return url;
        } catch { /* tenta o próximo */ }
    }
    return null;
}

function posterUrl(item) {
    return item.poster || posterCache[item.id] || "";
}

function ensurePoster(item) {
    if (posterUrl(item) || posterPending.has(item.id) || posterFailed.has(item.id)) return;
    posterPending.add(item.id);

    fetchPoster(item).then((url) => {
        posterPending.delete(item.id);
        if (!url) { posterFailed.add(item.id); return; }
        posterCache[item.id] = url;
        try { localStorage.setItem(POSTER_KEY, JSON.stringify(posterCache)); } catch {}
        applyPoster(item.id, url);
    });
}

function applyPoster(id, url) {
    document.querySelectorAll(`[data-poster="${id}"]`).forEach((el) => { if (el.tagName === "IMG") el.src = url; });
    document.querySelectorAll(`[data-poster-bg="${id}"]`).forEach((el) => el.style.setProperty("--poster", `url("${url}")`));
    document.querySelectorAll(`[data-mini="${id}"]`).forEach((el) => (el.style.backgroundImage = `url("${url}")`));
}

// Imagem carregou / falhou
document.addEventListener("load", (e) => {
    if (e.target.classList?.contains("poster-img")) e.target.classList.add("loaded");
}, true);

document.addEventListener("error", (e) => {
    const img = e.target;
    if (!img.classList?.contains("poster-img")) return;
    const id = Number(img.dataset.poster);
    if (!id || !posterCache[id]) return;
    // URL salva quebrou: apaga e tenta de novo na próxima renderização
    delete posterCache[id];
    try { localStorage.setItem(POSTER_KEY, JSON.stringify(posterCache)); } catch {}
    img.removeAttribute("src");
    const item = titles.find((t) => t.id === id);
    if (item) ensurePoster(item);
}, true);

const hueOf = (id) => (id * 47) % 360;

// ==========================================
// LOGIN E CADASTRO
// ==========================================

function showMessage(message, type = "error") {
    authMessage.textContent = message;
    authMessage.className = `auth-message ${type}`;
}

function clearMessage() {
    authMessage.textContent = "";
    authMessage.className = "auth-message";
}

function updateAuthScreen() {
    if (isRegisterMode) {
        authTitle.textContent = "Crie sua conta";
        authSubtitle.textContent = "Entre para explorar o universo CineVerse.";
        authNameWrap.hidden = false;
        authName.required = true;
        authPassword.autocomplete = "new-password";
        authSubmit.textContent = "Criar minha conta";
        authSwitchText.textContent = "Já possui uma conta?";
        authSwitch.textContent = "Entrar";
    } else {
        authTitle.textContent = "Bem-vindo de volta";
        authSubtitle.textContent = "Entre na sua conta para continuar.";
        authNameWrap.hidden = true;
        authName.required = false;
        authPassword.autocomplete = "current-password";
        authSubmit.textContent = "Entrar";
        authSwitchText.textContent = "Ainda não possui uma conta?";
        authSwitch.textContent = "Cadastre-se";
    }
    clearMessage();
}

function showLogin() {
    authScreen.hidden = false;
    appShell.hidden = true;
    isRegisterMode = false;
    stopHero();
    updateAuthScreen();
}

function showApplication(user) {
    authScreen.hidden = true;
    appShell.hidden = false;

    activeUser = user;
    userName.textContent = user.name;
    paintAvatar(userAvatar, getAvatarId(user.id), user.name);

    buildGenreChips();
    renderAll();
    showHero(0, false);
    startHero();
    window.scrollTo(0, 0);
}

authSwitch.addEventListener("click", () => {
    isRegisterMode = !isRegisterMode;
    updateAuthScreen();
});

function startSession(user) {
    localStorage.setItem("cineverse-session", JSON.stringify({ id: user.id, name: user.name, email: user.email }));
    authForm.reset();
    showApplication(user);
}

authForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearMessage();

    const email = authEmail.value.trim().toLowerCase();
    const password = authPassword.value;
    const users = getUsers();

    if (!email || !password) return showMessage("Preencha todos os campos.");
    if (password.length < 6) return showMessage("A senha precisa ter pelo menos 6 caracteres.");

    if (isRegisterMode) {
        const name = authName.value.trim();
        if (!name) return showMessage("Digite seu nome.");
        if (users.some((u) => u.email === email)) return showMessage("Este e-mail já possui uma conta.");

        const newUser = { id: Date.now(), name, email, password };
        users.push(newUser);
        saveUsers(users);
        startSession(newUser);
    } else {
        const user = users.find((u) => u.email === email && u.password === password);
        if (!user) return showMessage("E-mail ou senha incorretos.");
        startSession(user);
    }
});

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("cineverse-session");
    modal.hidden = true;
    avatarModal.hidden = true;
    selectedTitle = null;
    activeUser = null;
    showLogin();
});

// ==========================================
// CARDS E LISTAGENS
// ==========================================

function cardTemplate(item) {
    const saved = favorites.includes(item.id);
    const url = posterUrl(item);
    ensurePoster(item);

    return `
        <article class="movie-card" data-id="${item.id}" tabindex="0" aria-label="Ver detalhes de ${esc(item.title)}">
            <div class="poster" style="--h:${hueOf(item.id)}">
                <div class="poster-fallback"><span>${esc(item.title)}</span></div>
                <img class="poster-img" data-poster="${item.id}" ${url ? `src="${esc(url)}"` : ""} alt="Pôster de ${esc(item.title)}" loading="lazy">
                <span class="type-tag">${item.category.toUpperCase()}</span>
                <button class="favorite-btn ${saved ? "saved" : ""}" data-favorite="${item.id}" type="button"
                    aria-label="${saved ? "Remover dos" : "Adicionar aos"} favoritos">${saved ? "♥" : "♡"}</button>
            </div>
            <div class="card-info">
                <h3 title="${esc(item.title)}">${esc(item.title)}</h3>
                <div class="card-meta">
                    <span>${item.year} · ${esc(genresOf(item)[0])}</span>
                    <span class="rating">★ ${item.rating.toFixed(1)}</span>
                </div>
            </div>
        </article>`;
}

function visibleTitles() {
    const query = searchInput.value.trim().toLocaleLowerCase("pt-BR");

    const list = titles.filter((item) => {
        const okCategory = activeCategory === "Todos" || item.category === activeCategory;
        const okGenre = [...activeGenres].every((g) => genresOf(item).includes(g));
        const okSearch =
            !query ||
            item.title.toLocaleLowerCase("pt-BR").includes(query) ||
            item.query.toLocaleLowerCase("pt-BR").includes(query) ||
            item.genre.toLocaleLowerCase("pt-BR").includes(query);
        return okCategory && okGenre && okSearch;
    });

    switch (sortSelect.value) {
        case "rating": list.sort((a, b) => b.rating - a.rating); break;
        case "year": list.sort((a, b) => b.year - a.year); break;
        case "title": list.sort((a, b) => a.title.localeCompare(b.title, "pt-BR")); break;
    }
    return list;
}

function renderCatalog() {
    const list = visibleTitles();
    grid.innerHTML = list.map(cardTemplate).join("");
    resultCount.textContent = `${list.length} ${list.length === 1 ? "título encontrado" : "títulos encontrados"}`;
    emptyState.hidden = list.length !== 0;
}

function renderFavorites() {
    const list = titles.filter((item) => favorites.includes(item.id));
    favCount.textContent = favorites.length;
    favoritesContent.innerHTML = list.length
        ? list.map(cardTemplate).join("")
        : '<span class="empty-favorites">♡ Você ainda não adicionou favoritos. Explore o catálogo!</span>';
}

function topRated(n) {
    return [...titles].sort((a, b) => b.rating - a.rating || b.year - a.year).slice(0, n);
}

function renderTopRail() {
    $("topRail").innerHTML = topRated(16).map(cardTemplate).join("");
}

function renderSideTop() {
    $("sideTop").innerHTML = topRated(3).map((item) => {
        ensurePoster(item);
        const url = posterUrl(item);
        return `
            <div class="mini-card" data-id="${item.id}" tabindex="0">
                <div class="mini-bg" data-mini="${item.id}" ${url ? `style="background-image:url('${esc(url)}')"` : ""}></div>
                <div class="mini-text"><strong>${esc(item.title)}</strong><span>★ ${item.rating.toFixed(1)}</span></div>
            </div>`;
    }).join("");
}

function renderAll() {
    renderCatalog();
    renderFavorites();
    renderTopRail();
    renderSideTop();
}

// ==========================================
// FILTROS
// ==========================================

function buildGenreChips() {
    const count = {};
    titles.forEach((t) => genresOf(t).forEach((g) => (count[g] = (count[g] || 0) + 1)));
    const genres = Object.keys(count).sort((a, b) => count[b] - count[a] || a.localeCompare(b, "pt-BR"));

    genreChips.innerHTML = ["Todos", ...genres]
        .map((g) => `<button type="button" class="chip ${(g === "Todos" ? activeGenres.size === 0 : activeGenres.has(g)) ? "active" : ""}" data-genre="${esc(g)}" aria-pressed="${g === "Todos" ? activeGenres.size === 0 : activeGenres.has(g)}">${esc(g)}</button>`)
        .join("");
}

function syncChips() {
    genreChips.querySelectorAll(".chip").forEach((c) => {
        const g = c.dataset.genre;
        const on = g === "Todos" ? activeGenres.size === 0 : activeGenres.has(g);
        c.classList.toggle("active", on);
        c.setAttribute("aria-pressed", on);
    });
}

// Clique num gênero liga/desliga; "Todos" limpa a seleção.
// Com vários gêneros marcados, aparecem só os títulos que têm TODOS eles.
genreChips.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-genre]");
    if (!chip) return;
    const g = chip.dataset.genre;
    if (g === "Todos") activeGenres.clear();
    else if (activeGenres.has(g)) activeGenres.delete(g);
    else activeGenres.add(g);
    syncChips();
    renderCatalog();
});

function setActiveNav(key) {
    document.querySelectorAll(".side-link").forEach((b) => b.classList.toggle("active", b.dataset.nav === key));
}

function setCategory(cat, scroll = false) {
    activeCategory = cat;
    categorySelect.value = cat;
    setActiveNav(cat === "Todos" ? "inicio" : cat);
    renderCatalog();
    if (scroll) $("catalogo").scrollIntoView({ behavior: "smooth" });
}

categorySelect.addEventListener("change", () => setCategory(categorySelect.value, true));
sortSelect.addEventListener("change", renderCatalog);

let searchTimer;
searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(renderCatalog, 120);
});
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") $("catalogo").scrollIntoView({ behavior: "smooth" });
});

// Menu lateral
document.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
        const key = btn.dataset.nav;
        if (key === "inicio") {
            activeGenres.clear();
            searchInput.value = "";
            buildGenreChips();
            setCategory("Todos");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (key === "favoritos" || key === "emalta") {
            setActiveNav(key);
            $(key).scrollIntoView({ behavior: "smooth" });
        } else {
            setCategory(key, true);
        }
    });
});

document.querySelector("[data-nav-link]").addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector('[data-nav="inicio"]').click();
});

// Setas dos carrosséis
document.addEventListener("click", (e) => {
    const arrow = e.target.closest("[data-rail]");
    if (!arrow) return;
    const rail = $(arrow.dataset.rail);
    rail.scrollBy({ left: Number(arrow.dataset.dir) * rail.clientWidth * 0.8, behavior: "smooth" });
});

// ==========================================
// DESTAQUE (CARROSSEL)
// ==========================================

const heroItems = () => HERO_IDS.map((id) => titles.find((t) => t.id === id)).filter(Boolean);

function tagsHTML(item) {
    return `
        <span class="tag gold">★ ${item.rating.toFixed(1)}</span>
        <span class="tag">${item.category}</span>
        <span class="tag">${item.year}</span>
        ${genresOf(item).map((g) => `<span class="tag">${esc(g)}</span>`).join("")}`;
}

function showHero(index, animate = true) {
    const items = heroItems();
    heroIndex = (index + items.length) % items.length;
    const item = items[heroIndex];
    const content = $("heroContent");

    const paint = () => {
        $("heroTags").innerHTML = tagsHTML(item);
        $("heroTitle").textContent = item.title;
        $("heroDesc").textContent = item.description;
        updateHeroFav(item);

        const bg = $("heroBg");
        bg.dataset.posterBg = item.id;
        const url = posterUrl(item);
        if (url) bg.style.setProperty("--poster", `url("${url}")`); else bg.style.removeProperty("--poster");

        const poster = $("heroPoster");
        poster.style.setProperty("--h", hueOf(item.id));
        poster.querySelector(".poster-fallback").innerHTML = `<span>${esc(item.title)}</span>`;
        const img = poster.querySelector("img");
        img.classList.remove("loaded");
        img.dataset.poster = item.id;
        img.alt = `Pôster de ${item.title}`;
        if (url) img.src = url; else img.removeAttribute("src");
        ensurePoster(item);

        $("heroDots").innerHTML = items
            .map((_, i) => `<button type="button" class="${i === heroIndex ? "active" : ""}" data-hero="${i}" aria-label="Destaque ${i + 1}"></button>`)
            .join("");

        content.classList.remove("swap");
    };

    if (animate) {
        content.classList.add("swap");
        setTimeout(paint, 220);
    } else {
        paint();
    }
}

function updateHeroFav(item = heroItems()[heroIndex]) {
    const saved = favorites.includes(item.id);
    const btn = $("heroFav");
    btn.textContent = saved ? "♥" : "♡";
    btn.classList.toggle("saved", saved);
}

function startHero() {
    stopHero();
    heroTimer = setInterval(() => showHero(heroIndex + 1), 8000);
}
function stopHero() { clearInterval(heroTimer); }

$("heroPrev").addEventListener("click", () => { showHero(heroIndex - 1); startHero(); });
$("heroNext").addEventListener("click", () => { showHero(heroIndex + 1); startHero(); });
$("heroDots").addEventListener("click", (e) => {
    const dot = e.target.closest("[data-hero]");
    if (dot) { showHero(Number(dot.dataset.hero)); startHero(); }
});
$("heroDetails").addEventListener("click", () => openDetails(heroItems()[heroIndex].id));
$("heroFav").addEventListener("click", () => toggleFavorite(heroItems()[heroIndex].id));
$("inicio").addEventListener("mouseenter", stopHero);
$("inicio").addEventListener("mouseleave", startHero);

// ==========================================
// FAVORITOS
// ==========================================

function toggleFavorite(id) {
    favorites = favorites.includes(id) ? favorites.filter((i) => i !== id) : [...favorites, id];
    localStorage.setItem("cineverse-favorites", JSON.stringify(favorites));

    renderCatalog();
    renderFavorites();
    renderTopRail();
    updateHeroFav();
    if (selectedTitle && selectedTitle.id === id) updateModalFavorite();
}

// ==========================================
// DETALHES
// ==========================================

function openDetails(id) {
    selectedTitle = titles.find((item) => item.id === id);
    if (!selectedTitle) return;
    const item = selectedTitle;

    $("modalCategory").textContent = item.category.toUpperCase();
    $("modalTitle").textContent = item.title;
    $("modalTags").innerHTML = tagsHTML(item);
    $("modalDescription").textContent = item.description;

    const url = posterUrl(item);
    ensurePoster(item);

    const bg = $("modalBg");
    bg.dataset.posterBg = item.id;
    if (url) bg.style.setProperty("--poster", `url("${url}")`); else bg.style.removeProperty("--poster");

    const poster = $("modalPoster");
    poster.style.setProperty("--h", hueOf(item.id));
    poster.querySelector(".poster-fallback").innerHTML = `<span>${esc(item.title)}</span>`;
    const img = poster.querySelector("img");
    img.classList.remove("loaded");
    img.dataset.poster = item.id;
    img.alt = `Pôster de ${item.title}`;
    if (url) img.src = url; else img.removeAttribute("src");

    updateModalFavorite();
    renderReviews(item);
    modal.hidden = false;
    $("detailModal").querySelector(".detail-modal").scrollTop = 0;
    $("closeModal").focus();
}

function updateModalFavorite() {
    if (!selectedTitle) return;
    $("modalFavorite").textContent = favorites.includes(selectedTitle.id)
        ? "♥ Remover dos favoritos"
        : "♡ Adicionar aos favoritos";
}

function closeModal() {
    modal.hidden = true;
}

// ==========================================
// CLIQUES E TECLADO
// ==========================================

document.addEventListener("click", (event) => {
    const favoriteButton = event.target.closest("[data-favorite]");
    if (favoriteButton) {
        event.stopPropagation();
        toggleFavorite(Number(favoriteButton.dataset.favorite));
        return;
    }
    const card = event.target.closest(".movie-card, .mini-card");
    if (card) openDetails(Number(card.dataset.id));
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { closeModal(); avatarModal.hidden = true; }

    const t = event.target;
    if ((event.key === "Enter" || event.key === " ") && t.matches?.(".movie-card, .mini-card")) {
        event.preventDefault();
        openDetails(Number(t.dataset.id));
    }
});

$("closeModal").addEventListener("click", closeModal);
modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
$("modalFavorite").addEventListener("click", () => { if (selectedTitle) toggleFavorite(selectedTitle.id); });

// ==========================================
// AVATARES
// ==========================================

const AVATARS = [
    { id: "fox",    n: "Raposa",    e: "🦊", bg: "linear-gradient(135deg,#ff9d3d,#ff6b3d)" },
    { id: "panda",  n: "Panda",     e: "🐼", bg: "linear-gradient(135deg,#9aa7ad,#4b5a60)" },
    { id: "cat",    n: "Gato",      e: "🐱", bg: "linear-gradient(135deg,#ffc83d,#ff9d3d)" },
    { id: "wolf",   n: "Lobo",      e: "🐺", bg: "linear-gradient(135deg,#6b7bff,#3b3fa8)" },
    { id: "owl",    n: "Coruja",    e: "🦉", bg: "linear-gradient(135deg,#a7733d,#5c3b1d)" },
    { id: "octo",   n: "Polvo",     e: "🐙", bg: "linear-gradient(135deg,#d46bff,#7a2fb0)" },
    { id: "rocket", n: "Foguete",   e: "🚀", bg: "linear-gradient(135deg,#3dd6ff,#2f6bff)" },
    { id: "alien",  n: "Alien",     e: "👾", bg: "linear-gradient(135deg,#4cf08a,#14935a)" },
    { id: "mask",   n: "Máscaras",  e: "🎭", bg: "linear-gradient(135deg,#ff6b9d,#b02f5f)" },
    { id: "wizard", n: "Mago",      e: "🧙", bg: "linear-gradient(135deg,#7a5cff,#33227f)" },
    { id: "ninja",  n: "Ninja",     e: "🥷", bg: "linear-gradient(135deg,#454f55,#1b2226)" },
    { id: "robot",  n: "Robô",      e: "🤖", bg: "linear-gradient(135deg,#5ee0d0,#2b8f94)" }
];

const AVATAR_KEY = "cineverse-avatars";
const REVIEW_KEY = "cineverse-reviews";

const avatarModal = $("avatarModal");
const avatarGrid = $("avatarGrid");

const getAvatarId = (userId) => readJSON(AVATAR_KEY, {})[userId] || "";

function setAvatarId(userId, avatarId) {
    const all = readJSON(AVATAR_KEY, {});
    if (avatarId) all[userId] = avatarId; else delete all[userId];
    try { localStorage.setItem(AVATAR_KEY, JSON.stringify(all)); } catch {}
}

function paintAvatar(el, avatarId, name) {
    const a = AVATARS.find((x) => x.id === avatarId);
    if (a) {
        el.textContent = a.e;
        el.style.background = a.bg;
        el.classList.add("has-emoji");
    } else {
        el.textContent = (name || "?").trim().charAt(0).toUpperCase() || "?";
        el.style.background = "";
        el.classList.remove("has-emoji");
    }
}

function avatarBadge(avatarId, name) {
    const a = AVATARS.find((x) => x.id === avatarId);
    return a
        ? `<span class="review-avatar" style="background:${a.bg}">${a.e}</span>`
        : `<span class="review-avatar">${esc((name || "?").trim().charAt(0).toUpperCase())}</span>`;
}

function openAvatarPicker() {
    if (!activeUser) return;
    const current = getAvatarId(activeUser.id);
    const letter = activeUser.name.trim().charAt(0).toUpperCase();

    avatarGrid.innerHTML =
        `<button type="button" class="avatar-opt letter ${current ? "" : "active"}" data-avatar="" aria-label="Usar a inicial do nome">${esc(letter)}</button>` +
        AVATARS.map((a) =>
            `<button type="button" class="avatar-opt ${a.id === current ? "active" : ""}" data-avatar="${a.id}" style="background:${a.bg}" aria-label="Avatar ${a.n}" title="${a.n}">${a.e}</button>`
        ).join("");
    avatarModal.hidden = false;
}

userAvatar.addEventListener("click", openAvatarPicker);
$("closeAvatar").addEventListener("click", () => { avatarModal.hidden = true; });
avatarModal.addEventListener("click", (e) => { if (e.target === avatarModal) avatarModal.hidden = true; });

avatarGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-avatar]");
    if (!btn || !activeUser) return;
    setAvatarId(activeUser.id, btn.dataset.avatar);
    paintAvatar(userAvatar, btn.dataset.avatar, activeUser.name);
    avatarModal.hidden = true;
    if (!modal.hidden && selectedTitle) renderReviews(selectedTitle);
});

// ==========================================
// AVALIAÇÕES
// ==========================================

const starInput = $("starInput");
const reviewText = $("reviewText");
const reviewSubmit = $("reviewSubmit");
const reviewRemove = $("reviewRemove");
const reviewMsg = $("reviewMsg");
let draftStars = 0;

starInput.innerHTML = [1, 2, 3, 4, 5]
    .map((n) => `<button type="button" role="radio" data-star="${n}" aria-label="${n} ${n === 1 ? "estrela" : "estrelas"}">★</button>`)
    .join("");

function paintStars(n) {
    starInput.querySelectorAll("[data-star]").forEach((b) => {
        const on = Number(b.dataset.star) <= n;
        b.classList.toggle("on", on);
        b.setAttribute("aria-checked", Number(b.dataset.star) === draftStars);
    });
}

starInput.addEventListener("mouseover", (e) => {
    const b = e.target.closest("[data-star]");
    if (b) paintStars(Number(b.dataset.star));
});
starInput.addEventListener("mouseleave", () => paintStars(draftStars));
starInput.addEventListener("click", (e) => {
    const b = e.target.closest("[data-star]");
    if (!b) return;
    draftStars = Number(b.dataset.star);
    paintStars(draftStars);
});

function userReviews() {
    return activeUser ? (readJSON(REVIEW_KEY, {})[activeUser.id] || {}) : {};
}

function writeUserReview(titleId, data) {
    const all = readJSON(REVIEW_KEY, {});
    const mine = all[activeUser.id] || {};
    if (data) mine[titleId] = data; else delete mine[titleId];
    all[activeUser.id] = mine;
    try { localStorage.setItem(REVIEW_KEY, JSON.stringify(all)); } catch {}
}

function setReviewMsg(text, type) {
    reviewMsg.textContent = text;
    reviewMsg.className = `review-msg ${type || ""}`;
}

const starsText = (n) => "★".repeat(n) + "☆".repeat(5 - n);

function renderReviews(item) {
    const mine = userReviews()[item.id] || null;
    draftStars = mine ? mine.stars : 0;
    reviewText.value = mine ? mine.text : "";
    paintStars(draftStars);
    reviewSubmit.textContent = mine ? "Atualizar avaliação" : "Publicar avaliação";
    reviewRemove.hidden = !mine;
    setReviewMsg("", "");

    const list = [];
    if (mine) {
        list.push({
            name: activeUser.name, avatarId: getAvatarId(activeUser.id),
            stars: mine.stars, text: mine.text,
            when: new Date(mine.date).toLocaleDateString("pt-BR"), mine: true
        });
    }
    list.push(...sampleReviews(item));

    const avg = list.reduce((sum, r) => sum + r.stars, 0) / list.length;
    $("reviewsSummary").textContent = `★ ${avg.toFixed(1)} · ${list.length} avaliações`;

    $("reviewList").innerHTML = list.map((r) => `
        <article class="review ${r.mine ? "mine" : ""}">
            ${avatarBadge(r.avatarId, r.name)}
            <div class="review-body">
                <header>
                    <strong>${esc(r.name)}</strong>
                    ${r.mine ? '<span class="review-badge">Você</span>' : ""}
                    <span class="stars" aria-label="${r.stars} de 5 estrelas">${starsText(r.stars)}</span>
                    <time>${esc(r.when)}</time>
                </header>
                ${r.text ? `<p>${esc(r.text)}</p>` : ""}
            </div>
        </article>`).join("");
}

reviewSubmit.addEventListener("click", () => {
    if (!selectedTitle || !activeUser) return;
    if (!draftStars) return setReviewMsg("Escolha uma nota de 1 a 5 estrelas.", "error");
    writeUserReview(selectedTitle.id, { stars: draftStars, text: reviewText.value.trim(), date: Date.now() });
    renderReviews(selectedTitle);
    setReviewMsg("Avaliação salva!", "ok");
});

reviewRemove.addEventListener("click", () => {
    if (!selectedTitle || !activeUser) return;
    writeUserReview(selectedTitle.id, null);
    renderReviews(selectedTitle);
    setReviewMsg("Avaliação removida.", "ok");
});

// ==========================================
// INICIALIZAÇÃO
// ==========================================

const currentUser = getCurrentUser();
if (currentUser) showApplication(currentUser); else showLogin();
