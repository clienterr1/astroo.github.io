import {
    filterObject
} from '@zyro-inc/site-modules/utils/object';

export const getEcwidPages = ({
    blocks,
    pages,
}) => filterObject(pages, ({
    value
}) => value ? .blocks ? .some((key) => blocks[key] ? .type === 'BlockEcwidStore'));