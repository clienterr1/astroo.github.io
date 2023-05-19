export const filterHiddenPages = (languages, currentDate) => Object.fromEntries(
    Object.entries(languages).map(([key, value]) => {
        const pages = Object.fromEntries(
            Object.entries(value.pages).map(([pageKey, pageValue]) => {
                if (!pageValue.isScheduled) {
                    return [
                        pageKey,
                        pageValue,
                    ];
                }

                const {
                    date
                } = pageValue;

                const publishDate = new Date(date).setHours(0, 0, 0, 0);
                const hasCurrentDateExceededPublishDate = publishDate <= currentDate;

                return [
                    pageKey,
                    {
                        ...pageValue,
                        ...(hasCurrentDateExceededPublishDate && {
                            isDraft: false,
                            isScheduled: false,
                        }),
                    },
                ];
            }).filter(((entry) => entry[1].isDraft !== true)),
        );

        return [
            key,
            {
                ...value,
                pages,
            },
        ];
    }),
);