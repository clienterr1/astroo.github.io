export const getErrorMessage = (error) => {
    const firstCaseErrorMessage = error ? .response ? .data ? .message;
    const secondCaseErrorMessage = error ? .response ? .data ? .msg;

    return firstCaseErrorMessage || secondCaseErrorMessage || error.message;
};