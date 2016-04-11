import isPromise from 'is-promise';
import { flattenDeep } from 'lodash/array';
import { filter } from 'lodash/collection';
import { isObject, isFunction, isArray } from 'lodash/lang';
import validations from './validations';

const validationStore = {};

export function addValidation(store, key, fn) {
	store[key] = fn;
}

export function addMultipleValidations(validationsObject, store) {
	Object.keys(validationsObject).forEach((key) => addValidation(store, key, validationsObject[key]));
}

addMultipleValidations(validations, validationStore);

export function getValidators(object, currentPath = '', currentObject = undefined, validators = []) {
	const keyObject = currentObject || object;
	Object.keys(keyObject).forEach(key => {
		const keyAttr = isArray(keyObject[key]) ? `${key}[]` : key;
		const path = currentPath.length ? `${currentPath}.${keyAttr}` : keyAttr;
		if (keyObject[key].children) {
			getValidators(object, path, keyObject[key].children, validators);
		} else if (keyObject[key].validations) {
			validators.push({ fieldName: path, validations: keyObject[key].validations });
		}	else if (isArray(keyObject[key]) && keyObject[key].length) {
			getValidators(object, path, keyObject[key][0], validators);
		}
	});
	return validators;
}

export function getFieldnames(object, currentPath = '', currentObject = undefined, fieldNames = []) {
	const keyObject = currentObject || object;
	Object.keys(keyObject).forEach(key => {
		const keyAttr = isArray(keyObject[key]) ? `${key}[]` : key;
		const path = currentPath.length ? `${currentPath}.${keyAttr}` : keyAttr;
		if (keyObject[key].children) {
			getFieldnames(object, path, keyObject[key].children, fieldNames);
		}	else if (isArray(keyObject[key]) && !keyObject[key].validations && keyObject[key].length) {
			getFieldnames(object, path, keyObject[key][0], fieldNames);
		} else {
			fieldNames.push(path);
		}
	});
	return fieldNames;
}

export function getFieldStrings(configurationObject) {
	return flattenDeep(getFieldnames(configurationObject));
}

export function getFieldObjects(configurationObject) {
	const fields = {};
	Object.keys(configurationObject).forEach(key => {
		fields[key] = {};
	});
	return fields;
}

export function generateAsyncBlurFields(validationConfig) {
	const validators = getValidators(validationConfig);
	const asyncBlurFields = [];
	validators.forEach((validatorCollection) => {
		const blurFields = filter(validatorCollection.validations, { validator: 'validateOnBlur' });
		if (blurFields.length) {
			asyncBlurFields.push(validatorCollection.fieldName);
		}
	});
	return asyncBlurFields;
}

export function generateReduxFormConfiguration(configurationObject) {
	return {
		asyncValidate: generateAsyncValidation(configurationObject),
		asyncBlurFields: generateAsyncBlurFields(configurationObject),
		fields: getFieldStrings(configurationObject)
	};
}

export function generateSyncValidation(validationConfig) {
	return (values) => {
		const errors = {};
		const validators = getValidators(validationConfig);

		function addError(field, validatorName, message) {
			if (!errors[field]) {
				errors[field] = message;
			}
		}

		validators.forEach((validator) => {
			const validation = validator.validations;
			if (isObject(validation)) {
				Object.keys(validation).forEach((validationType) => {
					if (isFunction(validationStore[validationType])) {
						const hasError = validationStore[validationType](
							validator.fieldName,
							values[validator.fieldName],
							validation[validationType],
							values,
							validation
						);
						if (hasError) {
							addError(validator.fieldName, validationType, validator.errorMessage);
						}
					}
				});
			}
		});
		return errors;
	};
}

export function generateAsyncValidation(validationConfig) {
	return (values, dispatch) => {
		const promiseList = [Promise.resolve()];
		const errors = {};
		const validators = getValidators(validationConfig);

		function addError(field, validatorName, message = true) {
			if (!errors[field]) {
				errors[field] = {};
			}
			errors[field][validatorName] = message;
		}

		validators.forEach((validator) => {
			const validation = validator.validations;
			if (isObject(validation)) {
				Object.keys(validation).forEach((validationType) => {
					if (isFunction(validationStore[validationType])) {
						const hasError = validationStore[validationType](
							validator.fieldName,
							values[validator.fieldName],
							validation[validationType],
							dispatch,
							values,
							validation
						);
						if (isPromise(hasError)) {
							promiseList.push(new Promise((resolve) => {
								hasError.then(resolve).catch((msg) => {
									addError(validator.fieldName, validationType, msg);
									resolve();
								});
							}));
						} else if (hasError) {
							addError(validator.fieldName, validationType, hasError);
						}
					}
				});
			}
		});

		return Promise.all(promiseList).then(() => {
			if (Object.keys(errors).length) {
				return Promise.reject(errors);
			} else {
				return Promise.resolve();
			}
		});
	};
}
