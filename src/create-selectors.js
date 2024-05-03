import R from 'ramda';

function createSelectorName(propertyName, propertySpec, prevSelectorNames) {
    const _createSelectorName = (propertyName) =>
        `select${propertyName.charAt(0).toUpperCase()}${propertyName.slice(1)}`;
    const selectorName = _createSelectorName(propertyName);

    if (prevSelectorNames.includes(selectorName)) {
        if (Object.hasOwn(propertySpec, '_alternative')) {
            return _createSelectorName(propertySpec['_alternative']);
        }

        throw new Error(
            `Invariant failed: The selector names [${selectorName}] are already in use. Please use an alternative name using '_name' or '_names'`
        );
    }

    return selectorName;
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

const reservedKeywords = ['_default', '_export', 'type', '_alternative'];

function _createSelectors(selectorSpecification, prevSelectorNames) {
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
                propertySpec['_export'] !== false
            ) {
                const selectorName = createSelectorName(
                    propertyName,
                    propertySpec,
                    prevSelectorNames
                );

                const selectorFunction = (_state) => {
                    const state = selectors.selectState(_state);

                    return Object.hasOwn(state, propertyName) &&
                        state[propertyName] !== undefined
                        ? state[propertyName]
                        : getDefaultForPropertySelector(propertySpec);
                };

                accSelectors[selectorName] = selectorFunction;
                prevSelectorNames.push(selectorName);

                return {
                    ...accSelectors,
                    ..._createSelectors(
                        {
                            ...propertySpec,
                            _selector: selectorFunction
                        },
                        prevSelectorNames
                    )
                };
            }

            return accSelectors;
        },
        selectors
    );
}

function createSelectors(selectorSpecification) {
    return _createSelectors(selectorSpecification, []);
}

export default createSelectors;
