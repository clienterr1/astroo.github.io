export const getIsDomainWithWWWPrefix = (domain) => domain.startsWith('www.');
export const getDomainWithoutWWWPrefix = (domain) => (getIsDomainWithWWWPrefix(domain) ? domain.substring(4) : domain);
export const getDomainProperties = (domain) => {
    const domainWithoutWWW = getDomainWithoutWWWPrefix(domain);

    const [domainName, ...tlds] = domainWithoutWWW.split('.');

    return {
        domainName,
        tld: tlds.join('.'),
    };
};