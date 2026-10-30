/* Date-based campus cat journals. Shares authors, cats, moderation and interactions with posts. */
window.CampusDiary = {
  create(ctx) {
    const {store, ui, e, icon, button, pageTop, empty, blankDraft, syncDraft, persistDraft, render, go, toast} = ctx;
    Object.assign(ui, {diaryScope:'all', diarySchool:'', diaryCat:'', diaryMonth:''});
    const today=()=>CampusCats.dayKey(Date.now());
    const diaryRoute=p=>'#/diary/'+p.id;
    const options=(rows, selected, key='name')=>rows.map(x=>`<option value="${e(x.id)}" ${x.id===selected?'selected':''}>${e(x[key])}</option>`).join('');
    function dateLabel(value) {
      const [year,month,day]=value.split('-');
      return {year,month,day,full:`${year}年${Number(month)}月${Number(day)}日`};
    }
    function tags(p) {
      return `${p.weather?`<span>${icon('leaf')}${e(p.weather)}</span>`:''}${p.mood?`<span>${icon('heart')}${e(p.mood)}</span>`:''}`;
    }
    function entry(p,compact=false) {
      const date=dateLabel(p.diaryDate);
      return `<article class="diary-entry ${compact?'compact':''}">
        <div class="diary-entry-top"><a class="diary-cat-name" href="#/cat/${p.cat.id}"><img src="${e(p.cat.image)}" alt="${e(p.cat.name)}"><span>${e(p.cat.name)}<small>${e(p.school.short)}的猫猫同学</small></span></a><span class="diary-entry-kind">${icon('book')}校猫日记</span></div>
        ${p.status!=='approved'?`<span class="pending-label">${p.status==='pending'?'待收录 · 仅自己可见':'需调整 · 仅自己可见'}</span>`:''}
        <div class="diary-entry-content"><a class="diary-entry-text" href="${diaryRoute(p)}"><h3>${e(p.title)}</h3><p>${e(p.body.slice(0,compact?70:115))}${p.body.length>(compact?70:115)?'…':''}</p></a>${p.hasMedia?`<a class="diary-entry-photo" href="${diaryRoute(p)}"><img src="${e(p.image)}" alt="${e(p.title)}" loading="lazy"></a>`:''}</div>
        <div class="diary-entry-tags">${tags(p)}</div>
        <div class="diary-entry-footer"><span>${e(p.author)}<small>${date.full}</small></span><div><button class="diary-icon-action ${p.liked?'active':''}" data-action="like" data-id="${p.id}" aria-label="${p.liked?'取消点赞':'点赞'}日记：${e(p.title)}">${icon('heart')} ${p.likes}</button>${p.mine?button(`${icon('edit')}编辑`,'edit-diary',`data-id="${p.id}"`,'small outline'):''}<a class="diary-read-link" href="${diaryRoute(p)}">翻开 ${icon('arrow')}</a></div></div>
      </article>`;
    }
    function list(filters={}, compact=false, limit=0) {
      let rows=store.getDiaries(filters);
      if(limit)rows=rows.slice(0,limit);
      if(!rows.length)return empty(filters.mine?'第一篇校猫日记，等你来写':'这一页，等你留下新的相遇','记下一个名字、一个午后，或一段想念。','','','book');
      const groups=[];
      rows.forEach(p=>{let last=groups[groups.length-1];if(!last||last.date!==p.diaryDate){last={date:p.diaryDate,rows:[]};groups.push(last);}last.rows.push(p);});
      return `<div class="diary-timeline ${compact?'compact':''}">${groups.map(group=>{const d=dateLabel(group.date);return `<section class="diary-day"><div class="diary-date"><strong>${d.day}</strong><span>${Number(d.month)}月</span><small>${d.year}</small></div><div class="diary-day-entries">${group.rows.map(p=>entry(p,compact)).join('')}</div></section>`;}).join('')}</div>`;
    }
    function door() {
      return `<a class="diary-door" href="#/diaries"><span class="diary-door-icon">${icon('book')}</span><span><strong>校猫日记</strong><small>把今天的相遇，留给未来的我们。</small></span><span class="diary-door-cta">翻开日记 ${icon('arrow')}</span></a>`;
    }
    function page() {
      const all=store.getDiaries({mine:ui.diaryScope==='mine'});
      const rows=store.getDiaries({mine:ui.diaryScope==='mine',schoolId:ui.diarySchool,catId:ui.diaryCat,month:ui.diaryMonth});
      const campuses=new Set(all.map(p=>p.schoolId)).size;
      const cats=store.getCats(ui.diarySchool);
      return `${pageTop('校猫日记')}
        <section class="diary-hero"><div class="diary-hero-copy"><span class="eyebrow">OUR CAMPUS JOURNAL</span><h2>有些相遇，<br>值得一直记得。</h2><p>一只猫的校园生活，<br>由一届又一届的我们共同写下。</p>${button(`${icon('edit')}写一篇日记`,'new-diary','','primary')}</div><div class="diary-hero-photos" aria-hidden="true"><figure><img src="assets/ginger.jpg" alt=""><figcaption>今天，主任也在。</figcaption></figure><figure><img src="assets/calico.jpg" alt=""><figcaption>把小事，记成故事。</figcaption></figure></div><span class="diary-hero-stamp">DEAR CAMPUS,<br>DEAR LITTLE FRIENDS.</span></section>
        <div class="feed-toolbar"><div class="segmented"><button class="${ui.diaryScope==='all'?'active':''}" data-action="diary-scope" data-value="all">大家的日记</button><button class="${ui.diaryScope==='mine'?'active':''}" data-action="diary-scope" data-value="mine">我的日记</button></div><span class="toolbar-note">${all.length}篇记录 · ${campuses}所校园</span></div>
        <div class="diary-filters"><label><span>学校</span><select id="diary-school" aria-label="筛选日记学校"><option value="">全部学校</option>${options(store.getSchools(),ui.diarySchool)}</select></label><label><span>猫猫同学</span><select id="diary-cat" aria-label="筛选日记猫咪"><option value="">全部猫咪</option>${options(cats,ui.diaryCat)}</select></label><label><span>月份</span><select id="diary-month" aria-label="筛选日记月份"><option value="">全部月份</option>${store.getDiaryMonths().map(m=>`<option value="${m}" ${m===ui.diaryMonth?'selected':''}>${m.replace('-','年')}月</option>`).join('')}</select></label></div>
        <p class="diary-result-note">${ui.diaryScope==='mine'?'你亲手写下的校园记忆':'按记录日期，翻阅校园里的小故事'}<span>${rows.length}篇日记</span></p>
        ${list({mine:ui.diaryScope==='mine',schoolId:ui.diarySchool,catId:ui.diaryCat,month:ui.diaryMonth})}
        <p class="demo-note">体验版 · 示例日记展示共同记录的方式<br>你写下的日记和草稿保存在当前浏览器</p>`;
    }
    function editor() {
      const d=ui.draft;
      const selectedCats=d.schoolId?store.getCats(d.schoolId):[];
      return `${pageTop(d.editingId?'继续编辑这篇日记':'写一篇校猫日记')}
        ${modeSwitch()}
        <div class="diary-editor-intro"><span class="eyebrow">A LITTLE MOMENT TO REMEMBER</span><h2>把今天的相遇，写成日记。</h2><p>也可以补写从前。多年后，这一页还能被翻开。</p></div>
        <form id="publish-form" class="publish-form diary-editor">
          <div class="form-grid"><label>记录日期<input type="date" name="diaryDate" value="${e(d.diaryDate||today())}" max="${today()}" required></label><label>属于哪所学校<select id="draft-school" name="schoolId" required><option value="">选择学校</option>${options(store.getSchools(),d.schoolId)}</select></label></div>
          <label>今天遇见哪位猫猫同学？<select id="draft-cat" name="catId" required ${!d.schoolId?'disabled':''}><option value="">选择猫猫同学</option>${options(selectedCats,d.catId)}</select></label>
          <label>给这一页起个名字<input name="title" value="${e(d.title)}" maxlength="48" required placeholder="例如：今天，主任陪我读完了最后一页"></label>
          <label>写下这次相遇<textarea class="diary-paper-input" name="body" maxlength="1500" rows="9" required placeholder="它今天在做什么？你们有怎样的小故事？\n\n不用写得很特别，平常的小事也值得记住。">${e(d.body)}</textarea></label>
          <div class="form-grid"><label>那天的天气 <em>选填</em><select name="weather"><option value="">不记录天气</option>${CampusCats.WEATHER.map(w=>`<option ${d.weather===w?'selected':''}>${w}</option>`).join('')}</select></label><label>那时的心情 <em>选填</em><select name="mood"><option value="">不记录心情</option>${CampusCats.MOODS.map(m=>`<option ${d.mood===m?'selected':''}>${m}</option>`).join('')}</select></label></div>
          <div class="diary-photo-field"><div class="diary-photo-heading"><strong>为这一页，添一张照片</strong><span>选填 · 文字也能成为日记</span></div>${d.media?`<div class="diary-photo-preview"><img src="${e(store.asset(d.media))}" alt="日记照片">${button('移除照片','remove-diary-photo','','small outline')}</div>`:`<button class="diary-photo-add" type="button" data-action="pick-media">${icon('camera')}添加照片</button>`}<input type="file" id="media-input" accept="image/*" hidden><div class="sample-picks"><span>先用示例照片试试</span>${['ginger.jpg','tuxedo.jpg','calico.jpg'].map(src=>`<button type="button" data-action="sample" data-src="${src}" aria-label="使用${src==='ginger.jpg'?'橘猫':src==='tuxedo.jpg'?'黑白猫':'三花猫'}示例照片"><img src="assets/${src}" alt="示例照片"></button>`).join('')}</div></div>
          <p class="form-help">日记提交后仅自己可见，审核收录后会加入学校和猫咪的共同日记。请分享原创或已获授权的内容。</p>
          <div class="form-actions">${button('保存草稿','save-draft','','outline')}<button class="button primary" type="submit">${icon('book')}${d.editingId?'保存并重新提交':'收好这篇日记'}</button></div>
        </form>`;
    }
    function modeSwitch() {
      if(ui.draft.editingId)return `<div class="diary-edit-note">${icon('edit')}正在编辑自己的日记；修改后将重新进入收录流程。</div>`;
      return `<div class="compose-modes"><button data-action="compose-kind" data-value="post" class="${ui.draft.kind!=='diary'?'active':''}">${icon('camera')}校园投稿</button><button data-action="compose-kind" data-value="diary" class="${ui.draft.kind==='diary'?'active':''}">${icon('book')}校猫日记</button></div>`;
    }
    function catSection(c) {
      const count=store.getDiaries({catId:c.id}).length;
      return `<div class="section-title"><h2>${e(c.name)}的校猫日记 <small class="muted">${count}篇</small></h2>${button(`${icon('edit')}写一页`,'new-diary',`data-school="${c.school.id}" data-cat="${c.id}"`,'small')}</div>${list({catId:c.id},true,2)}${count>2?`<a class="diary-more-link" href="#/diaries?school=${c.school.id}&cat=${c.id}">翻阅全部日记 ${icon('arrow')}</a>`:''}`;
    }
    function schoolContent(s) {
      return `<div class="diary-school-intro"><div><strong>这所校园，正在被共同记录。</strong><p>把不同同学与猫猫的相遇，留在同一本日记里。</p></div>${button(`${icon('edit')}写日记`,'new-diary',`data-school="${s.id}"`,'small')}</div>${list({schoolId:s.id},true)}`;
    }
    function detail(p) {
      const date=dateLabel(p.diaryDate);
      return `${pageTop('翻开一篇校猫日记')}${p.status!=='approved'?`<div class="status-banner">${p.status==='pending'?'日记已保存，等待收录。当前仅自己可见，可到“我的 → 本机审核体验”体验收录流程。':'日记需要调整，修改后可以重新提交。'}</div>`:''}
        <article class="diary-reader"><header><a href="#/cat/${p.cat.id}" class="diary-cat-name"><img src="${e(p.cat.image)}" alt="${e(p.cat.name)}"><span>${e(p.cat.name)}<small>${e(p.school.name)}</small></span></a>${p.mine?button(`${icon('edit')}编辑日记`,'edit-diary',`data-id="${p.id}"`,'small outline'):'<span class="diary-reader-label">CAMPUS JOURNAL</span>'}</header><div class="diary-reader-body"><div class="diary-reader-date">${icon('calendar')}${date.full}<span>关于 ${e(p.cat.name)}</span></div><h1>${e(p.title)}</h1><div class="diary-entry-tags">${tags(p)}</div><div class="diary-reader-prose">${e(p.body)}</div>${p.hasMedia?`<figure class="diary-reader-photo"><img src="${e(p.image)}" alt="${e(p.title)}"><figcaption>留在这一页的，小小瞬间。</figcaption></figure>`:''}<div class="diary-reader-signature"><span>记于 ${e(p.school.name)}</span><strong>${e(p.author)}</strong></div><div class="detail-links"><a href="#/school/${p.school.id}"># ${e(p.school.name)}</a><a href="#/cat/${p.cat.id}"># ${e(p.cat.name)}</a><a href="#/diaries?school=${p.school.id}&cat=${p.cat.id}"># 它的共同日记</a></div><div class="detail-actions">${button(`${icon('heart')}${p.likes} 赞`,'like',`data-id="${p.id}"`,p.liked?'active':'')}${button(`${icon('bookmark')}${p.saved?'已收藏':'收藏'} · ${p.saves}`,'save',`data-id="${p.id}"`,p.saved?'active':'')}</div></div></article>
        <section class="comments"><h2>给这一页留句话 · ${p.commentCount}</h2>${p.comments.length?p.comments.map(c=>`<div class="comment-row"><span class="author-avatar">${e(c.author.slice(0,1))}</span><div><strong>${e(c.author)}</strong><p>${e(c.text)}</p></div></div>`).join(''):'<p class="small muted">也许，你也曾在同一个地方遇见它。</p>'}<form id="comment-form" class="comment-form" data-id="${p.id}"><input name="text" maxlength="300" placeholder="写下你读到这一页的心情…" aria-label="评论内容" required><button class="button primary" type="submit">发送</button></form></section>`;
    }
    function begin(schoolId,catId) {
      syncDraft(document.getElementById('publish-form'));
      const media=ui.draft.mediaType==='video'?'':ui.draft.media;
      ui.draft={...blankDraft(),...ui.draft,media,kind:'diary',eventId:'',editingId:'',mediaType:'image',diaryDate:ui.draft.diaryDate||today()};
      if(schoolId&&schoolId!==ui.draft.schoolId){ui.draft.schoolId=schoolId;ui.draft.catId='';}
      if(catId)ui.draft.catId=catId;
      persistDraft();go('publish');
    }
    function handleClick(action,target) {
      switch(action) {
        case 'new-diary':begin(target.dataset.school||'',target.dataset.cat||'');return true;
        case 'diary-scope':ui.diaryScope=target.dataset.value;render();return true;
        case 'compose-kind':syncDraft(document.getElementById('publish-form'));ui.draft.kind=target.dataset.value;if(ui.draft.kind==='diary'){ui.draft.eventId='';ui.draft.diaryDate=ui.draft.diaryDate||today();if(ui.draft.mediaType==='video'){ui.draft.media='';ui.draft.mediaType='image';}}persistDraft();render();return true;
        case 'remove-diary-photo':syncDraft(document.getElementById('publish-form'));ui.draft.media='';ui.draft.mediaType='image';persistDraft();render();return true;
        case 'edit-diary':{
          const p=store.getPost(target.dataset.id);if(!p||!p.mine||p.kind!=='diary'){toast('只能编辑自己写下的日记');return true;}
          ui.draft={...blankDraft(),title:p.title,body:p.body,schoolId:p.schoolId,catId:p.catId,media:p.media||'',mediaType:'image',kind:'diary',diaryDate:p.diaryDate,weather:p.weather||'',mood:p.mood||'',editingId:p.id};persistDraft();go('publish');return true;
        }
        default:return false;
      }
    }
    function handleChange(event) {
      if(event.target.id==='diary-school'){ui.diarySchool=event.target.value;ui.diaryCat='';render();return true;}
      if(event.target.id==='diary-cat'){ui.diaryCat=event.target.value;render();return true;}
      if(event.target.id==='diary-month'){ui.diaryMonth=event.target.value;render();return true;}
      return false;
    }
    return {page,editor,modeSwitch,door,list,entry,detail,catSection,schoolContent,handleClick,handleChange};
  }
};
