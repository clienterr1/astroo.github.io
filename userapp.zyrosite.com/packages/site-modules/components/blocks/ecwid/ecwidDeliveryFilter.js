/* eslint-disable max-len */
import {
    ECWID_APPLICATIONS
} from '@zyro-inc/site-modules/constants/ecwidApps';
import {
    debounce
} from '@zyro-inc/site-modules/utils/debounce';

import {
    generateFilterHTML
} from './dynamicHtmlFilter';
import {
    generateSearchInput
} from './searchInputHtml';

const OBSERVER_OPTIONS = {
    attributes: true,
    childList: true,
    subtree: true,
};

export const createDeliveryObserver = () => {
    // globally track input state, radio change, data options and added elements
    let selectedProviderType;
    let searchInput = '';
    let hiddenOptionsCount;
    let dataOptions;
    let searchInputElement;
    let generatedFilters;

    const fieldSearch = (fields) => fields.some((field) => !!field ? .includes(searchInput));

    // used to add hidden class to previously selected option
    // as the option is re-rendered by ecwid after a short timeout
    // when a new option is selected
    const forcedVisibilityCheck = () => {
        dataOptions ? .forEach((option) => {
            const {
                type,
                element,
                title,
                description,
            } = option;

            if (type !== selectedProviderType || !fieldSearch([
                    title,
                    description,
                ])) {
                element.classList.add('zyro-ecwid__option--hidden');
            }
        });
    };

    // filters out options by search input and provider type
    // and adds hidden class to those which do not fit the
    // type or search parameters
    const toggleOptionVisibility = () => {
        const hiddenOptions = dataOptions ? .filter((option) => {
            const {
                title,
                description,
                element,
                type,
            } = option;

            const matchesSearch = fieldSearch([
                title,
                description,
            ]);

            const show = type === selectedProviderType && (matchesSearch || !searchInput.length);

            element.classList.toggle('zyro-ecwid__option--hidden', !show);

            return !show;
        });

        hiddenOptionsCount = hiddenOptions.length;
    };

    const initDeliveryFilters = (deliveryOptions) => {
        let filterForOtherGenerated = false;
        // all options returned from our backend + ecwid custom shipping methods
        const allLabelOptions = deliveryOptions.querySelectorAll('.ec-radiogroup__item');

        dataOptions = [...allLabelOptions].map((label) => {
            const title = label.querySelector('.ec-radiogroup__title').innerText;
            // title is generated from provider (DPD, LPExpress, etc.) response in backend shippingMapper and ecwidService
            // As it is the only place where we can look for the type of option, this is the source of truth
            const initialType = title.split(':')[0].toLowerCase();
            // if the shipping option is added via custom shipping method
            // in ecwid control panel, set the type of the option to
            // 'other' instead of the custom name user gave it
            const type = ECWID_APPLICATIONS.some((app) => app.name === initialType) ? initialType : 'other';
            const radio = label.querySelector('input[type="radio"]');

            radio.addEventListener('change', (event) => {
                if (event.target.checked) {
                    toggleOptionVisibility();
                }
            });

            return {
                title: title.toLowerCase(),
                description: label.querySelector('.ec-radiogroup__text').innerText.toLowerCase(),
                element: label,
                cost: label.querySelector('.ec-radiogroup__data').innerText,
                selected: label.querySelector('input').checked,
                type,
                radio,
            };
        });

        // section above all the shipping options
        const radioSection = deliveryOptions.closest('.ec-cart-step__section');
        // delivery options wrapper
        const ecwidRadioDeliveryWrapper = radioSection.querySelector('.ec-radiogroup__wrap');

        // inserting search input above delivery options if its not already there
        if (!searchInputElement) radioSection.insertAdjacentHTML('beforeend', generateSearchInput());

        radioSection.classList.add('zyro-ecwid__radio-section');

        // listening to changes to search input and triggering option filtering
        radioSection.querySelector('.zyro-ecwid__search input').addEventListener('input', debounce((event) => {
            searchInput = event.target.value.toLowerCase();
            toggleOptionVisibility();
        }), 30);

        const selectedOption = dataOptions.find((option) => option.selected);
        const filterTypes = [...new Set(dataOptions.map((option) => option.type))];

        // do not generate new filters if they are already generated
        // and if they are generated, remove hidden classes to display the filters
        if (!searchInputElement) {
            filterTypes.forEach((type) => {
                if (type === 'other' && filterForOtherGenerated) {
                    return;
                }

                const application = ECWID_APPLICATIONS.find((app) => app.name === type);
                const htmlFilter = generateFilterHTML(application);

                if (type === 'other') {
                    filterForOtherGenerated = true;
                }

                // inserting radio button (generated filter) before search input
                // and triggering delivery options filtering on change
                radioSection.querySelector('.zyro-ecwid__search').insertAdjacentHTML('afterbegin', htmlFilter);
                radioSection.querySelector('[data-filter]').addEventListener('change', (event) => {
                    if (event.target.checked) {
                        selectedProviderType = event.target.dataset.filter;
                        toggleOptionVisibility();
                    }
                });
            });
        } else {
            generatedFilters ? .classList.remove('ec-radiogroup--hidden');
            searchInputElement ? .classList.remove('zyro-ecwid__search--hidden');
            // a workaround for when user gets back to delivery step to change his selection.
            // ecwid adds another group of unfiltered options during this flow, we hide it and only show our filters
            radioSection.querySelector('.ec-cart-step--delivery .ec-radiogroup:last-child') ? .classList.add('ec-radiogroup--hidden');
        }

        generatedFilters = radioSection.querySelector('.ec-cart-step--delivery .ec-radiogroup');
        searchInputElement = radioSection.querySelector('.zyro-ecwid__search');

        // on initial load, set last loaded filter as checked
        // and trigger options filtering for the checked provider
        radioSection.querySelector('[data-filter]').checked = true;
        selectedProviderType = filterTypes[filterTypes.length - 1];
        toggleOptionVisibility();

        ecwidRadioDeliveryWrapper.scroll(selectedOption.element.offsetTop, 0);
    };

    const observer = new MutationObserver(() => {
        // return early if not in checkout page
        if (!document.querySelector('.ec-cart__body')) return;

        // all delivery options that were provided by our backend
        // and ecwid custom shipping methods
        const deliveryOptions = document.querySelector('.ec-cart-step--delivery .ec-radiogroup__items');

        // checkmark icon which indicates that the delivery
        // step was completed
        const isDeliveryStepCompleted = !!document.querySelector('.ec-cart-step--delivery .ec-cart-step__icon--done');
        // all hidden delivery options
        const hiddenOptionElements = document.querySelectorAll('.zyro-ecwid__option--hidden');
        // is delivery information (address, name, postal code, etc.) filled
        const isInformationStepCompleted = !!document.querySelector('.ec-cart-step--address .ec-cart-step__icon--done');

        if (!isInformationStepCompleted && !deliveryOptions && searchInputElement) {
            searchInputElement = null;
        }

        if (!isDeliveryStepCompleted && !dataOptions && deliveryOptions) {
            initDeliveryFilters(deliveryOptions);
        }

        // used when ecwid re-renders last selected option
        // to make sure it stays hidden after selecting a new option
        if (hiddenOptionsCount !== hiddenOptionElements.length) {
            forcedVisibilityCheck();
        }

        if (isDeliveryStepCompleted || !deliveryOptions) {
            // removing inserted html after the delivery method selection step is done
            if (!generatedFilters ? .classList.contains('ec-radiogroup--hidden')) generatedFilters ? .classList.add('ec-radiogroup--hidden');
            if (!searchInputElement ? .classList.contains('zyro-ecwid__search--hidden')) searchInputElement ? .classList.add('zyro-ecwid__search--hidden');
            // unset options array and searchInput so it can be reinitalized
            dataOptions = null;
            if (searchInput) {
                searchInput = '';
                document.getElementById('zyro-ecwid-search').value = '';
            }
        }
    }, OBSERVER_OPTIONS);

    return observer;
};