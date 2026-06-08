(function () {
    const ENABLED = true;
    const MOBILE_ONLY = true;
    const REDIRECT_PERCENTAGE = 25;
    const TARGET_DOMAIN = 'https://www.footiq.in/products/herbal-foot-pads';
    const FORCE_PARAM = '__abtest';
    const FORCE_VALUE = '1';
    const EXCLUDED_PATHS = [
        '/checkout',
        '/cart',
        '/account',
        '/orders',
        '/apps',
        '/challenge',
        '/search'
    ];
    try {

        if (!ENABLED) {
            return;
        }

        const currentUrl = new URL(window.location.href);
        const currentPath = currentUrl.pathname.toLowerCase();

        if (
            EXCLUDED_PATHS.some(path =>
                currentPath === path ||
                currentPath.startsWith(path + '/')
            )
        ) {
            return;
        }

        const isForced =
            currentUrl.searchParams.get(FORCE_PARAM) === FORCE_VALUE;

        if (MOBILE_ONLY && !isForced) {

            const isMobile =
                /Android|iPhone|iPad|iPod|Mobile/i.test(
                    navigator.userAgent
                );

            if (!isMobile) {
                return;
            }
        }

        const STORAGE_KEY = '__ab_redirected_forever';

        if (!isForced &&
            localStorage.getItem(STORAGE_KEY) === '1') {
            return;
        }

        if (!isForced) {

            const bucket =
                localStorage.getItem('__ab_bucket') ||
                (Math.random() * 100 < REDIRECT_PERCENTAGE
                    ? 'B'
                    : 'A');

            localStorage.setItem('__ab_bucket', bucket);

            if (bucket !== 'B') {
                return;
            }
        }

        localStorage.setItem(STORAGE_KEY, '1');

        const targetUrl = new URL(TARGET_DOMAIN);

        targetUrl.searchParams.set(
            'utm_source',
            currentUrl.hostname
        );

        targetUrl.searchParams.set(
            'ab_variant',
            'B'
        );

        window.location.replace(
            targetUrl.toString()
        );

    } catch (err) {
        console.error(err);
    }

})();
