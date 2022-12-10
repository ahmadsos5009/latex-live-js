
export const config = {
    IS_DEVELOPMENT: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
    CACHE_OVERFLOW_PERCENTAGE: 90,
    TEXLIVE_CACHE: 'texlive',
    TEXLIVE_HEAD_CACHE: 'texlive-head',
    WORKER_CACHE: 'worker',
    WORKER_VERSION: 1,
    TEXLIVE_VERSION: 1,
}
