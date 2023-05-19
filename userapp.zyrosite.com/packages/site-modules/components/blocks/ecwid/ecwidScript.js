import {
    BLOCK_HEADER_CLASS,
    SYSTEM_LOCALE,
} from '@zyro-inc/site-modules/constants';
import {
    useEcwidStore
} from '@zyro-inc/site-modules/use/useEcwidStore';

export const ECWID_LOADED_EVENT = 'ecwid-loaded';

// push Ecwid notifications down
const extractNotifications = () => {
    const noticesElement = document.querySelector('.ec-notices');

    if (!noticesElement) {
        return;
    }

    const builderHeaderHeight = document.querySelector('.builder-header') ? .clientHeight ? ? 0;
    const blockHeaderHeight = document.querySelector(`.${BLOCK_HEADER_CLASS}`) ? .clientHeight ? ? 0;

    const noticesOffset = noticesElement.getBoundingClientRect().top + builderHeaderHeight + blockHeaderHeight;

    noticesElement.style.top = `${noticesOffset}px`;
};

const dispatchEcwidLoadedEvent = () => window.dispatchEvent(new Event(ECWID_LOADED_EVENT));

const listenForEcwidCartChanges = (cart) => {
    const {
        setEcwidCartItems
    } = useEcwidStore();

    setEcwidCartItems(cart.items);
};

const handleClosedStore = () => {
    if (window.ecwid_initial_data.data.storeClosed) {
        dispatchEcwidLoadedEvent();
    }
};

// add additional hooks to execute when Ecwid API is ready:
// https://developers.ecwid.com/api-documentation/subscribe-to-events
const subscribeToEcwidHooks = () => {
    // we cannot use Ecwid.OnAPILoaded as page (and notifications) are not loaded yet
    window.Ecwid.OnAPILoaded.add(handleClosedStore);
    window.Ecwid.OnPageLoaded.add(dispatchEcwidLoadedEvent);
    window.Ecwid.OnPageLoaded.add(extractNotifications);
    window.Ecwid.OnCartChanged.add(listenForEcwidCartChanges);
};

export default {
    load(storeId, locale) {
        // https://gist.github.com/makfruit/00e1c298f11bf12392f67c240e35e927#3--how-to-enable-clean-urls-if-you-dont-have-access-to-htaccess-file
        window.ec = window.ec || {};
        window.ec.config = window.ec.config || {};
        window.ec.config.enable_canonical_urls = true;
        window.ec.config.storefrontUrls = window.ec.config.storefrontUrls || {};

        window.ec.config.storefrontUrls.cleanUrls = true;
        window.ec.config.storefrontUrls.queryBasedCleanUrls = true;

        // https://developers.ecwid.com/api-documentation/customize-behaviour#add-custom-javascript-code
        window.ecwid_script_defer = true;
        window.ecwid_dynamic_widgets = true;

        if (typeof Ecwid !== 'undefined') {
            try {
                window.Ecwid.destroy();
                // eslint-disable-next-line no-empty
            } catch (error) {
                // when ecwid first launches, it does not have the full data to call destroy()
                // but the load() method may be called multiple times therefore it throws an error
                // although we can safely ignore this error since this is a ecwid problem
            }
        }

        // eslint-disable-next-line no-underscore-dangle
        window._xnext_initialization_scripts = [{
            widgetType: 'ProductBrowser',
            id: `my-store-${storeId}`,
            arg: [
                'id=productBrowser',
                'categoriesPerRow=4',
                'views=grid(4,3) list(10) table(20)', // this loads 12 products per page
                'categoryView=grid',
                'searchView=list',
            ],
        }, ];

        if (document.querySelector('#ecwid-script')) {
            window.ecwid_onBodyDone();

            // Sometimes ecwid fails to load store HTML in this case we call load script again in 1 second
            setTimeout(() => {
                const doesEcwidContentExist = !!document.getElementById(`my-store-${storeId}`) ? .innerHTML;

                if (!doesEcwidContentExist) {
                    this.load(storeId, locale);
                }
            }, 1000);
        } else {
            const script = document.createElement('script');

            script.defer = true;
            script.type = 'text/javascript';
            script.async = true;
            script.src = `https://app.ecwid.com/script.js?${storeId}`;
            if (locale && locale !== SYSTEM_LOCALE) {
                script.src += `&lang=${locale}`;
            }

            script.id = 'ecwid-script';
            script.addEventListener('load', subscribeToEcwidHooks);
            document.body.append(script);
        }
    },
};