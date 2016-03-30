import assert from 'assert';
import { equalTo } from '../../validations';

// Note: each validator returns `true` when the `value` is invalid
describe('Validator: equalTo', () => {
	it('should be valid when `value` (string) equals `prop` (string)', () => {
		assert(equalTo({}, 'matcher', 'matcher') === false);
	});
	it('should be invalid when `value` (string) does not equal `prop` (string)', () => {
		assert(equalTo({}, 'non-matcher', 'matcher') === true);
	});
	it('should be valid when `value` (number) equals `prop` (number)', () => {
		assert(equalTo({}, 77, 77) === false);
	});
	it('should be valid when `value` (number) does not equal `prop` (number)', () => {
		assert(equalTo({}, 77, 88) === true);
	});
});
