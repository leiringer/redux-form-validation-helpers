import assert from 'assert';
import { email } from '../../validations';

// Note: each validator returns `true` when the `value` is invalid
describe('Validator: email', () => {
	it('should be invalid when `prop` is "x"', () => {
		assert(email({}, 'x', true) === true);
	});
	it('should be invalid when `prop` is "x@"', () => {
		assert(email({}, 'x@', true) === true);
	});
	it('should be invalid when `prop` is "@x"', () => {
		assert(email({}, '@x', true) === true);
	});
	it('should be invalid when `prop` is "x@x"', () => {
		// Note: we are assuming that the domain name will contain at least one '.'.
		// So `localhost`, for example, will not be considered a valid domain name.
		assert(email({}, 'x@x', true) === true);
	});
	it('should be invalid when `prop` is "x@x."', () => {
		assert(email({}, 'x@x.', true) === true);
	});
	it('should be valid when `prop` is "x@x.x"', () => {
		assert(email({}, 'x@x.x', true) === false);
	});
	it('should be valid when `prop` is "x@x.xx"', () => {
		assert(email({}, 'x@x.xx', true) === false);
	});
	it('should be valid when `prop` is "x@xx.xx"', () => {
		assert(email({}, 'x@xx.xx', true) === false);
	});
	it('should be valid when `prop` is "x@192.16.0.10"', () => {
		assert(email({}, 'x@192.16.0.10', true) === false);
	});
});
