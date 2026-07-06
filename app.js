const $ = (selector) => document.querySelector(selector);

async function getJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

function nav() {
  return `
    <nav class="bottom-nav" aria-label="bottom navigation">
      <div class="nav-icon"><svg viewBox="0 0 24 24"><path d="M3 6l5-2 5 2 8-2v14l-8 2-5-2-5 2z"/><path d="M8 4v14"/><path d="M13 6v14"/></svg></div>
      <div class="nav-icon"><svg viewBox="0 0 24 24"><path d="M4 10v4"/><path d="M8 6v12"/><path d="M12 3v18"/><path d="M16 7v10"/><path d="M20 10v4"/></svg></div>
      <div class="nav-icon"><svg viewBox="0 0 24 24"><path d="M12 8a4 4 0 100 8 4 4 0 000-8z"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"/></svg></div>
    </nav>`;
}

function barcode() { return `<div class="barcode"></div>`; }
function imageTag(src, alt) { return `<img src="${src}" alt="${alt}">`; }

function miniCard(species) {
  return `
    <article class="mini-card">
      <div class="mini-img">${imageTag(species.image, species.name)}</div>
      <div class="mini-title">${species.name}</div>
      ${barcode()}
    </article>`;
}

function wave() {
  return `<div class="wave-large" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>`;
}

function header(field) {
  return `
    <div class="header-row">
      <div><h1 class="title">${field.title}</h1></div>
      <div class="pin-icon" aria-hidden="true"></div>
    </div>
    <div class="meta-row"><span>${field.date}</span><span>${field.time}</span></div>`;
}

function renderHome(field, species, today) {
  const featured = today.featured_species.map(id => species.find(s => s.id === id)).filter(Boolean);
  $('#screen-home').innerHTML = `
    <div class="phone-inner">
      ${header(field)}
      <h2 class="section-title">${field.intro}</h2>
      <div class="sound-strip">${featured.map(miniCard).join('')}</div>
      <div class="small-link">See the list</div>
      <h2 class="section-title">You hear now:</h2>
      ${wave()}
      ${nav()}
    </div>`;
}

function renderList(field, species) {
  $('#screen-list').innerHTML = `
    <div class="phone-inner">
      <div class="header-row"><h1 class="title">${field.title}</h1><div class="pin-icon" aria-hidden="true"></div></div>
      <h2 class="section-title">List</h2>
      <div class="filter-row"><span class="filter">Bird</span><span class="filter">Insects</span><span class="filter">Mammal</span></div>
      <div class="grid-list">
        ${Array.from({length: 9}).map((_, i) => {
          const item = species[i % species.length];
          return `<article class="grid-card"><div class="mini-img">${imageTag(item.image, item.name)}</div><div class="mini-title">${item.name}</div>${barcode()}</article>`;
        }).join('')}
      </div>
      ${nav()}
    </div>`;
}

function renderSound(species) {
  const bird = species[0];
  $('#screen-sound').innerHTML = `
    <div class="dark-bg"></div>
    <div class="dark-content">
      <div class="circle-photo">${imageTag(bird.image, bird.name)}</div>
      <div class="play" aria-label="play"></div>
      <div class="sound-name">${bird.name}</div>
      <div class="sound-meta">Habitat: ${bird.habitat}<br>Season: ${bird.season}<br>Often seen: ${bird.often_seen}</div>
    </div>`;
}

function renderInfo(species) {
  const bird = species[0];
  $('#screen-info').innerHTML = `
    <div class="dark-bg"></div>
    <div class="info-content">
      <p class="info-text">${bird.description}</p>
      <p class="credit">Photo credit:<br>Sound credit:</p>
      <div class="play" aria-label="play"></div>
      <div class="sound-name">${bird.name}</div>
      <div class="sound-meta">Habitat: ${bird.habitat}<br>Season: ${bird.season}<br>Often seen: ${bird.often_seen}</div>
    </div>`;
}

function mapMarkup(withSheet, landscapes, species) {
  const first = landscapes[0];
  const names = first.species.map(id => species.find(s => s.id === id)?.name).filter(Boolean);
  return `
    <div class="map-canvas">
      <div class="map-placeholder"></div>
      <div class="road r1"></div><div class="road r2"></div><div class="road r3"></div>
      <div class="map-label l1">runo</div><div class="map-label l2">Higashi-Akiru</div>
      <span class="map-num n1">250</span><span class="map-num n2">7</span><span class="map-num n3">176</span><span class="map-num n4">166</span><span class="map-num n5">169</span><span class="map-num n6">169</span><span class="map-num n7">46</span>
      <span class="map-pin p1"></span><span class="map-pin p2"></span>
      ${withSheet ? `<aside class="bottom-sheet"><h3>${first.name}</h3><p>${first.description}</p>${names.map(n => `<span class="chip">${n}</span>`).join('')}</aside>` : ''}
    </div>
    ${nav()}`;
}

function renderMaps(landscapes, species) {
  $('#screen-map').innerHTML = mapMarkup(false, landscapes, species);
  $('#screen-map-sheet').innerHTML = mapMarkup(true, landscapes, species);
}

async function init() {
  const [field, species, landscapes, today] = await Promise.all([
    getJSON('data/field.json'),
    getJSON('data/species.json'),
    getJSON('data/landscapes.json'),
    getJSON('data/today.json')
  ]);

  renderHome(field, species, today);
  renderSound(species);
  renderInfo(species);
  renderList(field, species);
  renderMaps(landscapes, species);
}

init().catch(error => {
  document.body.innerHTML = `<pre style="padding:24px">${error.message}</pre>`;
});
