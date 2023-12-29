'use strict';

import Homey from 'homey';

class EssmdExtensions extends Homey.App {

    /**
     * onInit is called when the app is initialized.
     */
    async onInit() {
        this.log('Essmd Extensions has been initialized');

        const percentageRotationalChangeActionCard = this.homey.flow.getActionCard('percentage-rotational-change');
        percentageRotationalChangeActionCard.registerRunListener(async (args: any, state: any) => {
            const changeAmount = args.change_amount || 0.0;
            const currentAmount = args.current_amount || 0.0;

            let result;
            let result1;

            result = result1 = this._changePercentageRelative(currentAmount, changeAmount);
            result = this._rotatePercentage(result);

            return {
                result: result
            };
        });
    }

    private _changePercentageRelative(current: number, change: number): number {
        change = Math.min(Math.max(change, -1.0), 1.0);
        current = Math.min(Math.max(current, -1.0), 1.0);

        let result = current + change;
        result = Math.floor((result + Number.EPSILON) * 100) / 100;
        return result;
    }

    private _rotatePercentage(value: number): number {

        // +1.25 => 0.25
        if (value > 1.0) {
            return this._rotatePercentage(value - 1.0);
        }

        // -0.25 => 0.75
        if (value < 0.0) {
            value = Math.abs(value);
            return this._rotatePercentage(1.0 - value);
        }

        value = Math.floor((value + Number.EPSILON) * 100) / 100
        return value;
    }
}

module.exports = EssmdExtensions;
