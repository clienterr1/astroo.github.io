import {
    computed,
    ref,
} from 'vue';

const isHeaderDomainConnectionStatusExpanded = ref(false);
const isSavePopupVisible = ref(false);

export const useHeaderPopups = () => {
    const setIsHeaderDomainConnectionStatusExpanded = (value) => {
        isSavePopupVisible.value = false;
        isHeaderDomainConnectionStatusExpanded.value = value;
    };

    const setIsSavePopupVisible = (value) => {
        isHeaderDomainConnectionStatusExpanded.value = false;
        isSavePopupVisible.value = value;
    };

    return {
        setIsSavePopupVisible,
        setIsHeaderDomainConnectionStatusExpanded,
        isSavePopupVisible: computed(() => isSavePopupVisible.value),
        isHeaderDomainConnectionStatusExpanded: computed(() => isHeaderDomainConnectionStatusExpanded.value),
    };
};