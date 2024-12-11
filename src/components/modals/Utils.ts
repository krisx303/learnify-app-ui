export const INVALID_ID_CHARACTERS = /[^a-zA-Z0-9_.]/gi;

export const generateID = (name: string): string => {
    if(!name) return '';
    return name.replaceAll(INVALID_ID_CHARACTERS, ' ')
        .toLowerCase()
        .split(' ')
        .filter(str => str !== '')
        .join('_');
}