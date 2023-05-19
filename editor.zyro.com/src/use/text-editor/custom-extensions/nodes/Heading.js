import Heading from '@tiptap/extension-heading';

import {
    TEXT_EDITOR_LEVELS_HEADING
} from '@/constants';

export default Heading.extend({
    addOptions() {
        return {
            ...Heading.options,
            levels: TEXT_EDITOR_LEVELS_HEADING,
        };
    },

    // Disable keyboard shortcuts (default: Cmd + option + [1-6] to set heading level)
    addKeyboardShortcuts() {
        return [];
    },

    // Disable input rules (default: markdown style headings – use ### to set heading level)
    addInputRules() {
        return [];
    },
});