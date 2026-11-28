const projectOrder = Object.keys(projects);
let currentProject = 'pizza';

function renderCase(key) {
    currentProject = key;
    const p = projects[key];
    $('#dialog-number').textContent = p.number;
    $('#dialog-title').textContent = p.title;
    $('#dialog-lead').textContent = p.lead;
    $('#dialog-role').textContent = p.role;
    const list = $('#dialog-highlights');
    list.replaceChildren();
    p.highlights.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        list.append(li);
    });
}
$$('.work-button').forEach(btn => btn.addEventListener('click', () => {
    renderCase(btn.dataset.project);
    $('#case-dialog').showModal();
    document.body.style.overflow = 'hidden';
}));
const closeDialog = () => {
    $('#case-dialog').close();
    document.body.style.overflow = '';
};
$('#dialog-close').addEventListener('click', closeDialog);
$('#case-dialog').addEventListener('click', e => {
    if (e.target === $('#case-dialog')) closeDialog();
});
$('#case-dialog').addEventListener('close', () => {
    document.body.style.overflow = '';
});
$('#dialog-next').addEventListener('click', () => renderCase(projectOrder[(projectOrder.indexOf(currentProject) + 1) %
    projectOrder.length]));
$('#dialog-prev').addEventListener('click', () => renderCase(projectOrder[(projectOrder.indexOf(currentProject) +
    projectOrder.length - 1) % projectOrder.length]));
$$('.filter').forEach(button => button.addEventListener('click', () => {
    $$('.filter').forEach(b => {
        b.classList.toggle('active', b === button);
        b.setAttribute('aria-pressed', String(b === button));
    });
    const f = button.dataset.filter;
    $$('.work-item').forEach(card => card.hidden = f !== 'all' && card.dataset.category !== f);
}));
// A tiny read-only virtual filesystem. Command parsing is local, no eval or network operations.