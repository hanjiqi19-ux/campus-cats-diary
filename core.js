/* Campus Cats shared domain model. No browser or WeChat globals. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CampusCats = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  var VERSION = 1;
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function id(prefix) { return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8); }
  function dayKey(time) { return new Date((time == null ? Date.now() : time) + 8 * 3600000).toISOString().slice(0, 10); }
  var WEATHER = ['晴天', '多云', '阴天', '小雨', '微风'];
  var MOODS = ['被治愈', '开心', '平静', '想念', '感动'];
  function upgradeDiary(state, time) {
    if (state.diaryFeatureVersion === 1) return state;
    var samples = [
      { id: 'diary-ju-library', schoolId: 'scut', catId: 'ju', author: '图书馆慢半拍', authorId: 'demo-diary-a', title: '今天，主任陪我读完了最后一页', body: '在图书馆门口改了一下午作业，抬头的时候，橘主任正坐在树影里。\n\n它什么也没做，只是慢慢眯起眼睛。我也跟着放慢了一点。原来一天里最值得记住的时刻，可以这么小。\n\n希望很多年以后，翻到这一页的人，也能认识这位安静的校园同学。', image: 'ginger.jpg', days: 0, weather: '晴天', mood: '被治愈', likes: 72, saves: 16 },
      { id: 'diary-huahua-bench', schoolId: 'scut', catId: 'huahua', author: '长椅旁边的同学', authorId: 'demo-diary-b', title: '把长椅让给花花的那个下午', body: '带着一本书出门，发现想坐的长椅已经有了主人。\n\n花花睡得很熟，我就坐在旁边的台阶上。风吹下几片叶子，我们谁也没有赶时间。\n\n给这次偶遇留一张照片，留住不需要说话的陪伴。', image: 'calico.jpg', days: 3, weather: '微风', mood: '平静', likes: 58, saves: 13 },
      { id: 'diary-fantuan-window', schoolId: 'sysu', catId: 'fantuan', author: '红楼散步日记', authorId: 'demo-diary-c', title: '雨停以后，窗台上多了一位听众', body: '下课的时候雨刚停，饭团在窗边认真看着操场。\n\n我给朋友发了一张照片，说今天的课堂还有一位穿小礼服的旁听生。\n\n如果有一天不再常回学校，希望还能在这里看到它的新故事。', image: 'tuxedo.jpg', days: 32, weather: '小雨', mood: '开心', likes: 46, saves: 11 },
      { id: 'diary-heimi-return', schoolId: 'fdu', catId: 'heimi', author: '回学校看看的人', authorId: 'demo-diary-d', title: '毕业以后，我又来向黑米报到了', body: '从前赶课，总是匆匆路过这扇窗。今天特意绕回来，黑米还在熟悉的位置上。\n\n新的同学叫着我没听过的昵称，但讲起它的习惯，和我们那时候一样。\n\n我们把校园交给下一届，也把这些毛茸茸的小故事，继续写下去。', image: '', days: 64, weather: '多云', mood: '想念', likes: 89, saves: 27 }
    ];
    samples.forEach(function (x) {
      if (state.posts.some(function (p) { return p.id === x.id; }) || !state.cats.some(function (c) { return c.id === x.catId && c.schoolId === x.schoolId; })) return;
      x.createdAt = time - x.days * 86400000; x.diaryDate = dayKey(x.createdAt); delete x.days;
      x.kind = 'diary'; x.category = '日记'; x.status = 'approved'; x.official = false; x.mediaType = 'image'; x.media = x.image; x.comments = [];
      state.posts.push(x);
    });
    state.diaryFeatureVersion = 1;
    return state;
  }
  function seed(now) {
    var t = now || Date.now();
    var schools = [
      { id: 'scut', name: '华南理工大学', short: '华工', aliases: ['华南理工', '华工', 'scut', 'huagong'], city: '广州', initial: '华', color: 'green', club: '华工猫猫守护社', intro: '从五山到大学城，记录那些陪我们走过校园的小小身影。', campus: '五山校区 / 大学城校区', followers: 1286 },
      { id: 'sysu', name: '中山大学', short: '中大', aliases: ['中山', '中大', 'sysu', 'zhongda'], city: '广州', initial: '中', color: 'orange', club: '中大校园猫观察站', intro: '榕树下、红楼旁，每一次遇见都值得被记住。', campus: '广州校区', followers: 963 },
      { id: 'szu', name: '深圳大学', short: '深大', aliases: ['深圳', '深大', 'szu', 'shenda'], city: '深圳', initial: '深', color: 'purple', club: '深大校猫日记', intro: '把荔园里的猫猫日常，写进共同的校园相册。', campus: '粤海校区', followers: 782 },
      { id: 'pku', name: '北京大学', short: '北大', aliases: ['北京', '北大', 'pku', 'beida'], city: '北京', initial: '北', color: 'red', club: '燕园猫猫小分队', intro: '湖畔的散步、银杏下的午睡，都是燕园的温柔日常。', campus: '燕园校区', followers: 2150 },
      { id: 'fdu', name: '复旦大学', short: '复旦', aliases: ['复旦', 'fudan', 'fdu'], city: '上海', initial: '复', color: 'blue', club: '复旦猫猫同学会', intro: '一起收集光华楼下的小小故事。', campus: '邯郸校区', followers: 1092 },
      { id: 'tongji', name: '同济大学', short: '同济', aliases: ['同济', 'tongji', 'tj'], city: '上海', initial: '济', color: 'teal', club: '同济校园猫相册', intro: '四平路的风里，有猫猫晒太阳的味道。', campus: '四平路校区', followers: 845 }
    ];
    var cats = [
      { id: 'ju', name: '橘主任', schoolId: 'scut', image: 'ginger.jpg', gender: '男孩子', coat: '橘白', tags: ['图书馆常客', '慢热', '晒太阳选手'], intro: '总在图书馆附近慢慢散步。大家叫它主任，因为它每天都认真地“巡视”校园。请在远处打个招呼，给它留一点自己的空间。', area: '图书馆周边', joined: '2022年秋天', nickname: '主任 / 大橘', followers: 426 },
      { id: 'huahua', name: '花花', schoolId: 'scut', image: 'calico.jpg', gender: '女孩子', coat: '三花', tags: ['长椅主人', '镜头感满分', '喜欢安静'], intro: '树下的那张长椅，是花花最喜欢的午休地点。路过时放轻脚步，就能看见一颗软乎乎的小脑袋。', area: '校园绿地附近', joined: '2023年春天', nickname: '小花 / 长椅学姐', followers: 318 },
      { id: 'fantuan', name: '饭团', schoolId: 'sysu', image: 'tuxedo.jpg', gender: '男孩子', coat: '黑白', tags: ['窗边观察员', '高冷脸', '好奇心'], intro: '穿着小礼服的饭团，总喜欢在窗边观察经过的同学。别被它的严肃表情骗了，它只是看得很认真。', area: '教学楼附近', joined: '2021年冬天', nickname: '团团 / 小礼服', followers: 562 },
      { id: 'niangao', name: '年糕', schoolId: 'szu', image: 'ginger.jpg', gender: '男孩子', coat: '橘白', tags: ['荔园居民', '散步爱好者'], intro: '年糕走路慢悠悠，喜欢在树荫和阳光交界的地方打盹。', area: '校内步道附近', joined: '2023年夏天', nickname: '糕糕', followers: 267 },
      { id: 'yin', name: '银杏', schoolId: 'pku', image: 'calico.jpg', gender: '女孩子', coat: '三花', tags: ['秋日限定', '燕园散步家'], intro: '在一个银杏叶落满地的下午被大家认识，因此得到了这个名字。', area: '校园绿地附近', joined: '2022年秋天', nickname: '小杏', followers: 705 },
      { id: 'heimi', name: '黑米', schoolId: 'fdu', image: 'tuxedo.jpg', gender: '男孩子', coat: '黑白', tags: ['窗台学长', '表情管理大师'], intro: '黑米每天都在自己的窗边座位上，看着一届又一届同学走过。', area: '教学区附近', joined: '2020年春天', nickname: '米米 / 窗台学长', followers: 483 },
      { id: 'tangyuan', name: '汤圆', schoolId: 'tongji', image: 'calico.jpg', gender: '女孩子', coat: '三花', tags: ['四平路居民', '慢生活'], intro: '汤圆是一位很会享受午后阳光的小小同学。', area: '校园绿地附近', joined: '2023年秋天', nickname: '圆圆', followers: 294 }
    ];
    var events = [
      { id: 'cover', title: '谁是校园里的最佳上镜喵？', short: '本月校猫封面', subtitle: '把你镜头里的小小同学，送上校园封面。', type: 'photo', image: 'ginger.jpg', eyebrow: '校园猫猫摄影季', color: 'peach', start: t - 86400000 * 2, end: t + 86400000 * 7, scope: '全校联动', rules: ['投稿一张你拍摄的校园猫照片，关联学校与猫咪。', '每人可提交3份作品，每位用户对同一作品只能投1票，可取消。', '按学校筛选后可查看校内人气榜；榜单按有效票数排序。', '作品需为原创或已获授权，活动结束后继续保留在猫咪相册。'], reward: '电子纪念徽章 · 本期人气封面' },
      { id: 'exam', title: '萝卜？纸巾？猫猫期中考试！', short: '猫猫考试', subtitle: '会不会都没关系，每只猫都值得一句：真棒！', type: 'video', image: 'calico.jpg', eyebrow: '校猫趣味课堂', color: 'sage', start: t - 86400000, end: t + 86400000 * 12, scope: '全校联动', rules: ['上传校园猫的趣味互动视频，给考生写一句可爱的评语。', '顺其自然地记录，猫咪走开、发呆、睡觉都可以成为交卷方式。', '尊重猫咪意愿，随时结束互动，让它自由离开。', '不按猫咪的答对率或服从程度评奖，记录有趣瞬间即可。'], reward: '猫猫考生纪念卡 · 趣味视频精选' },
      { id: 'memory', title: '毕业前，再拍一次你', short: '校猫毕业纪念册', subtitle: '把来不及说的话，留在我们共同的相册里。', type: 'story', image: 'tuxedo.jpg', eyebrow: '校园记忆征集', color: 'lavender', start: t + 86400000 * 15, end: t + 86400000 * 35, scope: '全校联动', rules: ['征集校园猫照片与毕业留言。', '投稿作品将汇集为学校的校猫纪念册。'], reward: '电子纪念册 · 青春见证徽章' }
    ];
    var posts = [
      { id: 'p1', schoolId: 'scut', catId: 'ju', author: '今天也想吸猫', authorId: 'demo-a', title: '图书馆的编外管理员，今天也准时上班', body: '下午三点，橘主任又出现在老地方。看它认真巡视的样子，感觉我们才是来借书的客人。\n离远一点拍，也能收获一张可爱的照片。', image: 'ginger.jpg', category: '日常', likes: 328, saves: 46, createdAt: t - 3600000 * 2, official: false },
      { id: 'p2', schoolId: 'sysu', catId: 'fantuan', author: '中大校园猫观察站', authorId: 'demo-b', title: '饭团学长：这节课，我替你听了', body: '窗边的小礼服先生，已经连续三天来旁听了。今天的课堂观察记录：晒太阳五颗星，认真听课两分钟。', image: 'tuxedo.jpg', category: '日常', likes: 256, saves: 31, createdAt: t - 3600000 * 5, official: true },
      { id: 'p3', schoolId: 'scut', catId: 'huahua', author: '花花的摄影同学', authorId: 'demo-c', title: '学校最好看的秋天，被花花承包了', body: '没有刻意叫它看镜头，只是在旁边安静坐了一会儿。谢谢花花，送我一张今天最喜欢的照片。', image: 'calico.jpg', category: '照片', eventId: 'cover', likes: 219, saves: 54, createdAt: t - 3600000 * 6, official: false },
      { id: 'p4', schoolId: 'pku', catId: 'yin', author: '燕园散步日记', authorId: 'demo-d', title: '银杏树下，捡到一位毛茸茸的秋天', body: '叶子落了，银杏同学的午睡地点也换了。希望下一届同学，也能遇见这个温柔的下午。', image: 'calico.jpg', category: '故事', likes: 413, saves: 76, createdAt: t - 3600000 * 10, official: false },
      { id: 'p5', schoolId: 'szu', catId: 'niangao', author: '荔园慢半拍', authorId: 'demo-e', title: '年糕：今天的校园巡游，到此结束', body: '跟着它的步伐慢下来，才发现学校还有这么舒服的一角。', image: 'ginger.jpg', category: '日常', eventId: 'cover', likes: 167, saves: 23, createdAt: t - 3600000 * 3, official: false },
      { id: 'p6', schoolId: 'fdu', catId: 'heimi', author: '黑米观察员', authorId: 'demo-f', title: '毕业两年了，窗边的学长还在', body: '回学校的时候绕了一点路，又见到了它。那扇窗和午后的阳光，好像替我们保存了一部分学生时代。', image: 'tuxedo.jpg', category: '故事', likes: 287, saves: 89, createdAt: t - 3600000 * 12, official: false },
      { id: 'p7', schoolId: 'tongji', catId: 'tangyuan', author: '四平路的风', authorId: 'demo-g', title: '给汤圆拍一张，今日份校园封面', body: '不赶路的猫，和终于慢下来的我。', image: 'calico.jpg', category: '照片', eventId: 'cover', likes: 141, saves: 24, createdAt: t - 3600000 * 4, official: false },
      { id: 'p8', schoolId: 'scut', catId: 'ju', author: '华工猫猫守护社', authorId: 'demo-h', title: '新同学，认识一下我们的橘主任', body: '它有许多昵称，但每一个名字背后，都有一届同学留下的故事。欢迎在主页补充你和主任的相遇。\n本账号及内容为产品体验示例。', image: 'ginger.jpg', category: '故事', likes: 183, saves: 42, createdAt: t - 3600000 * 24, official: true }
    ].map(function (p) { p.status = 'approved'; p.mediaType = 'image'; p.comments = []; return p; });
    return { version: VERSION, schools: schools, cats: cats, events: events, posts: posts, entries: [{ id: 'e1', eventId: 'cover', postId: 'p3', votes: 128 }, { id: 'e2', eventId: 'cover', postId: 'p5', votes: 96 }, { id: 'e3', eventId: 'cover', postId: 'p7', votes: 87 }], user: { id: 'me', name: '校园漫游者', bio: '把每一次偶遇，写进校园的共同相册。' }, followingSchools: [], followingCats: [], likedPosts: [], savedPosts: [], votedEntries: [], notifications: [], draft: null };
  }
  function createStore(adapter, options) {
    options = options || {};
    var now = options.now || function () { return Date.now(); };
    var base = options.assetBase || '/assets/';
    var stored = adapter.read();
    var state = stored && stored.version === VERSION ? clone(stored) : seed(now());
    var needsDiaryUpgrade = state.diaryFeatureVersion !== 1;
    state = upgradeDiary(state, now());
    if (!stored || needsDiaryUpgrade) adapter.write(clone(state));
    function persist(next) { adapter.write(clone(next)); state = next; return true; }
    function mutate(fn) { var next = clone(state); var result = fn(next); persist(next); return result; }
    function asset(src) { if (!src) return ''; return /^(?:https?:|data:|blob:|wxfile:|cloud:|\/)/.test(src) ? src : base + src; }
    function schoolView(s) { if (!s) return null; var r = clone(s); r.followed = state.followingSchools.indexOf(s.id) >= 0; r.catCount = state.cats.filter(function (c) { return c.schoolId === s.id; }).length; return r; }
    function catView(c) { if (!c) return null; var r = clone(c); r.image = asset(c.image); r.school = schoolView(state.schools.find(function (s) { return s.id === c.schoolId; })); r.followed = state.followingCats.indexOf(c.id) >= 0; r.photoCount = state.posts.filter(function (p) { return p.catId === c.id && p.status === 'approved'; }).length; return r; }
    function eventView(e) { if (!e) return null; var r = clone(e); r.image = asset(e.image); r.status = now() < e.start ? 'upcoming' : now() > e.end ? 'ended' : 'active'; r.statusText = r.status === 'active' ? '进行中' : r.status === 'upcoming' ? '即将开始' : '已结束'; r.days = Math.max(0, Math.ceil((e.end - now()) / 86400000)); r.entryCount = state.entries.filter(function (x) { var p = state.posts.find(function (z) { return z.id === x.postId; }); return x.eventId === e.id && p && p.status === 'approved'; }).length; r.dateText = new Date(e.start).toISOString().slice(5, 10).replace('-', '.') + ' — ' + new Date(e.end).toISOString().slice(5, 10).replace('-', '.'); return r; }
    function timeText(t) { var m = Math.max(1, Math.floor((now() - t) / 60000)); return m < 60 ? m + '分钟前' : m < 1440 ? Math.floor(m / 60) + '小时前' : Math.floor(m / 1440) + '天前'; }
    function postView(p) { if (!p) return null; var r = clone(p); r.kind = p.kind || 'post'; r.hasMedia = !!(p.media || p.image); r.image = asset(p.image || (r.kind === 'diary' ? '' : 'ginger.jpg')); r.media = asset(p.media || p.image || (r.kind === 'diary' ? '' : 'ginger.jpg')); r.school = schoolView(state.schools.find(function (s) { return s.id === p.schoolId; })); r.cat = catView(state.cats.find(function (c) { return c.id === p.catId; })); r.event = eventView(state.events.find(function (e) { return e.id === p.eventId; })); r.liked = state.likedPosts.indexOf(p.id) >= 0; r.saved = state.savedPosts.indexOf(p.id) >= 0; r.timeText = timeText(p.createdAt); r.commentCount = p.comments.length; r.mine = p.authorId === state.user.id; return r; }
    function getPost(postId) { return postView(state.posts.find(function (p) { return p.id === postId && (p.status === 'approved' || p.authorId === state.user.id || state.user.isAdmin); })); }
    function notify(s, title, text) { s.notifications.unshift({ id: id('n'), title: title, text: text, createdAt: now(), read: false }); }
    function toggle(array, value) { var pos = array.indexOf(value); if (pos >= 0) { array.splice(pos, 1); return false; } array.push(value); return true; }
    function requirePost(s, postId) { var p = s.posts.find(function (x) { return x.id === postId && (x.status === 'approved' || x.authorId === s.user.id); }); if (!p) throw new Error('这篇帖子暂时无法查看'); return p; }
    function validateDiary(d) {
      if (!d.title || d.title.length > 48) throw new Error('请填写1—48字的日记标题');
      if (!d.body || d.body.length > 1500) throw new Error('请写下1—1500字的日记正文');
      if (!api.getSchool(d.schoolId)) throw new Error('请选择所属学校');
      if (!d.catId || !api.getCat(d.catId) || api.getCat(d.catId).schoolId !== d.schoolId) throw new Error('请选择这所学校的猫猫同学');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(d.diaryDate || '') || !Number.isFinite(Date.parse(d.diaryDate + 'T00:00:00Z')) || new Date(d.diaryDate + 'T00:00:00Z').toISOString().slice(0,10) !== d.diaryDate) throw new Error('请选择有效的记录日期');
      if (d.diaryDate > dayKey(now())) throw new Error('记录日期不能晚于今天，可以补写以前的相遇');
      if (d.weather && WEATHER.indexOf(d.weather) < 0) throw new Error('请选择有效的天气');
      if (d.mood && MOODS.indexOf(d.mood) < 0) throw new Error('请选择有效的心情');
      if (d.mediaType === 'video') throw new Error('日记支持文字与照片，视频可发布为校园帖子');
      if (d.eventId) throw new Error('日记单独收录，活动作品请使用校园投稿');
    }
    var api = {
      asset: asset,
      getRawState: function () { return clone(state); },
      replaceState: function (next) { if (!next || next.version !== VERSION) throw new Error('数据版本不兼容'); persist(clone(next)); },
      getSchools: function (query) { var q = (query || '').trim().toLowerCase(); return state.schools.filter(function (s) { return !q || [s.name, s.short, s.city].concat(s.aliases).some(function (x) { return x.toLowerCase().indexOf(q) >= 0; }); }).map(schoolView); },
      getSchool: function (schoolId) { return schoolView(state.schools.find(function (s) { return s.id === schoolId; })); },
      getCats: function (schoolId) { return state.cats.filter(function (c) { return !schoolId || c.schoolId === schoolId; }).map(catView); },
      getCat: function (catId) { return catView(state.cats.find(function (c) { return c.id === catId; })); },
      getEvents: function (status) { return state.events.map(eventView).filter(function (e) { return !status || status === 'all' || e.status === status; }); },
      getEvent: function (eventId) { return eventView(state.events.find(function (e) { return e.id === eventId; })); },
      getPost: getPost,
      getFeed: function (filters) {
        filters = filters || {};
        var rows = state.posts.filter(function (p) {
          if (filters.mine) { if (p.authorId !== state.user.id) return false; }
          else if (p.status !== 'approved') return false;
          if (filters.schoolId && p.schoolId !== filters.schoolId) return false;
          if (filters.catId && p.catId !== filters.catId) return false;
          if (filters.eventId && p.eventId !== filters.eventId) return false;
          if (filters.kind && p.kind !== filters.kind) return false;
          if (filters.month && (!p.diaryDate || p.diaryDate.slice(0,7) !== filters.month)) return false;
          if (filters.saved && state.savedPosts.indexOf(p.id) < 0) return false;
          if (filters.category && filters.category !== '全部' && (filters.category === '活动' ? !p.eventId : p.category !== filters.category)) return false;
          if (filters.official === true && !p.official) return false;
          if (filters.official === false && p.official) return false;
          if (filters.following && state.followingSchools.indexOf(p.schoolId) < 0 && state.followingCats.indexOf(p.catId) < 0) return false;
          return true;
        });
        function score(p) { return (p.likes + p.saves * 2 + p.comments.length * 3 + 12) / Math.pow(Math.max(0, (now() - p.createdAt) / 3600000) + 4, 0.65); }
        rows.sort(filters.latest || filters.mine ? function (a, b) { return b.createdAt - a.createdAt; } : function (a, b) { return score(b) - score(a); });
        if (!filters.schoolId && !filters.catId && !filters.mine && !filters.latest) {
          for (var i = 1; i < rows.length; i++) {
            if (rows[i - 1].schoolId === rows[i].schoolId) {
              var j = i + 1; while (j < rows.length && rows[j].schoolId === rows[i].schoolId) j++;
              if (j < rows.length) { var item = rows.splice(j, 1)[0]; rows.splice(i, 0, item); }
            }
          }
        }
        return rows.map(postView);
      },
      getDiaries: function (filters) { return api.getFeed(Object.assign({}, filters || {}, { kind: 'diary', latest: true })).sort(function (a,b) { return b.diaryDate.localeCompare(a.diaryDate) || b.createdAt - a.createdAt; }); },
      getDiaryMonths: function () { return api.getDiaries({ mine: false }).concat(api.getDiaries({ mine: true })).map(function (p) { return p.diaryDate.slice(0,7); }).filter(function (m,i,a) { return a.indexOf(m) === i; }).sort().reverse(); },
      followSchool: function (schoolId) { if (!api.getSchool(schoolId)) throw new Error('学校不存在'); return mutate(function (s) { var on = toggle(s.followingSchools, schoolId); var school = s.schools.find(function (x) { return x.id === schoolId; }); school.followers = Math.max(0, school.followers + (on ? 1 : -1)); return on; }); },
      followCat: function (catId) { if (!api.getCat(catId)) throw new Error('猫咪不存在'); return mutate(function (s) { var on = toggle(s.followingCats, catId); var cat = s.cats.find(function (x) { return x.id === catId; }); cat.followers = Math.max(0, cat.followers + (on ? 1 : -1)); return on; }); },
      likePost: function (postId) { return mutate(function (s) { var p = requirePost(s, postId); var on = toggle(s.likedPosts, postId); p.likes = Math.max(0, p.likes + (on ? 1 : -1)); return on; }); },
      savePost: function (postId) { return mutate(function (s) { var p = requirePost(s, postId); var on = toggle(s.savedPosts, postId); p.saves = Math.max(0, p.saves + (on ? 1 : -1)); return on; }); },
      comment: function (postId, text) { text = (text || '').trim(); if (!text || text.length > 300) throw new Error('请输入1—300字的评论'); return mutate(function (s) { var p = requirePost(s, postId); p.comments.push({ id: id('c'), author: s.user.name, text: text, createdAt: now() }); return true; }); },
      getEntries: function (eventId, schoolId) { return state.entries.filter(function (x) { var p = state.posts.find(function (z) { return z.id === x.postId; }); return x.eventId === eventId && p && p.status === 'approved' && (!schoolId || p.schoolId === schoolId); }).map(function (x) { return { id: x.id, votes: x.votes, voted: state.votedEntries.indexOf(x.id) >= 0, post: getPost(x.postId) }; }).sort(function (a, b) { return b.votes - a.votes; }); },
      vote: function (entryId) { return mutate(function (s) { var entry = s.entries.find(function (x) { return x.id === entryId; }); if (!entry) throw new Error('作品不存在'); var e = api.getEvent(entry.eventId); if (!e || e.status !== 'active') throw new Error('活动暂未开始或已结束'); var p = s.posts.find(function (x) { return x.id === entry.postId; }); if (!p || p.status !== 'approved') throw new Error('作品尚未通过审核'); var on = toggle(s.votedEntries, entryId); entry.votes = Math.max(0, entry.votes + (on ? 1 : -1)); return on; }); },
      publish: function (draft) {
        var d = clone(draft || {}); d.title = (d.title || '').trim(); d.body = (d.body || '').trim();
        if (!d.title || d.title.length > 48) throw new Error('请填写1—48字的标题');
        if (d.body.length > 1500) throw new Error('正文最多1500字');
        if (!api.getSchool(d.schoolId)) throw new Error('请选择所属学校');
        if (d.catId && (!api.getCat(d.catId) || api.getCat(d.catId).schoolId !== d.schoolId)) throw new Error('请选择该学校的猫咪，或标记待辨认');
        if (d.kind === 'diary') validateDiary(d);
        else if (!d.media) throw new Error('请添加一张照片或一段视频');
        if (d.eventId) { var e = api.getEvent(d.eventId); if (!e || e.status !== 'active') throw new Error('该活动暂时无法投稿'); if (e.type === 'video' && d.mediaType !== 'video') throw new Error('猫猫考试活动需要上传视频'); if (e.type === 'photo' && d.mediaType === 'video') throw new Error('照片打榜活动需要上传照片'); if (state.posts.filter(function (p) { return p.eventId === d.eventId && p.authorId === state.user.id && p.status !== 'rejected'; }).length >= 3) throw new Error('每个活动最多投稿3份作品'); }
        return mutate(function (s) {
          var p = { id: id('post'), schoolId: d.schoolId, catId: d.catId || '', eventId: d.eventId || '', title: d.title, body: d.body, media: d.media, image: d.mediaType === 'video' ? 'calico.jpg' : d.media, mediaType: d.mediaType === 'video' ? 'video' : 'image', category: d.eventId ? '活动' : (d.category || '日常'), author: s.user.name, authorId: s.user.id, official: false, status: 'pending', likes: 0, saves: 0, createdAt: now(), comments: [] };
          p.kind = d.kind === 'diary' ? 'diary' : 'post';
          if (p.kind === 'diary') { p.diaryDate = d.diaryDate; p.weather = d.weather || ''; p.mood = d.mood || ''; p.category = '日记'; p.media = d.media || ''; p.image = d.media || ''; }
          s.posts.unshift(p); if (p.eventId) s.entries.push({ id: id('entry'), eventId: p.eventId, postId: p.id, votes: 0 }); s.draft = null;
          notify(s, p.kind === 'diary' ? '日记已收好' : '投稿已收好', '《' + p.title + '》已进入待审核列表，可在“我的发布”查看。'); return p.id;
        });
      },
      updateDiary: function (postId, draft) {
        var d = clone(draft || {}); d.title = (d.title || '').trim(); d.body = (d.body || '').trim(); validateDiary(d);
        return mutate(function (s) {
          var p = s.posts.find(function (x) { return x.id === postId && x.kind === 'diary' && x.authorId === s.user.id; });
          if (!p) throw new Error('只能编辑自己写下的日记');
          ['title','body','schoolId','catId','diaryDate'].forEach(function (key) { p[key] = d[key]; });
          p.weather = d.weather || ''; p.mood = d.mood || ''; p.media = d.media || ''; p.image = d.media || ''; p.mediaType = 'image'; p.status = 'pending'; p.updatedAt = now(); s.draft = null;
          notify(s, '日记更新已收好', '《' + p.title + '》已保存，等待重新收录。'); return p.id;
        });
      },
      review: function (postId, approve) { return mutate(function (s) { var p = s.posts.find(function (x) { return x.id === postId; }); if (!p || p.status !== 'pending') throw new Error('这份投稿已处理'); p.status = approve ? 'approved' : 'rejected'; notify(s, approve ? '作品已收录' : '投稿需调整', '《' + p.title + '》' + (approve ? '已加入校园共同相册。' : '未通过本次审核，请调整后重新投稿。')); return true; }); },
      saveDraft: function (draft) { return mutate(function (s) { s.draft = clone(draft); }); },
      getDraft: function () { return clone(state.draft); },
      updateProfile: function (name, bio) { name = (name || '').trim(); bio = (bio || '').trim(); if (!name || name.length > 20) throw new Error('昵称需要1—20字'); if (bio.length > 80) throw new Error('简介最多80字'); mutate(function (s) { s.user.name = name; s.user.bio = bio; s.posts.forEach(function (p) { if (p.authorId === s.user.id) p.author = name; }); }); },
      getProfile: function () { var r = clone(state.user); r.schoolCount = state.followingSchools.length; r.catCount = state.followingCats.length; r.postCount = state.posts.filter(function (p) { return p.authorId === state.user.id; }).length; r.savedCount = state.savedPosts.length; r.followingSchools = state.followingSchools.map(api.getSchool); r.followingCats = state.followingCats.map(api.getCat); r.pendingCount = state.posts.filter(function (p) { return p.status === 'pending' && p.authorId === state.user.id; }).length; return r; },
      getNotifications: function () { return state.notifications.map(function (n) { var r = clone(n); r.timeText = timeText(n.createdAt); return r; }); },
      readNotifications: function () { mutate(function (s) { s.notifications.forEach(function (n) { n.read = true; }); }); },
      reset: function () { persist(upgradeDiary(seed(now()), now())); }
    };
    return api;
  }
  return { VERSION: VERSION, seed: seed, createStore: createStore, dayKey: dayKey, WEATHER: WEATHER, MOODS: MOODS };
}));
