export default function generateId() {
    // 4 char ID
    return Math.random().toString(36).substring(2, 6);
}

export function randomString(length: number) {
    let result = "";

    while (result.length < length) {
        result += Math.random().toString(36).substring(2, 15);
    }
    
    let offset = Math.floor(Math.random() * (result.length - length));
    return result.substring(offset, offset + length);
}