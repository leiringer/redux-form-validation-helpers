import isPromise from 'is-promise';
import { flattenDeep } from 'lodash/array';
import { filter } from 'lodash/collection';
import { isObject, isFunction } from 'lodash/lang';
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
		const path = currentPath.length ? `${currentPath}.${key}` : key;
		if (keyObject[key].children) {
			getValidators(object, path, keyObject[key].children, validators);
		}	else if (keyObject[key].validations) {
			validators.push({ fieldName: path, validations: keyObject[key].validations });
		}
	});
	return validators;
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
	return filter(validators, {
		validations: {
			validateOnBlur: true
		}
	}).map(validator => validator.fieldName);
}

export function generateReduxFormConfiguration(configurationObject) {
	return {
		asyncValidate: generateAsyncValidation(configurationObject),
		asyncBlurFields: generateAsyncBlurFields(configurationObject),
		fields: getFieldStrings(configurationObject)
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

function getFieldnames(obj) {
	return Object.keys(obj).map(key => {
		if (obj[key].children) {
			return getChildFieldnames(key, obj);
		}
		return key;
	});
}

function getChildFieldnames(parent, obj) {
	const children = [];
	Object.keys(obj[parent].children).forEach(child => {
		if (obj[parent].children[child].children) {
			getFieldnames(obj[parent].children[child].children).forEach(childKey => {
				if (obj[parent].children[child].children[childKey] instanceof Array) {
					children.push(`${parent}.${child}.${childKey}[]`);
				} else {
					children.push(`${parent}.${child}.${childKey}`);
				}
			});
		} else {
			if (obj[parent].children[child] instanceof Array) {
				children.push(`${parent}.${child}[]`);
			} else {
				children.push(`${parent}.${child}`);
			}
		}
	});
	return children;
}
