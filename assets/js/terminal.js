let cwd = '/',
    history = [],
    historyPos = 0;
const consoleOutput = $('#console-output'),
    cmdInput = $('#console-command');
const displayPath = () => cwd === '/' ? '~' : '~' + cwd;
const updatePrompt = () => $('#terminal-prompt').textContent = `claire@site:${displayPath()}$`;
const normalizePath = raw => {
    if (!raw || raw === '~') return '/';
    let parts = raw.startsWith('/') ? [] : (cwd === '/' ? [] : cwd.split('/').filter(Boolean));
    for (const p of raw.replace(/^~\/?/, '/').split('/')) {
        if (!p || p === '.') continue;
        if (p === '..') parts.pop();
        else parts.push(p);
    }
    return '/' + parts.join('/');
};

function appendConsole(cmd, answer) {
    const prompt = document.createElement('p');
    prompt.className = 'console-line';
    const prefix = document.createElement('span');
    prefix.className = 'console-prompt';
    prefix.textContent = `claire@site:${displayPath()}$ `;
    prompt.append(prefix, document.createTextNode(cmd));
    consoleOutput.append(prompt);
    if (answer !== null && answer !== undefined) {
        const out = document.createElement('p');
        out.className = 'console-line console-answer';
        out.textContent = answer;
        consoleOutput.append(out);
    }
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function listDir(p) {
    return [...files[p].dirs.map(s => s + '/'), ...Object.keys(files[p].files)].join('    ');
}

function runCommand(raw) {
    const value = raw.trim();
    if (!value) return;
    const [verb, ...args] = value.split(/\s+/), command = verb.toLowerCase(), arg = args.join(' ');
    if (command === 'clear') {
        consoleOutput.replaceChildren();
        history.push(value);
        historyPos = history.length;
        return;
    }
    const before = displayPath();
    let reply;
    switch (command) {
        case 'help':
            reply =
                '檔案瀏覽\n  ls [路徑]             查看目錄\n  cd [目錄]             切換位置（可 cd ..）\n  cat <檔名>            打開文字檔\n  tree                  顯示資料夾結構\n\n網站操作\n  open pizza|hyread|ctf|club   開啟作品\n  open hackmd           開啟 HackMD 筆記\n  graph                 跳到首頁圖論互動\n  bio                   打開可複製的名片\n\n其他\n  pwd / whoami / history / clear\n  grep <字詞>           搜尋所有文字檔\n  ↑ ↓  瀏覽輸入歷史；TAB 補全檔名';
            break;
        case 'pwd':
            reply = cwd;
            break;
        case 'whoami':
            reply = 'Claire Pan / 潘維希\n高中生，正在研究圖論，也對資安、程式與教學很有興趣。';
            break;
        case 'ls': {
            const dest = arg ? normalizePath(arg) : cwd;
            reply = files[dest] ? listDir(dest) : `ls: 找不到目錄 ${arg}`;
            break;
        }
        case 'cd': {
            const dest = normalizePath(arg);
            if (files[dest]) {
                cwd = dest;
                reply = null;
            } else reply = `cd: 沒有這個資料夾 ${arg}`;
            break;
        }
        case 'cat': {
            const path = normalizePath(arg),
                folder = path.slice(0, path.lastIndexOf('/')) || '/',
                file = path.slice(path.lastIndexOf('/') + 1);
            reply = files[folder]?.files[file] ?? (arg ? 'cat: 找不到這個檔案。先試試 ls。' : 'cat: 請輸入檔名。');
            break;
        }
        case 'tree':
            reply =
                '~\n├── README.md\n├── about/\n│   ├── claire.txt\n│   └── learning.txt\n├── projects/\n│   ├── pizza.txt\n│   ├── hyread.txt\n│   ├── ctf.txt\n│   └── club.txt\n└── notes/\n    ├── unfinished.txt\n    ├── reading.txt\n    └── todo.txt';
            break;
        case 'grep': {
            if (!arg) {
                reply = 'grep: 請輸入想搜尋的字詞，例如 grep 漢密頓';
                break;
            }
            const found = [];
            for (const [dir, obj] of Object.entries(files))
                for (const [name, content] of Object.entries(obj.files)) {
                    if (content.toLowerCase().includes(arg.toLowerCase())) found.push(`${dir==='/'?'':dir}/${name}`);
                }
            reply = found.length ? found.join('\n') : `找不到「${arg}」，換個關鍵字試試。`;
            break;
        }
        case 'history':
            reply = history.slice(-12).map((x, i) => `${history.length-Math.min(history.length,12)+i+1}  ${x}`).join(
                '\n') || '還沒有指令紀錄';
            break;
        case 'bio':
            reply = '已打開名片。可以查看，也可以複製文字。';
            break;
        case 'graph':
            reply = '已跳到首頁圖論互動；點圖上的數字就能試著移除頂點。';
            break;
        case 'open':
            reply = arg === 'hackmd' ? '已在新分頁開啟 HackMD。' : (['pizza', 'hyread', 'ctf', 'club'].includes(arg) ?
                `已打開 ${arg} 的研究／經歷頁面。` : 'open: 可以使用 pizza、hyread、ctf、club 或 hackmd');
            break;
        case 'ping':
            reply =
                'PING claire.local (127.0.0.1)\n64 bytes: still working on the proof\n64 bytes: check the edge cases\n64 bytes: try another approach';
            break;
        case 'fortune': {
            const quotes = ['「程式能快速協助探索可能成立的規律，而數學要處理的是這些規律為什麼成立。」', '「自己學會」和「能讓別人理解」是兩件不同的事。', '不是每個研究結果都能一次證對。'];
            reply = quotes[history.filter(x => x.toLowerCase() === 'fortune').length % quotes.length];
            break;
        }
        default:
            reply = `${command}: 找不到這個指令。輸入 help 看看可以做什麼。`;
    }
    // Render command in the folder where it was issued, then optionally update the prompt.
    const originalCwd = cwd;
    if (command === 'cd' && reply === null) {
        cwd = before === '~' ? '/' : before.slice(1);
        appendConsole(value, null);
        cwd = originalCwd;
    } else appendConsole(value, reply);
    history.push(value);
    historyPos = history.length;
    updatePrompt();
    if (command === 'bio') openBio();
    if (command === 'open' && arg === 'hackmd') window.open('https://hackmd.io/@pwhc', '_blank', 'noopener,noreferrer');
    if (command === 'open' && ['pizza', 'hyread', 'ctf', 'club'].includes(arg)) {
        $('#case-dialog').showModal();
        renderCase(arg);
        document.body.style.overflow = 'hidden';
    }
    if (command === 'graph') $('#top').scrollIntoView({
        behavior: 'smooth'
    });
}
$('#console-form').addEventListener('submit', e => {
    e.preventDefault();
    runCommand(cmdInput.value);
    cmdInput.value = '';
});
$$('.cmd').forEach(b => b.addEventListener('click', () => {
    runCommand(b.dataset.command);
    cmdInput.focus();
}));
cmdInput.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyPos > 0) historyPos--;
        cmdInput.value = history[historyPos] || '';
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyPos < history.length) historyPos++;
        cmdInput.value = history[historyPos] || '';
    } else if (e.key === 'Tab') {
        const parts = cmdInput.value.split(/\s+/);
        const verb = parts[0];
        if (!['cat', 'cd', 'ls'].includes(verb) || parts.length > 2) return;
        e.preventDefault();
        const needle = parts[1] || '';
        const options = verb === 'cd' ? ['..', ...files[cwd].dirs] : [...files[cwd].dirs, ...Object.keys(files[
            cwd].files)];
        const match = options.filter(name => name.toLowerCase().startsWith(needle.toLowerCase()));
        if (match.length === 1) cmdInput.value = verb + ' ' + match[0];
        else if (match.length > 1) toast('候選：' + match.join(' / '));
    }
});
document.addEventListener('keydown', e => {
    if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !['INPUT', 'TEXTAREA'].includes(document
            .activeElement.tagName) && !$('#case-dialog').open && !bioDialog.open) {
        e.preventDefault();
        cmdInput.focus();
    }
});
updatePrompt();