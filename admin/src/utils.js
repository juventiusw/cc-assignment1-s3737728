import sanitize from 'sanitize-html';

function trimFields(fields, setFields) {
    const trimmedFields = { };
    Object.keys(fields).map(key => {
        if(typeof fields[key] === "string") {
            return trimmedFields[key] = sanitize(fields[key].trim());
        }else {
            return trimmedFields[key] = fields[key];
        }
    });
    setFields(trimmedFields);

    return trimmedFields;
}

export {
    trimFields
}
