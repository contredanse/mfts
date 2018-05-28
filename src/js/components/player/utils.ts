export function isObject(val) {
    return val !== null && typeof val === 'object';
}

// Deep comparison of two objects but ignoring
// functions, for use in shouldComponentUpdate
export function isEqual(a, b) {
    if (typeof a === 'function' && typeof b === 'function') {
        return true;
    }
    if (a instanceof Array && b instanceof Array) {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i !== a.length; i++) {
            if (!isEqual(a[i], b[i])) {
                return false;
            }
        }
        return true;
    }
    if (isObject(a) && isObject(b)) {
        if (Object.keys(a).length !== Object.keys(b).length) {
            return false;
        }
        for (const key of Object.keys(a)) {
            if (!isEqual(a[key], b[key])) {
                return false;
            }
        }
        return true;
    }
    return a === b;
}
