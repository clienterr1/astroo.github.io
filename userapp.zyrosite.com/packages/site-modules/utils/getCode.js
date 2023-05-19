// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode

export const CODE = {
    Backspace: 'Backspace',
    ShiftLeft: 'ShiftLeft',
    Escape: 'Escape',
    Space: 'Space',
    ArrowLeft: 'ArrowLeft',
    ArrowUp: 'ArrowUp',
    ArrowRight: 'ArrowRight',
    ArrowDown: 'ArrowDown',
    Delete: 'Delete',
    KeyX: 'KeyX',
    KeyC: 'KeyC',
    KeyD: 'KeyD',
    KeyY: 'KeyY',
    KeyZ: 'KeyZ',
    OSLeft: 'OSLeft',
    NumLockSlash: 'NumLockSlash',
    KeySlash: 'Slash',
    Enter: 'Enter',
    BracketLeft: 'BracketLeft',
    BracketRight: 'BracketRight',
};

const keyCodeToCode = {
    8: CODE.Backspace,
    16: CODE.ShiftLeft,
    27: CODE.Escape,
    32: CODE.Space,
    37: CODE.ArrowLeft,
    38: CODE.ArrowUp,
    39: CODE.ArrowRight,
    40: CODE.ArrowDown,
    46: CODE.Delete,
    67: CODE.KeyC,
    68: CODE.KeyD,
    88: CODE.KeyX,
    89: CODE.KeyY,
    90: CODE.KeyZ,
    91: CODE.OSLeft,
    111: CODE.NumLockSlash,
    191: CODE.KeySlash,
    219: CODE.BracketLeft,
    221: CODE.BracketRight,
};

export const getCode = (event) => {
    let code;

    if (!event) {
        code = undefined;
    } else if (event.code !== undefined) {
        code = event.code === 'MetaLeft' ? 'OSLeft' : event.code;
    } else if (event.keyCode !== undefined) {
        code = keyCodeToCode[event.keyCode];
    }

    return code;
};