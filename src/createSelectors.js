function createSelectors(selectorFunctions) {
    const selectors = selectorFunctions;

    selectors.selectState = (state) => state;

    return selectors;
}

export default createSelectors;
