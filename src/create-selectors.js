import R from 'ramda';

function createSelectorName(propertyName) {
    const _createSelectorName = (propertyName) =>
        `select${propertyName.charAt(0).toUpperCase()}${propertyName.slice(1)}`;
    const selectorName = _createSelectorName(propertyName);

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

function _createSelectors(selectorSpecification) {
    const selectState = selectorSpecification._selector ?? R.identity;

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
                    propertySpec
                );

                const selectorFunction = (_state) => {
                    const state = selectState(_state);

                    return Object.hasOwn(state, propertyName) &&
                        state[propertyName] !== undefined
                        ? state[propertyName]
                        : getDefaultForPropertySelector(propertySpec);
                };

                const subSelectors = _createSelectors({
                    ...propertySpec,
                    _selector: selectorFunction
                });
                return [
                    {
                        selectorName: selectorName,

                        ...(Object.hasOwn(propertySpec, '_alternative')
                            ? {
                                  alternativeName: createSelectorName(
                                      propertySpec['_alternative']
                                  )
                              }
                            : {}),
                        selectorFunction: selectorFunction
                    },
                    ...accSelectors,
                    ...subSelectors
                ];
            }

            return accSelectors;
        },
        []
    );
}

function createRootSelectors(selectorSpecification) {
    const selectors = _createSelectors(selectorSpecification);

    return [
        ...selectors,

        {
            selectorName: 'selectState',
            alternativeName: {},
            selectorFunction: selectorSpecification._selector ?? R.identity
        }
    ];
}

function createSelectors(selectorSpecification) {
    const storedSelectors = createRootSelectors(selectorSpecification);

    return storedSelectors.reduce((accSelectors, selector) => {
        const { selectorName, selectorFunction } = selector;

        if (Object.hasOwn(accSelectors, selectorName)) {
            const { alternativeName, selectorFunction: origSelectorFunction } =
                storedSelectors.find(
                    ({ selectorName: currSelectorName }) =>
                        currSelectorName === selectorName
                );

            if (alternativeName) {
                accSelectors[alternativeName] = origSelectorFunction;

                return {
                    ...accSelectors,
                    [selectorName]: selectorFunction
                };
            }

            throw new Error(
                `Invariant failed: The selector names [${selectorName}] are already in use. Please use an alternative name using '_name' or '_names'`
            );
        }

        return {
            ...accSelectors,
            [selectorName]: selectorFunction
        };
    }, {});
}

export default createSelectors;
