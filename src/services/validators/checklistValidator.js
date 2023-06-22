const validationRules = {
    title: {
        minLength: 1,
        required: true,
        maxLength: 255
    },
    tags: {
        minLength: 0,
        required: false,
        maxLength: 255
    },
    description: {
        minLength: 1,
        required: true,
        maxLength: 255
    }
}

export {validationRules as checklistValidationRules}