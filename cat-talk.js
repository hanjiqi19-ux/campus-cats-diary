(function catTalkModule() {
  'use strict';
  const storageKey = 'campus-cats-pet-talk-locale';
  let locale = 'zh';
  try { locale = window.localStorage.getItem(storageKey) === 'en' ? 'en' : 'zh'; } catch (_) {}
  let animal = 'cat';
  let messages = [];
  const packs = {
    zh: {
      cardKicker: '新玩法 · 猫言猫语', cardTitle: '想对毛孩子说什么？', cardDesc: '把你的心里话变成喵语或汪语，来聊聊天吧。', cardCta: '开始聊天',
      back: '返回首页', title: '猫言猫语', subtitle: '把你想说的话，变成毛孩子的语言',
      language: '语言', choose: '当前翻译官', cat: '猫猫', dog: '狗狗',
      tapAvatar: '点击动物头像切换猫 / 狗', empty: '今天想对毛孩子说些什么？',
      ideas: '试试这些话', presets: ['你好呀！','我喜欢你','快来吃饭啦！','今天开心吗？','晚安，好梦！'],
      placeholder: '输入你想说的话……', send: '发送', catLabel: '猫语', dogLabel: '狗语',
      disclaimer: '仅供娱乐：这是趣味拟声转换，不是真正的动物语言翻译。',
      switchAria: '切换动物', inputAria: '输入你想说的话', animalResponse: '的回答'
    },
    en: {
      cardKicker: 'NEW · PET TALK', cardTitle: 'Got something to say?', cardDesc: 'Turn your message into playful meows and woofs.', cardCta: 'Start chatting',
      back: 'Back to home', title: 'Pet Talk', subtitle: 'Say it in meows and woofs',
      language: 'Language', choose: 'Your translator', cat: 'Cat', dog: 'Dog',
      tapAvatar: 'Tap the animal avatar to switch between cat and dog', empty: 'What would you like to tell your furry friend?',
      ideas: 'Try a quick message', presets: ['Hello there!','I love you','Come eat!','Are you happy today?','Good night, sweet dreams!'],
      placeholder: 'Type a message…', send: 'Send', catLabel: 'Cat talk', dogLabel: 'Dog talk',
      disclaimer: 'Just for fun! These are playful animal sounds, not a real translation of animal language.',
      switchAria: 'Switch animal', inputAria: 'Type your message', animalResponse: ' replied'
    }
  };
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  function dictionary() {return packs[locale];}
  function card() {
    const t = dictionary();
    return `<a class="pet-talk-home" href="#/cat-talk" aria-label="${esc(t.title)}">
      <span class="pet-talk-home-icons" aria-hidden="true">🐱 <span>↔</span> 🐶</span>
      <span class="pet-talk-home-copy"><small>${esc(t.cardKicker)}</small><strong>${esc(t.cardTitle)}</strong><em>${esc(t.cardDesc)}</em></span>
      <span class="pet-talk-home-cta">${esc(t.cardCta)} →</span>
    </a>`;
  }
  function makeReply(input, kind) {
    const s = input.toLowerCase();
    const food = /吃|饭|饿|零食|猫粮|狗粮|eat|food|hungry|dinner|lunch|treat/.test(s);
    const love = /喜欢|爱|想你|抱抱|love|miss|hug|kiss/.test(s);
    const sleep = /睡|晚安|休息|good night|sleep|dream|bed/.test(s);
    const happy = /开心|快乐|高兴|happy|fun|play|excited/.test(s);
    let variant = 0;
    for (let i = 0; i < s.length; i++) variant = (variant * 31 + s.charCodeAt(i)) % 997;
    const dog = kind === 'dog';
    const variants = locale === 'en'
      ? dog
        ? {food:['Woof woof! Arf! 🦴'], love:['Woof! Woooof~ ❤️'], sleep:['Ruff… zzz… 💤'], happy:['WOOF! Arf arf! 🐾'], other:['Woof woof~!','Arf? Woof!','Ruff ruff!']}
        : {food:['Meow! Mrrrow~ 🐟'], love:['Purr… meow~ ❤️'], sleep:['Mew… purrrrr… 💤'], happy:['Meow meow! Purr! 🐾'], other:['Meow~ mrrp!','Mew? Meow meow!','Prrr… mrow!']}
      : dog
        ? {food:['汪汪！呜汪～ 🦴'], love:['汪！汪汪～ ❤️'], sleep:['呜汪……呼噜～ 💤'], happy:['汪汪汪！汪～ 🐾'], other:['汪汪！呜汪～','汪～汪汪！','呜汪？汪！']}
        : {food:['喵呜～喵喵！🐟'], love:['呼噜呼噜～喵咪～ ❤️'], sleep:['喵呜……呼噜噜～ 💤'], happy:['喵喵！咕噜咕噜～ 🐾'], other:['喵喵～喵呜！','咪呜～呼噜呼噜','喵？喵喵喵！']};
    const group = food ? 'food' : love ? 'love' : sleep ? 'sleep' : happy ? 'happy' : 'other';
    const options = variants[group];
    return options[variant % options.length];
  }
  function chatMessages() {
    const t = dictionary();
    if (!messages.length) return `<div class="pet-talk-empty"><span aria-hidden="true">${animal === 'cat' ? '🐱' : '🐶'}</span><p>${esc(t.empty)}</p></div>`;
    return messages.map(m => {
      const reply = makeReply(m.input, m.animal);
      const emoji = m.animal === 'cat' ? '🐱' : '🐶';
      const label = m.animal === 'cat' ? t.cat : t.dog;
      return `<div class="pet-talk-turn">
        <div class="pet-talk-user"><span>${esc(m.input)}</span></div>
        <div class="pet-talk-assistant">
          <button type="button" class="pet-talk-reply-avatar" data-pet-toggle title="${esc(t.switchAria)}" aria-label="${esc(t.switchAria)}">${emoji}</button>
          <div class="pet-talk-answer"><small>${esc(label)}${esc(t.animalResponse)}</small><span>${esc(reply)}</span></div>
        </div>
      </div>`;
    }).join('');
  }
  function page() {
    const t = dictionary();
    return `<section class="pet-talk-page" lang="${locale === 'en' ? 'en' : 'zh-CN'}">
      <div class="pet-talk-top"><a class="pet-talk-back" href="#/home" aria-label="${esc(t.back)}">← <span>${esc(t.back)}</span></a>
        <div class="pet-talk-locale" role="group" aria-label="${esc(t.language)}">
          <button type="button" data-pet-locale="zh" class="${locale === 'zh' ? 'selected' : ''}" aria-pressed="${locale === 'zh'}">中文</button>
          <button type="button" data-pet-locale="en" class="${locale === 'en' ? 'selected' : ''}" aria-pressed="${locale === 'en'}">EN</button>
        </div>
      </div>
      <div class="pet-talk-hero"><span class="pet-talk-hero-emoji" aria-hidden="true">🐱 💬 🐶</span><h1>${esc(t.title)}</h1><p>${esc(t.subtitle)}</p></div>
      <div class="pet-talk-content">
        <div class="pet-talk-translator">
          <div class="pet-talk-mode">
            <div><small>${esc(t.choose)}</small><strong>${animal === 'cat' ? t.cat : t.dog}</strong></div>
            <button type="button" class="pet-talk-main-avatar" data-pet-toggle aria-label="${esc(t.switchAria)}" title="${esc(t.switchAria)}">${animal === 'cat' ? '🐱' : '🐶'} <span>⇄</span></button>
            <div class="pet-talk-select" role="group" aria-label="${esc(t.choose)}">
              <button type="button" data-pet-animal="cat" class="${animal === 'cat' ? 'selected' : ''}" aria-pressed="${animal === 'cat'}">🐱 ${esc(t.cat)}</button>
              <button type="button" data-pet-animal="dog" class="${animal === 'dog' ? 'selected' : ''}" aria-pressed="${animal === 'dog'}">🐶 ${esc(t.dog)}</button>
            </div>
          </div>
          <p class="pet-talk-avatar-hint">${esc(t.tapAvatar)}</p>
          <div class="pet-talk-messages" role="log" aria-label="${esc(t.title)}" aria-live="polite">${chatMessages()}</div>
        </div>
        <div class="pet-talk-composer">
          <strong class="pet-talk-ideas-title">${esc(t.ideas)}</strong>
          <div class="pet-talk-presets">${t.presets.map((s,i)=>`<button type="button" data-pet-preset="${i}">${esc(s)}</button>`).join('')}</div>
          <form id="pet-talk-form" class="pet-talk-form"><input id="pet-talk-input" name="message" type="text" maxlength="240" autocomplete="off" placeholder="${esc(t.placeholder)}" aria-label="${esc(t.inputAria)}" required><button type="submit">${esc(t.send)} ↗</button></form>
          <p class="pet-talk-disclaimer">${esc(t.disclaimer)}</p>
        </div>
      </div>
    </section>`;
  }
  function refresh() {
    const old = document.querySelector('#pet-talk-input');
    const draft = old ? old.value : '';
    const pageRoot = document.querySelector('.pet-talk-page');
    if (pageRoot) {
      pageRoot.outerHTML = page();
      const next = document.querySelector('#pet-talk-input');
      if (next) next.value = draft;
    }
  }
  function send(text) {
    const clean = String(text || '').trim().slice(0,240);
    if (!clean) return;
    messages.push({input:clean, animal});
    refresh();
    const input = document.getElementById('pet-talk-input');
    if (input) input.value = '';
    const log = document.querySelector('.pet-talk-messages');
    if (log) log.scrollTop = log.scrollHeight;
  }
  document.addEventListener('click', event => {
    const languageButton = event.target.closest('[data-pet-locale]');
    if (languageButton) {
      locale = languageButton.dataset.petLocale === 'en' ? 'en' : 'zh';
      try { window.localStorage.setItem(storageKey, locale); } catch (_) {}
      refresh(); return;
    }
    const animalButton = event.target.closest('[data-pet-animal]');
    if (animalButton) { animal = animalButton.dataset.petAnimal === 'dog' ? 'dog' : 'cat'; refresh(); return; }
    if (event.target.closest('[data-pet-toggle]')) { animal = animal === 'cat' ? 'dog' : 'cat'; refresh(); return; }
    const preset = event.target.closest('[data-pet-preset]');
    if (preset) {
      const index = Number(preset.dataset.petPreset);
      const chosen = dictionary().presets[index];
      if (chosen) send(chosen);
    }
  });
  document.addEventListener('submit', event => {
    if (event.target.id !== 'pet-talk-form') return;
    event.preventDefault();
    const field = event.target.querySelector('#pet-talk-input');
    send(field ? field.value : '');
  });
  window.CatTalk = {homeCard:card,page};
})();
