type ValidationResult = {
    isValid: boolean;
    errors?: string;
};


export function validateInput(
     input: string
    ,blocked: string[]
    ,max_length = 1000): ValidationResult {

    const errors: string[] = [];

    if (!input || input.trim() === "") {
        errors.push("Input is empty.");
    }

    if (input.length > max_length) {
        errors.push(`Input exceeds maximum length of ${max_length} characters.`);
    }

    if(blocked.some(blockedWord => input.includes(blockedWord))) {
        errors.push("Input contains blocked words.");
    }

    return {
        isValid: errors.length === 0,
        errors: errors.join(", ")
    };
}