import should from 'should';
import { digits } from '../../validations';

// Note: each validator returns `true` when the `value` is invalid
describe('Validator: digits', () => {
	describe('Should be valid', () => {
		it('When `prop` is 999', () => {
			should(digits({}, 999)).be.false();
		});
		it('When `prop` is 40.78', () => {
			should(digits({}, '999')).be.false();
		});
	});
	describe('Should be invalid', () => {
		it('When `prop` is "blah"', () => {
			should(digits({}, 'blah')).be.true();
		});
		it('When `prop` is "blah77"', () => {
			should(digits({}, 'blah77')).be.true();
		});
		it('When `prop` is "4,000"', () => {
			should(digits({}, '4,000')).be.true();
		});
		it('When `prop` is "77.7"', () => {
			should(digits({}, '77.7')).be.true();
		});
		it('When `prop` is 77.7', () => {
			should(digits({}, 77.7)).be.true();
		});
	});
});
