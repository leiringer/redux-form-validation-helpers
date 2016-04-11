import 'babel-polyfill';
import should from 'should';
import {
	getFieldStrings,
	getValidators,
	generateAsyncBlurFields,
	addMultipleValidations
} from '../helpers';
import validations from '../validations';

const testConfiguration = {
	additionalInformation: {
		validations: [
			{ validator: 'required', options: true, message: 'must be filled' }
		]
	},
	applicationInformation: {
		children: {
			caseNumber: {},
			handlingOfficer: {},
			approved: {}
		}
	},
	applicant: {
		children: {
			name: {
				validations: [
					{ validator: 'required', options: true, message: 'must be filled' },
					{ validator: 'minLength', options: 5, message: 'minimum length of 5' },
					{ validator: 'validateOnBlur' }
				]
			},
			organisationOrSocialSecurityNumber: {
				validations: [
					{ validator: 'minLength', options: 5, message: 'minimum length of 5' },
					{ validator: 'validateOnBlur' }
				]
			},
			contactInformation: {
				children: {
					phoneNumber: {},
					mobilePhoneNumber: {},
					email: {
						validations: [
							{ validator: 'email', message: 'must be valid e-mail' }
						]
					}
				}
			},
			address: {
				children: {
					streetAndNumber: {},
					postCode: {},
					city: {}
				}
			}
		}
	},
	entrepreneur: {
		children: {
			name: {},
			address: {
				children: {
					streetAndNumber: {},
					postCode: {},
					city:{}
				}
			}
		}
	},
	supervisor: {
		children: {
			name: {},
			contactInformation: {
				children: {
					phoneNumber: {},
					mobilePhoneNumber: {},
					email: {}
				}
			}
		}
	},
	markupResponsible: {
		children: {
			name: {},
			contactInformation: {
				children: {
					phoneNumber: {},
					mobilePhoneNumber: {},
					email: {},
					otherPhoneNumber: {}
				}
			},
			educationDate: {}
		}
	},
	purpose: {},
	workExecutedRoadway: {},
	workExecutedWalkway: {},
	workExecutedGreenArea: {},
	workExecutedOtherArea: {},
	workType: {
		children: {
			selected: [],
			other: {}
		}
	},
	depth: {},
	caseNumber: {},
	handlingOfficer: {},
	dates: {
		children: {
			prolongedDate: {},
			prolongedEndTime: {},
			fromDate: {},
			toDate: {},
			registrationDate: {},
			approvedDate: {},
			startTime: {},
			endTime: {}
		}
	}
};

const testArrayAsRoot = {
	attachments: [
		{
			name: {},
			description: {},
			file: {},
			fileName: {}
		}
	]
};

const testArrayAsRootResult = [
	'attachments[].name',
	'attachments[].description',
	'attachments[].file',
	'attachments[].fileName'
];

const fieldnameResult = [
	'additionalInformation',
	'applicationInformation.caseNumber',
	'applicationInformation.handlingOfficer',
	'applicationInformation.approved',
	'applicant.name',
	'applicant.organisationOrSocialSecurityNumber',
	'applicant.contactInformation.phoneNumber',
	'applicant.contactInformation.mobilePhoneNumber',
	'applicant.contactInformation.email',
	'applicant.address.streetAndNumber',
	'applicant.address.postCode',
	'applicant.address.city',
	'entrepreneur.name',
	'entrepreneur.address.streetAndNumber',
	'entrepreneur.address.postCode',
	'entrepreneur.address.city',
	'supervisor.name',
	'supervisor.contactInformation.phoneNumber',
	'supervisor.contactInformation.mobilePhoneNumber',
	'supervisor.contactInformation.email',
	'markupResponsible.name',
	'markupResponsible.contactInformation.phoneNumber',
	'markupResponsible.contactInformation.mobilePhoneNumber',
	'markupResponsible.contactInformation.email',
	'markupResponsible.contactInformation.otherPhoneNumber',
	'markupResponsible.educationDate',
	'purpose',
	'workExecutedRoadway',
	'workExecutedWalkway',
	'workExecutedGreenArea',
	'workExecutedOtherArea',
	'workType.selected[]',
	'workType.other',
	'depth',
	'caseNumber',
	'handlingOfficer',
	'dates.prolongedDate',
	'dates.prolongedEndTime',
	'dates.fromDate',
	'dates.toDate',
	'dates.registrationDate',
	'dates.approvedDate',
	'dates.startTime',
	'dates.endTime'
];

const asyncBlurFieldsResult = [
	'applicant.name',
	'applicant.organisationOrSocialSecurityNumber'
];

describe('getFieldStrings: should generate the correct strings for a given configuration', () => {
	it('should have the same amount of fields', () => {
		should(getFieldStrings(testConfiguration).length).be.equal(fieldnameResult.length);
	});
	it('should generate the correct strings', () => {
		should.deepEqual(getFieldStrings(testConfiguration), fieldnameResult);
	});
	it('should generate the correct string for a given index', () => {
		should(getFieldStrings(testConfiguration)[10]).be.equal(fieldnameResult[10]);
	});
	it('should generate the correct strings for array as root node', () => {
		should.deepEqual(getFieldStrings(testArrayAsRoot), testArrayAsRootResult);
	});
});

describe('getValidators: should generate the correct collection of objects', () => {
	it('should have the same amount of validators', () => {
		should(getValidators(testConfiguration).length).be.equal(4);
	});
	it('should have the same amount of validators for a given field', () => {
		// applicant.name
		should(getValidators(testConfiguration)[1].validations.length).be.equal(3);
	});
	it('should have the exact same field name for a given index', () => {
		should(getValidators(testConfiguration)[1].fieldName).be.equal('applicant.name');
	});
});

describe('generateAsyncBlurFields: should generate the correct collection of field names', () => {
	it('should have the same amount of field names', () => {
		should(generateAsyncBlurFields(testConfiguration).length).be.equal(asyncBlurFieldsResult.length);
	});
	it('should have the exact same field name for a given index', () => {
		should(generateAsyncBlurFields(testConfiguration)[0]).be.equal(asyncBlurFieldsResult[0]);
		should(generateAsyncBlurFields(testConfiguration)[1]).be.equal(asyncBlurFieldsResult[1]);
	});
});

describe('addMultipleValidations: should add all available validations to the passed in object', () => {
	it('should contain the same amount of functions', () => {
		const validationStore = {};
		addMultipleValidations(validations, validationStore);
		should(Object.keys(validations).length).be.equal(Object.keys(validationStore).length);
	});
});
