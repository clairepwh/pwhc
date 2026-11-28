const n = 11,
    stepSet = [1, 2, 3];
const pts = Array.from({
    length: n
}, (_, i) => {
    const theta = -Math.PI / 2 + 2 * Math.PI * i / n;
    return {
        x: 300 + 194 * Math.cos(theta),
        y: 284 + 194 * Math.sin(theta)
    };
});
const pairs = [],
    neighbor = Array.from({
        length: n
    }, () => []);
for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
        if (stepSet.some(k => j - i === k || n - (j - i) === k)) {
            pairs.push([i, j]);
            neighbor[i].push(j);
            neighbor[j].push(i);
        }
const removed = new Set();
let activeHover = -1;

function findCycle() {
    const active = Array.from({
        length: n
    }, (_, i) => i).filter(i => !removed.has(i));
    if (active.length < 3) return null;
    const start = active[0],
        used = new Set([start]),
        route = [start];

    function walk(u) {
        if (route.length === active.length) return neighbor[u].includes(start) ? route.slice() : null;
        const candidates = neighbor[u].filter(v => !removed.has(v) && !used.has(v)).sort((a, b) => {
            const degree = x => neighbor[x].filter(k => !removed.has(k) && !used.has(k)).length;
            return degree(a) - degree(b);
        });
        for (const v of candidates) {
            used.add(v);
            route.push(v);
            const result = walk(v);
            if (result) return result;
            route.pop();
            used.delete(v);
        }
        return null;
    }
    return walk(start);
}

function toggleNode(i) {
    if (removed.has(i)) removed.delete(i);
    else removed.add(i);
    drawGraph();
}

function drawGraph() {
    const edgeG = $('#graph-edges'),
        cycleG = $('#graph-cycle'),
        nodeG = $('#graph-nodes');
    edgeG.replaceChildren();
    cycleG.replaceChildren();
    nodeG.replaceChildren();
    const ns = 'http://www.w3.org/2000/svg',
        cycle = findCycle();
    for (const [i, j] of pairs) {
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', pts[i].x);
        line.setAttribute('y1', pts[i].y);
        line.setAttribute('x2', pts[j].x);
        line.setAttribute('y2', pts[j].y);
        line.setAttribute('class', 'edge' + (removed.has(i) || removed.has(j) ? ' hidden' : ''));
        line.dataset.a = i;
        line.dataset.b = j;
        edgeG.append(line);
    }
    if (cycle) {
        const route = [...cycle, cycle[0]];
        const line = document.createElementNS(ns, 'polyline');
        line.setAttribute('points', route.map(i => `${pts[i].x},${pts[i].y}`).join(' '));
        line.setAttribute('class', 'ham-cycle');
        cycleG.append(line);
        // Starting marker helps visitors understand where the loop starts and ends.
        const dot = document.createElementNS(ns, 'circle');
        dot.setAttribute('cx', pts[cycle[0]].x);
        dot.setAttribute('cy', pts[cycle[0]].y);
        dot.setAttribute('r', 26);
        dot.setAttribute('class', 'start-ring');
        cycleG.append(dot);
    }
    for (let i = 0; i < n; i++) {
        const g = document.createElementNS(ns, 'g');
        g.setAttribute('class', 'g-node' + (removed.has(i) ? ' disabled' : '') + (i === activeHover ? ' focused' : ''));
        g.setAttribute('role', 'button');
        g.setAttribute('aria-label', `頂點 ${i}，${removed.has(i)?'已移除，按下可復原':'仍存在，按下可移除'}`);
        g.setAttribute('tabindex', '0');
        const c = document.createElementNS(ns, 'circle');
        c.setAttribute('cx', pts[i].x);
        c.setAttribute('cy', pts[i].y);
        c.setAttribute('r', 18);
        c.setAttribute('fill', removed.has(i) ? '#e7e4da' : '#f1efe8');
        c.setAttribute('stroke', '#252720');
        c.setAttribute('stroke-width', '1.4');
        const label = document.createElementNS(ns, 'text');
        label.setAttribute('x', pts[i].x);
        label.setAttribute('y', pts[i].y + 1);
        label.textContent = i;
        g.append(c, label);
        g.addEventListener('mouseenter', () => {
            activeHover = i;
            updateEdges();
        });
        g.addEventListener('mouseleave', () => {
            activeHover = -1;
            updateEdges();
        });
        g.addEventListener('focus', () => {
            activeHover = i;
            updateEdges();
        });
        g.addEventListener('blur', () => {
            activeHover = -1;
            updateEdges();
        });
        g.addEventListener('click', () => toggleNode(i));
        g.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleNode(i);
            }
        });
        nodeG.append(g);
    }
    const remain = n - removed.size;
    $('#graph-status').textContent = cycle ? '✓ 還有漢密頓圈' : '× 找不到漢密頓圈';
    $('#graph-status').style.color = cycle ? '#3454ee' : '#b44b2d';
    $('#graph-count').textContent = `剩下 ${remain} 個頂點 · 移除 ${removed.size} 個`;
    $('#graph-reading').textContent = cycle ? `藍線順序：${[...cycle,cycle[0]].join(' → ')}` : (remain < 3 ? '剩下的點不足以構成圈。' :
        '程式已檢查這個例子，無法走過每個剩餘頂點後回到起點。');
    $('#graph-instruction').textContent = removed.size ? 'CLICK A GRAY NODE TO RESTORE IT' :
        'CLICK ANY VERTEX TO REMOVE IT';
    updateEdges();
}

