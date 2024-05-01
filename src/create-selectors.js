import R, { prop } from 'ramda';

function createSelectorName(selectorName) {
    return `select${selectorName.charAt(0).toUpperCase()}${selectorName.slice(1)}`;
}

function getDefaultValueForType(type) {
    if (type === 'list') {
        return [];
    } else if (type === 'index') {
        return {};
    }
}

function getDefaultForPropertySelector(selectorSpecification) {
    if (Object.hasOwn(selectorSpecification, '_default')) {
        return selectorSpecification['_default'];
    } else if (Object.hasOwn(selectorSpecification, '_type')) {
        return getDefaultValueForType(selectorSpecification['_type']);
    }
}

function checkIsPlainObject(value) {
    return (
        value !== null &&
        typeof value === 'object' &&
        Object.getPrototypeOf(value) === Object.prototype
    );
}

const reservedKeywords = ['_default', '_export', 'type'];

function createSelectors(selectorSpecification) {
    const selectors = {
        selectState: selectorSpecification._selector ?? R.identity
    };

    return Object.entries(selectorSpecification).reduce(
        (accSelectors, [propertyName, propertySpec]) => {
            if (reservedKeywords.includes(propertyName)) {
                return accSelectors;
            }

            if (
                checkIsPlainObject(propertySpec) &&
                propertySpec._export !== false
            ) {
                const selectorName = createSelectorName(propertyName);
                const selectorFunction = (_state) => {
                    const state = accSelectors.selectState(_state);

                    return Object.hasOwn(state, propertyName) &&
                        state[propertyName] !== undefined
                        ? state[propertyName]
                        : getDefaultForPropertySelector(propertySpec);
                };

                return {
                    ...accSelectors,
                    [selectorName]: selectorFunction,
                    ...createSelectors({
                        ...propertySpec,
                        _selector: selectorFunction
                    })
                };
            }

            return accSelectors;
        },
        selectors
    );
}

export default createSelectors;
