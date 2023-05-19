import {
    nanoid
} from 'nanoid';

const DEFAULT_ID_PREFIX = 'z';
const DEFAULT_ID_LENGTH = 5;

export const generateRandomId = ({
    length,
    prefix,
} = {}) => `${prefix || DEFAULT_ID_PREFIX}${nanoid(length || DEFAULT_ID_LENGTH)}`;