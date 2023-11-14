export const allowOnlyNumbers = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow certain special keys
    const allowedSpecialKeys = ['Backspace', 'Enter', 'Tab', 'Delete', 'ArrowLeft', 'ArrowRight', 'Control'];

    // Allow only numeric inputs (0-9) or certain special keys
    const isValidInput = /^\d+$/.test(event.key) || allowedSpecialKeys.includes(event.key);

    if (!isValidInput) {
        event.preventDefault();
    }
};
