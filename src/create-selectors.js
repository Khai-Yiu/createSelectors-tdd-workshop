import R from 'ramda';

function createSelectorName(propertyName) {
    return `select${propertyName.charAt(0).toUpperCase()}${propertyName.slice(1)}`;
}

function getAlternativeName(specification) {
    if (Object.hasOwn(specification, '_name')) {
        return { alternativeName: specification['_name'] };
    } else if (Object.hasOwn(specification, '_alternative')) {
        return {
            alternativeName: createSelectorName(specification['_alternative'])
        };
    }

    return {};
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

function createSelectorsOfCurrentSpec(
    propertyName,
    propertySpec,
    selectorFunction
) {
    if (Object.hasOwn(propertySpec, '_names')) {
        return propertySpec['_names'].reduce(
            (accSelectors, currentName) => [
                ...accSelectors,
                {
                    selectorName: currentName,
                    ...getAlternativeName(propertySpec),
                    selectorFunction: selectorFunction
                }
            ],
            []
        );
    }

    return [
        {
            selectorName: createSelectorName(propertyName),
            ...getAlternativeName(propertySpec),
            selectorFunction: selectorFunction
        }
    ];
}

function getFunctionProps(state, props, specification) {
    if (Object.hasOwn(specification, '_selectors')) {
        return specification['_selectors'].reduce(
            (accArgs, selectorFunction) => [
                ...accArgs,
                selectorFunction(state, props)
            ],
            []
        );
    } else if (Object.hasOwn(specification, '_propsKeys')) {
        return specification['_propsKeys'].reduce(
            (accArgs, propsKey) => [...accArgs, props[propsKey]],
            []
        );
    }

    return [];
}

function checkIsPlainObject(value) {
    return (
        value !== null &&
        typeof value === 'object' &&
        Object.getPrototypeOf(value) === Object.prototype
    );
}

function _createSelectors(selectorSpecification, parentSelector) {
    return Object.entries(selectorSpecification).reduce(
        (accSelectors, [propertyName, propertySpec]) => {
            if (
                !(
                    checkIsPlainObject(propertySpec) &&
                    propertySpec['_export'] !== false
                )
            ) {
                return accSelectors;
            } else if (
                Object.hasOwn(propertySpec, '_name') &&
                Object.hasOwn(propertySpec, '_names')
            ) {
                throw new Error(
                    `Invariant failed: You cannot use _name (${propertySpec['_name']}) and _names (${propertySpec['_names']}) at the same time.`
                );
            }

            const selectorFunction = (_state, props) => {
                const state = parentSelector(_state, props);

                if (
                    Object.hasOwn(propertySpec, '_key') &&
                    Object.hasOwn(props, propertySpec['_key'])
                ) {
                    return state[props[propertySpec['_key']]];
                } else if (Object.hasOwn(propertySpec, '_func')) {
                    return propertySpec['_func'](
                        state,
                        ...getFunctionProps(state, props, propertySpec)
                    );
                } else if (
                    Object.hasOwn(state, propertyName) &&
                    state[propertyName] !== undefined
                ) {
                    return state[propertyName];
                } else {
                    return getDefaultForPropertySelector(propertySpec);
                }
            };

            return [
                ...createSelectorsOfCurrentSpec(
                    propertyName,
                    propertySpec,
                    selectorFunction
                ),
                ...accSelectors,
                ..._createSelectors(propertySpec, selectorFunction)
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
