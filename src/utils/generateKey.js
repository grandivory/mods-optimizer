export default function generateKey(length) {
    if (length <= 0) {
        return '';
    }

    const chars = 'abcdefghijklmnopqrstuvwxyz1234567890-!@#$%^&*()_'
    let key = '';

    for (let i = 0; i < length; i++) {
        key += chars[Math.floor(Math.random() * chars.length)];
    }

    return key;
}
