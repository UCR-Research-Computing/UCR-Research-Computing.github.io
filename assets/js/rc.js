/* UCR Research Computing site script. No framework, no tracking. */
(function () {
  'use strict';
  var BASE = (window.RC && window.RC.base) || '';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var idx = null;
  function getIndex() {
    if (!idx) idx = fetch(BASE + '/assets/js/search.json').then(function (r) { return r.json(); });
    return idx;
  }

  /* mobile menu */
  $$('[data-rc-burger]').forEach(function (b) {
    b.addEventListener('click', function () {
      var open = $('#rc-nav').classList.toggle('open');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* sidebar "On this page" */
  var toc = $('[data-toc]');
  if (toc) {
    var heads = $$('.prose h2, .prose h3').filter(function (h) { return !h.closest('.related, .reviewed, .fit'); });
    var h2s = heads.filter(function (h) { return h.tagName === 'H2'; });
    if (h2s.length >= 2) {
      var list = $('[data-toc-list]', toc);
      var useH3 = h2s.length < 6;
      heads.forEach(function (h, i) {
        if (h.tagName === 'H3' && !useH3) return;
        if (!h.id) h.id = 's-' + i;
        var a = document.createElement('a');
        a.href = '#' + h.id;
        a.className = h.tagName === 'H3' ? 'lvl3' : 'lvl2';
        a.textContent = h.textContent.replace(/\s+/g, ' ').trim();
        list.appendChild(a);
      });
      toc.hidden = false;
      if ('IntersectionObserver' in window) {
        var links = {};
        $$('a', list).forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            if (e.isIntersecting && links[e.target.id]) {
              $$('a.on', list).forEach(function (a) { a.classList.remove('on'); });
              links[e.target.id].classList.add('on');
            }
          });
        }, { rootMargin: '-90px 0px -70% 0px' });
        heads.forEach(function (h) { io.observe(h); });
      }
    } else {
      toc.remove();
      var lay = $('[data-toc-layout]');
      if (lay && !lay.classList.contains('three')) lay.classList.add('single');
    }
  }

  /* search */
  var ov = $('#rc-search'), input = $('#rc-search-input'), out = $('#rc-search-results'), hl = 0;
  function score(p, terms) {
    var s = 0, T = p.t.toLowerCase(), K = (p.k || '').toLowerCase(), S = (p.s || '').toLowerCase(), X = (p.x || '').toLowerCase();
    for (var i = 0; i < terms.length; i++) {
      var w = terms[i], hit = 0;
      if (T.indexOf(w) > -1) hit += 10;
      if (K.indexOf(w) > -1) hit += 6;
      if (S.indexOf(w) > -1) hit += 3;
      if (X.indexOf(w) > -1) hit += 1;
      if (!hit) return 0;
      s += hit;
    }
    return s;
  }
  function runSearch(q, items) {
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return items.map(function (p) { return { p: p, s: score(p, terms) }; })
      .filter(function (r) { return r.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .map(function (r) { return r.p; });
  }
  function render() {
    getIndex().then(function (items) {
      var q = input.value.trim();
      if (!q) { out.innerHTML = '<div class="empty">Try: GPU, storage, enclave, Slurm, grant, Globus...</div>'; return; }
      var res = runSearch(q, items).slice(0, 12);
      hl = 0;
      out.innerHTML = res.length ? res.map(function (p, i) {
        return '<a href="' + p.u + '"' + (i === 0 ? ' class="hl"' : '') + '><span class="sm">' + esc(p.k) + '</span>' + esc(p.t) + '</a>';
      }).join('') : '<div class="empty">No matches. Try fewer words, or <a href="' + BASE + '/help/">ask us</a>.</div>';
    });
  }
  function openSearch(q) {
    if (!ov) return;
    ov.hidden = false;
    input.value = q || '';
    render();
    setTimeout(function () { input.focus(); }, 10);
  }
  function closeSearch() { if (ov) ov.hidden = true; }
  $$('[data-rc-search]').forEach(function (b) { b.addEventListener('click', function () { openSearch(); }); });
  if (ov) {
    ov.addEventListener('click', function (e) { if (e.target === ov) closeSearch(); });
    input.addEventListener('input', render);
    input.addEventListener('keydown', function (e) {
      var items = $$('a', out);
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && items.length) {
        e.preventDefault();
        items[hl].classList.remove('hl');
        hl = (hl + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length;
        items[hl].classList.add('hl');
        items[hl].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter' && items[hl]) {
        window.location.href = items[hl].getAttribute('href');
      }
    });
  }
  document.addEventListener('keydown', function (e) {
    var tag = (document.activeElement && document.activeElement.tagName) || '';
    if (e.key === 'Escape') closeSearch();
    else if ((e.key === '/' || (e.key === 'k' && (e.ctrlKey || e.metaKey))) && !/INPUT|TEXTAREA|SELECT/.test(tag)) {
      e.preventDefault();
      openSearch();
    }
  });

  /* hero "what do you need" box: opens search with the typed words */
  var ask = $('[data-ask]');
  if (ask) {
    ask.addEventListener('submit', function (e) {
      e.preventDefault();
      openSearch($('input', ask).value);
    });
    $$('[data-ask-hint]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); openSearch(a.getAttribute('data-ask-hint')); });
    });
  }

  /* catalog filter chips */
  $$('[data-catalog]').forEach(function (root) {
    var chips = $$('[data-f]', root), cards = $$('.rc[data-t]', root), note = $('.empty-note', root);
    function apply(f) {
      var shown = 0;
      chips.forEach(function (c) { c.classList.toggle('on', c.getAttribute('data-f') === f); });
      cards.forEach(function (r) {
        var ok = f === 'all' || (' ' + r.getAttribute('data-t') + ' ').indexOf(' ' + f + ' ') > -1;
        r.hidden = !ok;
        if (ok) shown++;
      });
      if (note) note.hidden = shown > 0;
    }
    chips.forEach(function (c) { c.addEventListener('click', function () { apply(c.getAttribute('data-f')); }); });
  });

  /* resource finder: three questions filter the service cards (deterministic, no AI) */
  var finder = $('[data-finder]');
  if (finder) {
    var state = {};
    var cards = $$('.rc[data-t]', finder.parentNode);
    var count = $('[data-finder-count]', finder);
    function applyFinder() {
      var shown = 0;
      cards.forEach(function (r) {
        var t = ' ' + r.getAttribute('data-t') + ' ', ok = true;
        Object.keys(state).forEach(function (k) {
          if (state[k] && t.indexOf(' ' + state[k] + ' ') < 0) ok = false;
        });
        r.hidden = !ok;
        if (ok) shown++;
      });
      if (count) count.textContent = shown ? shown + ' suggested option' + (shown === 1 ? '' : 's') + ' below.' : 'No single service matches all three. Ask us; there is usually a path.';
    }
    $$('[data-q]', finder).forEach(function (grp) {
      var key = grp.getAttribute('data-q');
      $$('button', grp).forEach(function (b) {
        b.addEventListener('click', function () {
          var v = b.getAttribute('data-v');
          state[key] = state[key] === v ? '' : v;
          $$('button', grp).forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-v') === state[key]); });
          applyFinder();
        });
      });
    });
  }

  /* KB index filter */
  var kb = $('[data-kbindex]');
  if (kb) {
    var q = $('input', kb), topicBtns = $$('[data-topic]', kb), items = $$('.kblist a', kb), topic = 'all';
    function applyKb() {
      var terms = q.value.toLowerCase().split(/\s+/).filter(Boolean), shown = 0;
      items.forEach(function (a) {
        var txt = a.textContent.toLowerCase();
        var ok = (topic === 'all' || a.getAttribute('data-topic') === topic) && terms.every(function (w) { return txt.indexOf(w) > -1; });
        a.hidden = !ok;
        if (ok) shown++;
      });
      var n = $('[data-kbcount]', kb);
      if (n) n.textContent = shown + ' guide' + (shown === 1 ? '' : 's');
    }
    q.addEventListener('input', applyKb);
    topicBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        topic = b.getAttribute('data-topic');
        topicBtns.forEach(function (x) { x.classList.toggle('on', x === b); });
        applyKb();
      });
    });
    applyKb();
  }
})();
