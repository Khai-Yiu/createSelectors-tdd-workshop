function createSelectors(selectorSpecification) {
    const selectors = {
        selectState: selectorSpecification._selector ?? ((state) => state)
    };

    return selectors;
}

export default createSelectors;
