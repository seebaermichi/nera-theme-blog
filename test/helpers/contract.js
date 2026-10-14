// The theme's contract as ROADMAP-themes.md states it (§S2, §S4), in one
// place for the tests.

export const VIEWS = [
    'layouts/layout.pug',
    'partials/head.pug',
    'partials/tokens.pug',
    'partials/helpers.pug',
    'partials/header.pug',
    'partials/lang-switch.pug',
    'partials/footer.pug',
    'partials/scripts.pug',
    // extra partials the theme adds, contract too (README)
    'partials/page-header.pug',
    'partials/post-card.pug',
]

export const SEAMS = [
    'partials/head-extra.pug',
    'partials/nav-main.pug',
    'partials/footer-extra.pug',
    'partials/scripts-extra.pug',
    'partials/post-media.pug',
    'partials/card-media.pug',
    'partials/post-tags.pug',
    'partials/post-pagination.pug',
    'partials/tag-overview.pug',
    'partials/tag-cloud.pug',
    'partials/feed-link.pug',
]

export const PAGE_TYPES = ['default', 'home', 'post', 'archive', 'tag']

export const BLOCKS = ['head', 'header', 'main', 'footer', 'scripts']

export const HELPERS = ['pageLang', 'sameLang', 'homeHref', 'formatDate', 'isoDate', 'hrefFor']

export const TOKENS = {
    color: ['bg', 'surface', 'text', 'muted', 'accent', 'accent_text', 'border', 'focus'],
    font: ['body', 'heading', 'mono'],
    size: ['base', 'measure', 'width', 'radius', 'space'],
}

export const THEME_KEYS = ['label', 'tokens', 'extra_css', 'footer_links', 'blog']

export const T_KEYS = [
    // shared (§S2.6)
    'Skip to content',
    'Main navigation',
    'Language',
    'Legal',
    // blog (§S4.3)
    'Recent posts',
    'All posts',
    'Published',
    'Updated',
    'By',
]

export const SHELL_CLASSES = [
    'skip-link',
    'site-header',
    'site-header__inner',
    'site-header__brand',
    'site-header__nav',
    'lang-switch',
    'lang-switch__list',
    'lang-switch__item',
    'lang-switch__link',
    'site-main',
    'page__header',
    'page__title',
    'page__lead',
    'page__body',
    'site-footer',
    'site-footer__inner',
    'site-footer__legal',
    'site-footer__copy',
]

export const BLOG_CLASSES = [
    'post',
    'post__header',
    'post__title',
    'post__meta',
    'post__date',
    'post__updated',
    'post__author',
    'post__lead',
    'post__media',
    'post__image',
    'post__body',
    'post__footer',
    'post__tags',
    'post__pagination',
    'post-list',
    'post-list__title',
    'post-list__items',
    'post-list__item',
    'post-list__more',
    'post-card',
    'post-card__media',
    'post-card__image',
    'post-card__title',
    'post-card__link',
    'post-card__date',
    'post-card__excerpt',
    'post-archive__year',
    'post-archive__list',
    'post-archive__item',
    'tag-page',
]

export const PUBLIC_CLASSES = [...SHELL_CLASSES, ...BLOG_CLASSES]

// §S4.5 with the peer floors decided for 1.0.0 (§S8, last paragraph).
export const PLUGIN_CLASSES = {
    '@nera-static/plugin-tags': {
        range: '^3.3.0',
        classes: [
            'tag-cloud',
            'tag-cloud__item',
            'tag-links',
            'tag-links__item',
            'tag-overview',
            'tag-overview__header',
            'tag-overview__title',
            'tag-overview__image',
            'tag-overview__content',
            'tag-overview__item',
            'tag-overview__item-title',
            'tag-overview__item-date',
            'tag-overview__item-description',
            'tag-overview__item-link',
        ],
    },
    '@nera-static/plugin-page-pagination': {
        range: '^2.4.0',
        classes: [
            'page-pagination',
            'page-pagination__link',
            'page-pagination__link--previous',
            'page-pagination__link--next',
        ],
    },
    '@nera-static/plugin-code-blocks': {
        range: '^1.2.1',
        classes: ['nera-code', 'nera-code-scope'],
    },
    '@nera-static/plugin-images': {
        range: '^1.0.2',
        classes: ['nera-image', 'nera-image__caption'],
    },
    '@nera-static/plugin-navigation': {
        range: '^3.1.0',
        classes: ['nav', 'nav--list', 'nav__item', 'nav__link', 'nav__link--active', 'nav__link--active-path'],
    },
    '@nera-static/plugin-social-media-links': {
        range: '^2.3.0',
        classes: [
            'social-media-links',
            'social-media-links__list',
            'social-media-links__item',
            'social-media-links__link',
            'social-media-links__icon',
            'social-media-links__label',
        ],
    },
}

// plugin-code-blocks' custom properties, mapped onto the theme's tokens (§S4.4).
export const CODE_MAPPING = {
    '--nera-code-bg': 'var(--theme-color-bg',
    '--nera-code-ink': 'var(--theme-color-text',
    '--nera-code-muted': 'var(--theme-color-muted',
    '--nera-code-accent': 'var(--theme-color-accent',
    '--nera-code-line': 'var(--theme-color-border',
    '--nera-code-font': 'var(--theme-font-mono',
    '--nera-code-radius': 'var(--theme-size-radius',
}

// The other theme's values, for "Distinct" (§S3.4, §S3.1).
export const BUSINESS_FONT_BODY =
    'system-ui, -apple-system, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial, sans-serif'
export const BUSINESS_PAGE_TYPES = ['default', 'home', 'contact', 'list', 'gallery']
