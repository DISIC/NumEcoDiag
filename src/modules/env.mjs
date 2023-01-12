// Makes NumÉcoDiag cross browser as webExtension (no server required)
export const env = window.browser === undefined ? window.chrome : window.browser;