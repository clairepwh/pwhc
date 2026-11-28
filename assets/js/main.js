'use strict';
/* PUBLISHING CONFIG — 公開版沒有自動放入申請文件中的私人聯絡資訊。 */
const SITE = {
    name: 'Claire Pan',
    email: '', // 自行決定是否要公開 Email
    description: 'Claire Pan（潘維希）\n北一女中數理資優班\n圖論研究 / 資訊安全 / 程式設計\n資訊研習社第 39 屆社長、學術網管與講師\nTechGiCS / AIS3 / 數學科展'
};
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
const toast = (message) => {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('visible');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('visible'), 2700);
};
$('#copyright-year').textContent = new Date().getFullYear();
if (SITE.email && /^\S+@\S+\.\S+$/.test(SITE.email)) {
    const contact = $('#contact-link');
    contact.hidden = false;
    contact.href = `mailto:${SITE.email}?subject=${encodeURIComponent('Hello, Claire!')}`;
    $('#contact-note').textContent = 'EMAIL / ' + SITE.email;
    SITE.description += '\nEmail: ' + SITE.email;
}
const bioDialog = $('#bio-dialog');
const openBio = () => {
    bioDialog.showModal();
    document.body.classList.add('modal-open');
};
const closeBio = () => {
    bioDialog.close();
    document.body.classList.remove('modal-open');
};
$('#copy-bio').addEventListener('click', openBio);
$('#bio-dialog-close').addEventListener('click', closeBio);
bioDialog.addEventListener('click', e => {
    if (e.target === bioDialog) closeBio();
});
bioDialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
$('#copy-bio-text').addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(SITE.description);
        toast('名片文字已複製');
    } catch {
        const ta = document.createElement('textarea');
        ta.value = SITE.description;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.append(ta);
        ta.select();
        const ok = document.execCommand('copy');
        ta.remove();
        toast(ok ? '名片文字已複製' : '複製失敗，請改用 HTTPS 網址開啟。');
    }
});
// Navigation, scroll indicator, reveals.
const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    $('#progress').style.width = `${Math.min(100, max ? scrollY / max * 100 : 0)}%`;
};
document.addEventListener('scroll', updateProgress, {
    passive: true
});
updateProgress();
$('#menu-toggle').addEventListener('click', () => {
    const nav = $('#navigation'),
        open = nav.classList.toggle('open');
    $('#menu-toggle').setAttribute('aria-expanded', String(open));
    $('#menu-toggle').textContent = open ? '×' : '≡';
});
$$('.nav a').forEach(a => a.addEventListener('click', () => {
    $('#navigation').classList.remove('open');
    $('#menu-toggle').setAttribute('aria-expanded', 'false');
    $('#menu-toggle').textContent = '≡';
}));
if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
        }
    }), {
        threshold: .06,
        rootMargin: '0px 0px -18px 0px'
    });
    $$('[data-reveal]').forEach(node => obs.observe(node));
} else $$('[data-reveal]').forEach(node => node.classList.add('revealed'));