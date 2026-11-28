# pwhc Personal Website

我的個人網站，整理圖論研究、資安專題、競賽，以及在資研社的經驗。
網站使用原生 HTML、CSS 和 JavaScript 製作，沒有使用前端框架或建置工具。

## 網站內容

- **Projects**：披薩圖研究、AIS3 電子書安全研究、資安競賽與資研社相關經驗，支援分類瀏覽及作品詳細介紹。
- **Pizza Graph**：互動式披薩圖，可以移除頂點，觀察剩餘圖是否存在漢密頓圈。
- **Terminal**：模擬終端機，可使用 `ls`、`cd`、`cat`、`tree`、`grep` 等指令瀏覽內容，也能透過 `open` 開啟作品或 HackMD。
- **Contact Card**：可開啟個人名片並複製文字內容。

## 專案結構

```text
.
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── styles.css
    └── js/
        ├── main.js
        ├── graph.js
        ├── projects.js
        ├── terminal.js
        └── data/
            ├── projects-data.js
            └── terminal-data.js
```

## 本機預覽

下載或 clone 專案後，直接用瀏覽器開啟 `index.html` 即可，不需要額外安裝套件。
也可以用 VS Code 的 Live Server 預覽。