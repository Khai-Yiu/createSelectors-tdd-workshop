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
        (selectors, [propertyName, propertyValue]) => {
            if (reservedKeywords.includes(propertyName)) {
                return selectors;
            }

            if (
                checkIsPlainObject(propertyValue) &&
                propertyValue._export !== false
            ) {
                const selectorName = createSelectorName(propertyName);
                const { selectState, ...remainingSelectors } = createSelectors({
                    ...propertyValue,
                    _selector: (state) => state[propertyName]
                });

                return {
                    ...selectors,
                    [selectorName]: (state) => {
                        return Object.hasOwn(state, propertyName)
                            ? selectors.selectState(state)[propertyName]
                            : getDefaultForPropertySelector(
                                  selectorSpecification[propertyName]
                              );
                    },
                    ...remainingSelectors
                };
            }

            return selectors;
        },
        selectors
    );
}

export default createSelectors;
