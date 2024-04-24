import R from 'ramda';

function createSelectorName(selectorName) {
    return `select${selectorName.charAt(0).toUpperCase()}${selectorName.slice(1)}`;
}

function getDefaultValueForType(type) {
    return [];
}

function createSelectors(selectorSpecification) {
    const selectors = {
        selectState: selectorSpecification._selector ?? R.identity
    };

    for (const [key, value] of Object.entries(selectorSpecification)) {
        if (value['_export'] !== false) {
            selectors[createSelectorName(key)] = (state) => {
                if (
                    !Object.hasOwn(state, key) &&
                    Object.hasOwn(value, '_default')
                ) {
                    return value['_default'];
                } else if (
                    !Object.hasOwn(state, key) &&
                    Object.hasOwn(value, '_type')
                ) {
                    return getDefaultValueForType(value['_type']);
                }

                return selectors.selectState(state)[key];
            };
        }
    }

    return selectors;
}

export default createSelectors;
