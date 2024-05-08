import R from 'ramda';

function createSelectorName(propertyName) {
    return `select${propertyName.charAt(0).toUpperCase()}${propertyName.slice(1)}`;
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

function _createSelectors(selectorSpecification, parentSelector) {
    return Object.entries(selectorSpecification).reduce(
        (accSelectors, [propertyName, propertySpec]) => {
            if (
                reservedKeywords.includes(propertyName) ||
                !(
                    checkIsPlainObject(propertySpec) &&
                    propertySpec['_export'] !== false
                )
            ) {
                return accSelectors;
            }

            const selectorName = createSelectorName(propertyName);

            const selectorFunction = (_state) => {
                const state = parentSelector(_state);

                return Object.hasOwn(state, propertyName) &&
                    state[propertyName] !== undefined
                    ? state[propertyName]
                    : getDefaultForPropertySelector(propertySpec);
            };

            const subSelectors = _createSelectors(
                propertySpec,
                selectorFunction
            );

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
        },
        []
    );
}

function createSelectors(selectorSpecification) {
    const parentSelector = selectorSpecification._selector ?? R.identity;
    const selectors = [
        ..._createSelectors(selectorSpecification, parentSelector),
        {
            selectorName: 'selectState',
            selectorFunction: parentSelector
        }
    ];

    return selectors.reduce((accSelectors, selector) => {
        const { selectorName, selectorFunction } = selector;

        if (Object.hasOwn(accSelectors, selectorName)) {
            const alternativeSelector = selectors.find(
                (currSelector) =>
                    currSelector.selectorName === selectorName &&
                    Object.hasOwn(currSelector, 'alternativeName')
            );

            if (alternativeSelector !== undefined) {
                accSelectors[alternativeSelector['alternativeName']] =
                    alternativeSelector['selectorFunction'];

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