function updateEdges() {
    $$('#graph-edges .edge').forEach(line => {
        const i = +line.dataset.a,
            j = +line.dataset.b;
        line.classList.toggle('highlight', !removed.has(i) && !removed.has(j) && (i === activeHover || j ===
            activeHover));
    });
    $$('#graph-nodes .g-node').forEach((g, i) => g.classList.toggle('focused', i === activeHover));
}
$('#graph-fault').addEventListener('click', () => {
    removed.clear();
    [0, 3, 7].forEach(i => removed.add(i));
    activeHover = -1;
    drawGraph();
});
$('#graph-fault-five').addEventListener('click', () => {
    removed.clear();
    [0, 1, 2, 4, 5].forEach(i => removed.add(i));
    activeHover = -1;
    drawGraph();
});
$('#graph-reset').addEventListener('click', () => {
    removed.clear();
    activeHover = -1;
    drawGraph();
});
drawGraph();
// A separate static graph illustration for the research case visual.
const decorative = $('#decor-graph'),
    svgNS = 'http://www.w3.org/2000/svg';
const dpts = Array.from({
    length: 13
}, (_, i) => ({
    x: 250 + 205 * Math.cos(-Math.PI / 2 + 2 * Math.PI * i / 13),
    y: 250 + 205 * Math.sin(-Math.PI / 2 + 2 * Math.PI * i / 13)
}));
for (let i = 0; i < 13; i++)
    for (let j = i + 1; j < 13; j++)
        if ([1, 2, 3].includes(j - i) || [1, 2, 3].includes(13 - (j - i))) {
            const line = document.createElementNS(svgNS, 'line');
            line.setAttribute('x1', dpts[i].x);
            line.setAttribute('y1', dpts[i].y);
            line.setAttribute('x2', dpts[j].x);
            line.setAttribute('y2', dpts[j].y);
            line.setAttribute('stroke', '#bddb94');
            line.setAttribute('stroke-opacity', '.36');
            line.setAttribute('stroke-width', '1.2');
            decorative.append(line);
        }
dpts.forEach(({
    x,
    y
}) => {
    const c = document.createElementNS(svgNS, 'circle');
    c.setAttribute('cx', x);
    c.setAttribute('cy', y);
    c.setAttribute('r', 4);
    c.setAttribute('fill', '#d7ea7a');
    decorative.append(c);
});