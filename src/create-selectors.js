function createSelectorName(selectorName) {
    return `select${selectorName.charAt(0).toUpperCase()}${selectorName.slice(1)}`;
}

function createSelectors(selectorSpecification) {
    const selectors = {
        selectState: selectorSpecification._selector ?? ((state) => state)
    };

    for (const [key, value] of Object.entries(selectorSpecification)) {
        if (value['_export'] === true) {
            selectors[createSelectorName(key)] = (state) => state[key];
        }
    }

    return selectors;
}

export default createSelectors;
