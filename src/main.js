// src/main.js

// Atualiza o preview ao digitar
const codeInput = document.getElementById('codeInput');
const codeOutput = document.getElementById('codeOutput');
const codePreview = document.getElementById('codePreview');
const themeSelect = document.getElementById('themeSelect');
const exportBtn = document.getElementById('exportBtn');
const langSelect = document.getElementById('langSelect');
const prismTheme = document.getElementById('prismTheme');

const prismThemes = {
    tomorrow: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css', // Mac
    vsc: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-vsc-dark-plus.min.css', // VSCode
    okaidia: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-okaidia.min.css',
    coy: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-coy.min.css',
    solarizedlight: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-solarizedlight.min.css',
    default: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css',
    dracula: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-dracula.min.css',
    nord: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-nord.min.css',
    'night-owl': 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-night-owl.min.css',
    material: 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-material-oceanic.min.css',
};

function updatePreview() {
    codeOutput.textContent = codeInput.value;
    codeOutput.className = 'language-' + langSelect.value;
    if (typeof Prism !== 'undefined') {
        Prism.highlightElement(codeOutput);
    }
}

codeInput.addEventListener('input', updatePreview);
langSelect.addEventListener('change', function() {
    // Carrega linguagem do Prism dinamicamente se necessário
    loadPrismLanguage(langSelect.value, updatePreview);
});
themeSelect.addEventListener('change', function() {
    const theme = themeSelect.value;
    prismTheme.href = prismThemes[theme] || prismThemes.tomorrow;
    // Troca aparência do preview para claro/escuro
    if (theme === 'solarizedlight' || theme === 'coy' || theme === 'default') {
        codePreview.className = 'code-preview light';
    } else {
        codePreview.className = 'code-preview dark';
    }
    updatePreview();
});

// Inicializa preview e tema padrão
updatePreview();

// Exporta o preview como imagem usando html2canvas
exportBtn.addEventListener('click', function() {
    // Carrega html2canvas dinamicamente se não existir
    if (typeof html2canvas === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        script.onload = exportImage;
        document.body.appendChild(script);
    } else {
        exportImage();
    }
});

function exportImage() {
    // Esconde tooltips, loaders e controles temporariamente
    const controlsPanel = document.getElementById('controlsPanel');
    const tooltip = document.getElementById('tooltip');
    const loader = document.getElementById('loader');
    if (controlsPanel) controlsPanel.style.visibility = 'hidden';
    if (tooltip) tooltip.style.visibility = 'hidden';
    if (loader) loader.style.visibility = 'hidden';

    // Seleciona apenas o bloco <pre> para exportar
    const pre = codePreview.querySelector('pre');
    const theme = themeSelect.value;
    // Mapear temas claros e escuros
    const lightThemes = ['solarizedlight', 'coy', 'default'];
    const darkThemes = ['tomorrow','vsc','okaidia','dracula','nord','night-owl','material'];
    let bgColor = '#23272e';
    if (lightThemes.includes(theme)) bgColor = '#f8f8fa';
    if (theme === 'dracula') bgColor = '#282a36';
    if (theme === 'nord') bgColor = '#2e3440';
    if (theme === 'night-owl') bgColor = '#011627';
    if (theme === 'material') bgColor = '#263238';
    const oldBg = pre.style.background;
    pre.style.background = bgColor;

    setTimeout(() => {
        html2canvas(pre, {
            backgroundColor: bgColor,
            useCORS: true,
            scale: window.devicePixelRatio || 2
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'codigo.png';
            link.href = canvas.toDataURL();
            link.click();
            // Restaura visual
            pre.style.background = oldBg;
            if (controlsPanel) controlsPanel.style.visibility = '';
            if (tooltip) tooltip.style.visibility = '';
            if (loader) loader.style.visibility = '';
        });
    }, 150);
}

// Carrega Prism.js para realce de sintaxe e plugins
(function loadPrism() {
    if (typeof Prism === 'undefined') {
        const prismJs = document.createElement('script');
        prismJs.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js';
        prismJs.onload = () => {
            // Carrega plugin de numeração de linhas
            const lineNumbers = document.createElement('script');
            lineNumbers.src = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.min.js';
            document.body.appendChild(lineNumbers);
            // Carrega CSS do plugin
            const lineNumbersCss = document.createElement('link');
            lineNumbersCss.rel = 'stylesheet';
            lineNumbersCss.href = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/line-numbers/prism-line-numbers.min.css';
            document.head.appendChild(lineNumbersCss);
            // Carrega linguagens iniciais
            loadPrismLanguage(langSelect.value, updatePreview);
        };
        document.body.appendChild(prismJs);
    }
})();

// Carrega dinamicamente a linguagem do Prism.js
function loadPrismLanguage(lang, cb) {
    if (typeof Prism === 'undefined') return;
    if (Prism.languages[lang]) { if(cb) cb(); return; }
    const script = document.createElement('script');
    script.src = `https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-${lang}.min.js`;
    script.onload = cb;
    document.body.appendChild(script);
}
