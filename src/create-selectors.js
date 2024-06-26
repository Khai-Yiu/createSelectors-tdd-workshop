import R, { prop } from 'ramda';

function checkIsPlainObject(value) {
    return (
        value !== null &&
        typeof value === 'object' &&
        Object.getPrototypeOf(value) === Object.prototype
    );
}

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

function getIsForExport(propertyName, specification) {
    return !propertyName.startsWith('$') && specification['_export'] !== false;
}

function createSelectorWithInjectedProps(selectorFunction, accInjectedProps) {
    const selectorWithInjectedProps = (state, props) => {
        const propsToInject = Object.entries(accInjectedProps).reduce(
            (accPropsToInject, [propsKeyName, currentSelector]) => ({
                ...accPropsToInject,
                [propsKeyName]: currentSelector(state, props)
            }),
            {}
        );

        return selectorFunction(state, {
            ...propsToInject,
            ...props
        });
    };

    selectorWithInjectedProps.recomputations = selectorFunction.recomputations;
    selectorWithInjectedProps.newInstance = selectorFunction.newInstance;

    return selectorWithInjectedProps;
}

function createSelectorsOfCurrentSpec(
    propertyName,
    specification,
    selectorFunction,
    accInjectedProps
) {
    const isForExport = getIsForExport(propertyName, specification);
    const selectorWithInjectedProps = createSelectorWithInjectedProps(
        selectorFunction,
        accInjectedProps
    );

    if (Object.hasOwn(specification, '_names')) {
        return specification['_names'].reduce(
            (accSelectors, currentName) => [
                ...accSelectors,
                {
                    selectorName: currentName,
                    ...getAlternativeName(specification),
                    selectorFunction: selectorWithInjectedProps,
                    isExported: isForExport
                }
            ],
            []
        );
    }

    return [
        {
            selectorName: createSelectorName(propertyName),
            ...getAlternativeName(specification),
            selectorFunction: selectorWithInjectedProps,
            isExported: isForExport
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

function getIsObjectEqualShallow(previous, current) {
    if (Object.keys(previous).length !== Object.keys(current).length) {
        return false;
    }

    return Object.entries(previous).reduce((changeFound, [key, value]) => {
        return changeFound && value === current[key];
    }, true);
}

function getIsEqualShallow(previous, current) {
    const previousIsObject = previous instanceof Object;
    const currentIsObject = current instanceof Object;
    if (previousIsObject && currentIsObject) {
        return getIsObjectEqualShallow(previous, current);
    } else if (!previousIsObject && !currentIsObject) {
        return previous === current;
    } else return false;
}

function isCachedResultValid([previousState, previousProps], [state, props]) {
    const isPropsSame = getIsEqualShallow(previousProps, props);
    const isStateSame = getIsEqualShallow(previousState, state);
    return isStateSame && isPropsSame;
}

function createMemoizedSelector(selectorFunction) {
    let numOfComputations = 0;
    let cachedArgs = {
        state: undefined,
        props: undefined
    };
    let cachedResult = undefined;

    const memoizedSelector = (state, props) => {
        if (
            !isCachedResultValid(
                [cachedArgs.state, cachedArgs.props],
                [state, props]
            )
        ) {
            numOfComputations++;
            cachedResult = selectorFunction(state, props);
            cachedArgs = { state, props };
        }

        return cachedResult;
    };

    memoizedSelector.recomputations = () => numOfComputations;

    return memoizedSelector;
}

function createSelectorWithParentState(selectorFunction, parentSelector) {
    const wrappedSelector = (state, props) => {
        return selectorFunction(parentSelector(state, props), props);
    };

    wrappedSelector.recomputations = selectorFunction.recomputations;

    return wrappedSelector;
}

function createRootSelectorWithProps(selectorFunction, specification) {
    if (Object.hasOwn(specification, '_func')) {
        const rootSelectorWithProps = (state, props) => {
            return selectorFunction(
                state,
                getFunctionProps(state, props, specification)
            );
        };

        rootSelectorWithProps.recomputations = selectorFunction.recomputations;

        return rootSelectorWithProps;
    }

    return selectorFunction;
}

function createSelectorWithLogging(
    selectorFunction,
    propertyName,
    specification
) {
    if (specification._log === true) {
        const selectorWithLogging = (state, props) => {
            const result = selectorFunction(state, props);
            console.log(`---- OUT ---- state ----`, state);
            console.log(
                `---- OUT ---- select-${propertyName}-from-parent ----`,
                result
            );

            return result;
        };

        return selectorWithLogging;
    }

    return selectorFunction;
}

function resolvePropertyName(propertyName) {
    return propertyName.startsWith('$') ? propertyName.slice(1) : propertyName;
}

function addNewInjectedProps(
    accInjectedProps,
    specification,
    selectorSpecification
) {
    return {
        ...accInjectedProps,
        ...(specification._stateToProps ??
            selectorSpecification._stateToProps ??
            {})
    };
}

function createSelectorFunction(propertyName, specification) {
    return (state, props) => {
        const resolvedPropertyName = resolvePropertyName(propertyName);

        if (
            Object.hasOwn(specification, '_key') &&
            Object.hasOwn(props, specification['_key'])
        ) {
            return state[props[specification['_key']]];
        } else if (Object.hasOwn(specification, '_func')) {
            return specification['_func'](state, ...props);
        } else if (
            Object.hasOwn(state, resolvedPropertyName) &&
            state[resolvedPropertyName] !== undefined
        ) {
            return state[resolvedPropertyName];
        } else {
            return getDefaultForPropertySelector(specification);
        }
    };
}

function recurseCreateSelectors(
    selectorSpecification,
    parentSelector,
    accInjectedProps = {}
) {
    return Object.entries(selectorSpecification).reduce(
        (accSelectors, [propertyName, propertySpec]) => {
            if (
                !checkIsPlainObject(propertySpec) ||
                propertyName === '_stateToProps'
            ) {
                return accSelectors;
            }

            if (
                Object.hasOwn(propertySpec, '_name') &&
                Object.hasOwn(propertySpec, '_names')
            ) {
                throw new Error(
                    `Invariant failed: You cannot use _name (${propertySpec['_name']}) and _names (${propertySpec['_names']}) at the same time.`
                );
            }

            const updatedAccumulatedInjectedProps = addNewInjectedProps(
                accInjectedProps,
                selectorSpecification,
                propertySpec
            );

            const createNewInstance = () =>
                createSelectorWithLogging(
                    createSelectorWithInjectedProps(
                        createRootSelectorWithProps(
                            createSelectorWithParentState(
                                createMemoizedSelector(
                                    createSelectorFunction(
                                        propertyName,
                                        propertySpec
                                    )
                                ),
                                parentSelector
                            ),
                            propertySpec
                        ),
                        updatedAccumulatedInjectedProps
                    ),
                    propertyName,
                    propertySpec
                );

            const wrappedSelector = createNewInstance();
            wrappedSelector.newInstance = createNewInstance;

            const currentSpecSelectors = createSelectorsOfCurrentSpec(
                propertyName,
                propertySpec,
                wrappedSelector,
                updatedAccumulatedInjectedProps
            );

            const nestedSelectors = recurseCreateSelectors(
                propertySpec,
                wrappedSelector,
                updatedAccumulatedInjectedProps
            );

            return [
                ...accSelectors,
                ...currentSpecSelectors,
                ...nestedSelectors
            ];
        },
        []
    );
}

function removeSelectorsWithExportFalse(selectors) {
    return selectors.reduce((accSelectors, currentSelector) => {
        if (currentSelector.isExported) {
            return [...accSelectors, currentSelector];
        }

        return accSelectors;
    }, []);
}

function createSelectorsObject(selectors) {
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

function createSelectors(selectorSpecification) {
    const parentSelector = selectorSpecification._selector ?? R.identity;
    const selectors = [
        ...removeSelectorsWithExportFalse(
            recurseCreateSelectors(selectorSpecification, parentSelector)
        ),
        {
            selectorName: 'selectState',
            selectorFunction: parentSelector
        }
    ];

    return createSelectorsObject(selectors);
}

export default createSelectors;
