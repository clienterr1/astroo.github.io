const ECOMMERCE_API = `${import.meta.env.VITE_ECOMMERCE_API_URL}/store`;

export const getStoreProducts = async (storeId, productIds) => {
    const suffix = productIds.map((id) => `ids[]=${id}`).join('&');
    const response = await fetch(`${ECOMMERCE_API}/${storeId}/products?${suffix}`);
    const data = await response.json();

    return data.products;
};

export const getVariantsQuantity = async (storeId, productIds) => {
    const suffix = productIds.map((id) => `product_ids[]=${id}`).join('&');
    const response = await fetch(`${ECOMMERCE_API}/${storeId}/variants?fields=inventory_quantity&${suffix}`);
    const data = await response.json();

    return data.variants;
};

export const getCheckoutUrl = async ({
    items,
    successUrl,
    cancelUrl,
    locale,
    storeId,
}) => fetch(`${ECOMMERCE_API}/${storeId}/checkout`, {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    credentials: 'omit',
    body: JSON.stringify({
        items,
        successUrl,
        cancelUrl,
        locale,
    }),
}).then(async (response) => {
    const data = await response.json();

    if (response.ok) {
        return data.url;
    }

    throw (data);
});

export const getTimeSlots = async (bookingId, date) => fetch(`${ECOMMERCE_API}/time-slots`, {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    credentials: 'omit',
    body: JSON.stringify({
        booking_event_id: bookingId,
        time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        date,
    }),
}).then(async (response) => {
    const data = await response.json();

    // TODO: fix return
    if (response.ok) {
        return data.slots;
    }

    throw (data);
});

export const getAvailability = async ({
    bookingId,
    fromDate,
    toDate,
}) => fetch(`${ECOMMERCE_API}/availability`, {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    credentials: 'omit',
    body: JSON.stringify({
        booking_event_id: bookingId,
        time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        from_date: fromDate,
        to_date: toDate,
    }),
}).then(async (response) => {
    const data = await response.json();

    if (response.ok) {
        return data.disabled_dates;
    }

    throw (data);
});