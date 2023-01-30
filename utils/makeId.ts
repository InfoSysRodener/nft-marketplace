export const makeId = (length : any) => {
    let result = '';

    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLenght = characters.length;


    for (let index = 0; index < length; index++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLenght))
        
    }

    return result;
}