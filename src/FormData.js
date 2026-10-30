/**
 * Convert JSON object to new FormData or refresh existing FormData. 
 * @date 3/25/2024 - 11:53:46 AM
 *
 * @param {*} model the json model to convert
 * @param {*} [form=null] the yet existing FromData object to update
 * @param {string} [namespace=''] optional key to group data in single namespace
 * @returns {*} converted FormData
 */
function convertModelToFormData(model, form = null, namespace = '') {
    let formData = form || new FormData();

    for (let propertyName in model) {
        if (!model.hasOwnProperty(propertyName) || !model[propertyName]) continue;
        let formKey = namespace ? `${namespace}[${propertyName}]` : propertyName;
        if (model[propertyName] instanceof Date)
            formData.append(formKey, model[propertyName].toISOString());
        else if (model[propertyName] instanceof Array) {
            model[propertyName].forEach((element, index) => {
                const tempFormKey = `${formKey}[${index}]`;
                this.convertModelToFormData(element, formData, tempFormKey);
            });
        }
        else if (typeof model[propertyName] === 'object' && !(model[propertyName] instanceof File))
            this.convertModelToFormData(model[propertyName], formData, formKey);
        else
            formData.append(formKey, model[propertyName].toString());
    }
    return formData;
}

export { convertModelToFormData };