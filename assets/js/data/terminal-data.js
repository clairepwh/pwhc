const files = {
    '/': {
        dirs: ['about', 'projects', 'notes'],
        files: {
            'README.md': '嗨，我是 Claire。\n這裡放的是圖論研究、資安專題、競賽與社團工作。\n\n先試著輸入 ls，再用 cd 去其他目錄。\n也可以輸入 bio 直接查看名片。'
        }
    },
    '/about': {
        dirs: [],
        files: {
            'claire.txt': '北一女中數理資優班。\n喜歡數學、資訊安全、程式設計，也曾擔任資訊研習社社長、網管和講師。\n最常想的是：這個結論為什麼成立？',
            'learning.txt': '最初我寫的是最小生成樹小論文，後來進入圖論研究。\n在資安上，從 CTF 題目慢慢接觸到實際系統分析。\n我也喜歡英文辯論，因為查資料和論證都很有趣。'
        }
    },
    '/projects': {
        dirs: [],
        files: {
            'pizza.txt': '披薩圖 / Graph Theory\n我們自己構造的圖種。研究漢密頓圈、點容錯、邊容錯與多層結構。\n我主要負責偶數級與多層偶數級的證明。\n想直接看首頁互動圖？輸入 graph。',
            'hyread.txt': 'AIS3 / eBook Security\n團隊分析 HyRead 桌面版與網頁版的運作、儲存及驗證方式。\n我負責桌面端相關研究。專題獲得最佳專題，問題也通報給書商。',
            'ctf.txt': '2025  MyFirstCTF 銅質獎\n2025  GiCS 資安闖天關優勝\n2026  TechGiCS 資安闖天關第一名（隊長）\n\n平常也會在 CyLab / PortSwigger / OverTheWire 練習。',
            'club.txt': '資訊研習社第 39 屆社長、學術網管、講師。\n上過的社課包括 C++、Git/GitHub、Web 安全等。\n也負責社團伺服器維護，籌辦建北電資聯合暑訓。'
        }
    },
    '/notes': {
        dirs: [],
        files: {
            'unfinished.txt': '研究日誌 / 沒有句點\n「我們以為列舉的情形已經包含所有可能」——後來發現沒有。\n有些證明得回頭改，有些結論則還想再推進。\n做研究最常見的狀況，好像就是繼續改。',
            'reading.txt': '遇到陌生的技術問題，直接去找英文文件、論文和原始資料。\n寫完程式要測試；寫完證明也要檢查；準備好一堂課還得想第一次聽的人會不會懂。',
            'todo.txt': '[ ] 一般二層披薩圖的更完整情形\n[ ] 多層結構繼續研究\n[ ] 把未整理完的 writeup 整理好\n[x] 再換一個角度看問題'
        }
    }
};