import R from 'ramda';

function createSelectorName(selectorName) {
    return `select${selectorName.charAt(0).toUpperCase()}${selectorName.slice(1)}`;
}

function getDefaultValueForType(type) {
    return [];
}

function getDefaultForPropertySelector(selectorSpecification) {
    if (Object.hasOwn(selectorSpecification, '_default')) {
        return selectorSpecification['_default'];
    } else if (Object.hasOwn(selectorSpecification, '_type')) {
        return getDefaultValueForType(selectorSpecification['_type']);
    }
}

function createSelectors(selectorSpecification) {
    const selectors = {
        selectState: selectorSpecification._selector ?? R.identity
    };

    Object.entries(selectorSpecification).reduce(
        (accumulator, [propertyName, propertySelectorSpec]) => {
            if (propertySelectorSpec['_export'] !== false) {
                return {
                    ...selectors,
                    [createSelectorName(propertyName)]: (selectors[
                        createSelectorName(propertyName)
                    ] = (state) =>
                        Object.hasOwn(state, propertyName)
                            ? selectors.selectState(state)[propertyName]
                            : getDefaultForPropertySelector(
                                  propertySelectorSpec
                              ))
                };
            }

            return accumulator;
        },
        selectors
    );

    return selectors;
}

export default createSelectors;
