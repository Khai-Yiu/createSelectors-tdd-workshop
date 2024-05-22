import R from 'ramda';
import createSelectors from './create-selectors';

const state = {
    mapIndex: {
        '5ae40702-2d64-4ab6-b755-646bcf79a286': {
            uuid: '5ae40702-2d64-4ab6-b755-646bcf79a286',
            name: 'one',
            nodeIndex: {
                '883ae08c-562f-4182-a4ee-e62c3325e75a': {
                    uuid: '883ae08c-562f-4182-a4ee-e62c3325e75a',
                    name: 'node1.1'
                },
                'da8d21cd-8b34-40a2-bf17-551df61d07fc': {
                    uuid: '7745ac11-f423-41b3-a2ce-4bf95e65e011',
                    name: 'node1.2'
                }
            }
        },
        'ea9cb69e-0993-40ad-897d-41fae23f2a35': {
            uuid: 'ea9cb69e-0993-40ad-897d-41fae23f2a35',
            name: 'two',
            nodeIndex: {
                'b8bba21b-5416-42e5-81bd-e73bb67f3b50': {
                    uuid: 'b8bba21b-5416-42e5-81bd-e73bb67f3b50',
                    name: 'node2.1'
                },
                '5f391310-fb9c-44bc-a3db-e1572ac340b9': {
                    uuid: '5f391310-fb9c-44bc-a3db-e1572ac340b9',
                    name: 'node2.2'
                }
            }
        }
    },
    anIndexOfObjects: {
        '5ae40702-2d64-4ab6-b755-646bcf79a286': {
            uuid: '5ae40702-2d64-4ab6-b755-646bcf79a286',
            name: 'one'
        },
        '1c9107d1-e8bb-47a3-888f-b22c331ee23b': {
            uuid: '1c9107d1-e8bb-47a3-888f-b22c331ee23b',
            name: 'two'
        }
    },
    aListOfObjects: [
        {
            uuid: '5ae40702-2d64-4ab6-b755-646bcf79a286',
            name: 'one'
        },
        {
            uuid: '1c9107d1-e8bb-47a3-888f-b22c331ee23b',
            name: 'two'
        }
    ],
    anIndexOfString: {
        '5ae40702-2d64-4ab6-b755-646bcf79a286': 'one',
        '1c9107d1-e8bb-47a3-888f-b22c331ee23b': 'two'
    },
    aListOfStrings: ['one', 'two'],
    simpleString: 'three',
    simpleBoolean: false,
    rootOne: {
        anIndexOfObjects: {
            '5ae40702-2d64-4ab6-b755-646bcf79a286': {
                uuid: '5ae40702-2d64-4ab6-b755-646bcf79a286',
                name: 'r1: one'
            },
            '1c9107d1-e8bb-47a3-888f-b22c331ee23b': {
                uuid: '1c9107d1-e8bb-47a3-888f-b22c331ee23b',
                name: 'r1: two'
            }
        },
        aListOfObjects: [
            {
                uuid: '5ae40702-2d64-4ab6-b755-646bcf79a286',
                name: 'r1: one'
            },
            {
                uuid: '1c9107d1-e8bb-47a3-888f-b22c331ee23b',
                name: 'r1: two'
            }
        ],
        anIndexOfString: {
            '5ae40702-2d64-4ab6-b755-646bcf79a286': 'r1: one',
            '1c9107d1-e8bb-47a3-888f-b22c331ee23b': 'r1: two'
        },
        aListOfStrings: ['r1: one', 'r1: two'],
        simpleString: 'r1: three',
        simpleBoolean: false,
        level2: {
            simpleString: 'r1l2: three',
            level3: {
                simpleString: 'r1l3: three'
            }
        }
    },
    rootTwo: {
        anIndexOfObjects: {
            '5ae40702-2d64-4ab6-b755-646bcf79a286': {
                uuid: '5ae40702-2d64-4ab6-b755-646bcf79a286',
                name: 'r2: one'
            },
            '1c9107d1-e8bb-47a3-888f-b22c331ee23b': {
                uuid: '1c9107d1-e8bb-47a3-888f-b22c331ee23b',
                name: 'r2: two'
            }
        },
        aListOfObjects: [
            {
                uuid: '5ae40702-2d64-4ab6-b755-646bcf79a286',
                name: 'r2: one'
            },
            {
                uuid: '1c9107d1-e8bb-47a3-888f-b22c331ee23b',
                name: 'r2: two'
            }
        ],
        anIndexOfString: {
            '5ae40702-2d64-4ab6-b755-646bcf79a286': 'r2: one',
            '1c9107d1-e8bb-47a3-888f-b22c331ee23b': 'r2: two'
        },
        aListOfStrings: ['r2: one', 'r2: two'],
        simpleString: 'r2: three',
        simpleBoolean: false
    }
};

describe(`create-selectors.js`, () => {
    it(`returns the root state if nothing else is specified`, () => {
        const selectors = createSelectors({});
        expect(selectors.selectState(state, {})).toEqual(state);
    });
    it(`uses a given selector instead of creating a new one`, () => {
        const selectors = createSelectors({
            _selector: (state, props) => state && state.rootOne
        });
        expect(selectors.selectState(state, {})).toEqual(state.rootOne);
    });
    describe(`simple properties`, () => {
        it(`creates a selector for a simple property`, () => {
            const selectors = createSelectors({
                simpleString: {
                    _export: true
                }
            });
            expect(selectors.selectSimpleString(state, {})).toEqual(
                state.simpleString
            );
        });
        it(`returns a simple boolean property`, () => {
            const selectors = createSelectors({
                simpleBoolean: {
                    _default: true
                }
            });
            // eslint-disable-next-line
            expect(selectors.selectSimpleBoolean(state, {})).toEqual(false);
        });
        it(`returns a default value for a simple boolean property`, () => {
            const selectors = createSelectors({
                simpleBoolean: {
                    _default: true
                }
            });
            // eslint-disable-next-line
            const { simpleBoolean, ...restState } = state;
            expect(selectors.selectSimpleBoolean(restState, {})).toEqual(true);
        });
        it(`returns a default value for a simple property`, () => {
            const selectors = createSelectors({
                simpleString: {
                    _default: 'default value',
                    _export: true
                }
            });
            // eslint-disable-next-line
            const { simpleString, ...restState } = state;
            expect(selectors.selectSimpleString(restState, {})).toEqual(
                'default value'
            );
        });
        it(`creates a selector for a simple property with a different root`, () => {
            const selectors = createSelectors({
                _selector: (state, props) => state && state.rootOne,
                simpleString: {
                    _export: true
                }
            });
            expect(selectors.selectSimpleString(state, {})).toEqual(
                state.rootOne.simpleString
            );
        });
    });
    describe(`list selection`, () => {
        it(`creates a selector for a simple list property`, () => {
            const selectors = createSelectors({
                aListOfStrings: {
                    _export: true
                }
            });
            expect(selectors.selectAListOfStrings(state, {})).toEqual(
                state.aListOfStrings
            );
        });
        it(`returns an empty list when the selected list does not exist`, () => {
            const selectors = createSelectors({
                aListOfStrings: {
                    _type: 'list',
                    _export: true
                }
            });
            // eslint-disable-next-line
            const { aListOfStrings, ...restState } = state;
            expect(selectors.selectAListOfStrings(restState, {})).toEqual([]);
        });
        it(`returns the default list when the selected list does not exist`, () => {
            const selectors = createSelectors({
                aListOfStrings: {
                    _type: 'list',
                    _default: ['default value'],
                    _export: true
                }
            });
            // eslint-disable-next-line
            const { aListOfStrings, ...restState } = state;
            expect(selectors.selectAListOfStrings(restState, {})).toEqual([
                'default value'
            ]);
        });
        it(`creates a selector for a list property with a different root`, () => {
            const selectors = createSelectors({
                _selector: (state, props) => state && state.rootOne,
                aListOfStrings: {
                    _export: true
                }
            });
            expect(selectors.selectAListOfStrings(state, {})).toEqual(
                state.rootOne.aListOfStrings
            );
        });
    });
    describe(`index selection`, () => {
        it(`creates a selector for a simple index property`, () => {
            const selectors = createSelectors({
                anIndexOfObjects: {
                    _export: true
                }
            });
            expect(selectors.selectAnIndexOfObjects(state, {})).toEqual(
                state.anIndexOfObjects
            );
        });
        it(`returns an empty index if the state does not include the index`, () => {
            const selectors = createSelectors({
                anIndexOfObjects: {
                    _type: 'index',
                    _export: true
                }
            });
            expect(selectors.selectAnIndexOfObjects({}, {})).toEqual({});
        });
        it(`selects an entry from an index`, () => {
            const state = {
                someRoot: {
                    test: {
                        blah: true
                    },
                    mapIndex: {
                        '5ae40702-2d64-4ab6-b755-646bcf79a286': {
                            uuid: '5ae40702-2d64-4ab6-b755-646bcf79a286',
                            name: 'one',
                            nodeIndex: {
                                '883ae08c-562f-4182-a4ee-e62c3325e75a': {
                                    uuid: '883ae08c-562f-4182-a4ee-e62c3325e75a',
                                    name: 'node1.1'
                                },
                                'da8d21cd-8b34-40a2-bf17-551df61d07fc': {
                                    uuid: '7745ac11-f423-41b3-a2ce-4bf95e65e011',
                                    name: 'node1.2'
                                }
                            }
                        },
                        'ea9cb69e-0993-40ad-897d-41fae23f2a35': {
                            uuid: 'ea9cb69e-0993-40ad-897d-41fae23f2a35',
                            name: 'two',
                            nodeIndex: {
                                'b8bba21b-5416-42e5-81bd-e73bb67f3b50': {
                                    uuid: 'b8bba21b-5416-42e5-81bd-e73bb67f3b50',
                                    name: 'node2.1'
                                },
                                '5f391310-fb9c-44bc-a3db-e1572ac340b9': {
                                    uuid: '5f391310-fb9c-44bc-a3db-e1572ac340b9',
                                    name: 'node2.2'
                                }
                            }
                        }
                    }
                }
            };
            const selectors = createSelectors({
                // _export: true,
                someRoot: {
                    _export: true,
                    test: {
                        _export: true
                    },
                    mapIndex: {
                        _type: 'index',
                        _export: true,
                        map: {
                            _export: true,
                            _key: 'mapUuid',
                            nodeIndex: {
                                _type: 'index',
                                _export: true,
                                node: {
                                    _export: true,
                                    _key: 'nodeUuid'
                                }
                            }
                        }
                    }
                }
            });
            expect(selectors.selectState(state, {})).toEqual(state);
            expect(selectors.selectSomeRoot(state, {})).toEqual(state.someRoot);
            expect(selectors.selectTest(state, {})).toEqual(
                state.someRoot.test
            );
            expect(selectors.selectMapIndex(state, {})).toEqual(
                state.someRoot.mapIndex
            );
            expect(
                selectors.selectMap(state, {
                    mapUuid: 'ea9cb69e-0993-40ad-897d-41fae23f2a35'
                })
            ).toEqual(
                state.someRoot.mapIndex['ea9cb69e-0993-40ad-897d-41fae23f2a35']
            );
            expect(
                selectors.selectNode(state, {
                    mapUuid: 'ea9cb69e-0993-40ad-897d-41fae23f2a35',
                    nodeUuid: '5f391310-fb9c-44bc-a3db-e1572ac340b9'
                })
            ).toEqual(
                // eslint-disable-next-line
                state.someRoot.mapIndex['ea9cb69e-0993-40ad-897d-41fae23f2a35']
                    .nodeIndex['5f391310-fb9c-44bc-a3db-e1572ac340b9']
            );
        });
    });
    describe(`nested selector specs`, () => {
        describe(`simple properties`, () => {
            it(`selects a nested simple property on level 1`, () => {
                const selectors = createSelectors({
                    rootOne: {
                        simpleString: {
                            _export: true
                        }
                    }
                });
                expect(selectors.selectSimpleString(state, {})).toEqual(
                    state.rootOne.simpleString
                );
            });
            describe(`boolean values`, () => {
                it(`returns a simple boolean property`, () => {
                    const selectors = createSelectors({
                        rootOne: {
                            simpleBoolean: {
                                _default: true
                            }
                        }
                    });
                    const simpleState = {
                        rootOne: {
                            simpleBoolean: false
                        }
                    };
                    // eslint-disable-next-line
                    expect(
                        selectors.selectSimpleBoolean(simpleState, {})
                    ).toEqual(false);
                });
                it(`returns a default value for a simple boolean property`, () => {
                    const selectors = createSelectors({
                        rootOne: {
                            simpleBoolean: {
                                _default: true
                            }
                        }
                    });
                    const simpleState = {
                        rootOne: {
                            simpleBoolean: undefined
                        }
                    };
                    expect(
                        selectors.selectSimpleBoolean(simpleState, {})
                    ).toEqual(true);
                });
            });
            it(`selects a nested simple property on level 2`, () => {
                const selectors = createSelectors({
                    rootOne: {
                        level2: {
                            simpleString: {
                                _export: true
                            }
                        }
                    }
                });
                expect(selectors.selectSimpleString(state, {})).toEqual(
                    state.rootOne.level2.simpleString
                );
            });
            it(`selects a nested simple property on level 3`, () => {
                const selectors = createSelectors({
                    rootOne: {
                        level2: {
                            level3: {
                                simpleString: {
                                    _export: true
                                }
                            }
                        }
                    }
                });
                expect(selectors.selectSimpleString(state, {})).toEqual(
                    state.rootOne.level2.level3.simpleString
                );
            });
        });
    });
    describe(`error handling`, () => {
        describe(`simple properties`, () => {
            it(`throws an error if a selector name is already in use`, () => {
                const selectors = () =>
                    createSelectors({
                        rootOne: {
                            simpleString: {
                                _export: true
                            },
                            level1: {
                                simpleString: {
                                    _export: true
                                }
                            }
                        }
                    });
                return expect(selectors).toThrow(
                    Error(
                        `Invariant failed: The selector names [selectSimpleString] are already in use. Please use an alternative name using '_name' or '_names'`
                    )
                );
            });
            it(`uses an alternative key if the key is already in use`, () => {
                const selectors = createSelectors({
                    rootOne: {
                        simpleString: {
                            _export: true,
                            _alternative: 'simpleString2'
                        },
                        level2: {
                            simpleString: {}
                        }
                    }
                });
                expect(selectors.selectSimpleString2(state, {})).toEqual(
                    state.rootOne.simpleString
                );
            });
            it(`does not prefix the alternative name with 'select' if '_name'`, () => {
                const selectors = createSelectors({
                    rootOne: {
                        simpleString: {},
                        level2: {
                            simpleString: {
                                _export: true,
                                _name: 'selectSimpleString2'
                            }
                        }
                    }
                });
                expect(selectors.selectSimpleString2(state, {})).toEqual(
                    state.rootOne.level2.simpleString
                );
            });
            it(`uses '_name' over '_alternative'`, () => {
                const selectors = createSelectors({
                    rootOne: {
                        simpleString: {},
                        level2: {
                            simpleString: {
                                _export: true,
                                _alternative: 'dontUseMe',
                                _name: 'selectSimpleString2'
                            }
                        }
                    }
                });
                expect(selectors.selectSimpleString2(state, {})).toEqual(
                    state.rootOne.level2.simpleString
                );
            });
            it(`permits definition of multiple names via '_names'`, () => {
                const selectors = createSelectors({
                    rootOne: {
                        simpleString: {},
                        level2: {
                            simpleString: {
                                _names: [
                                    'selectSimpleString2',
                                    '$$selectSimpleString2'
                                ]
                            }
                        }
                    }
                });
                expect(selectors.selectSimpleString2(state, {})).toEqual(
                    state.rootOne.level2.simpleString
                );
                expect(selectors.$$selectSimpleString2(state, {})).toEqual(
                    state.rootOne.level2.simpleString
                );
            });
            it(`does not permit use '_names' and '_name' at the same time`, () => {
                try {
                    createSelectors({
                        rootOne: {
                            simpleString: {},
                            level2: {
                                simpleString: {
                                    _name: 'selectSimpleString2',
                                    _names: [
                                        'selectSimpleString2',
                                        '$$selectSimpleString2'
                                    ]
                                }
                            }
                        }
                    });
                    fail('Must throw exception');
                } catch (err) {
                    expect(err).toEqual(
                        Error(
                            'Invariant failed: You cannot use _name (selectSimpleString2) and _names (selectSimpleString2,$$selectSimpleString2) at the same time.'
                        )
                    );
                }
            });
        });
    });
    describe(`providing your own return function`, () => {
        it(`calls a provided return function`, () => {
            const state = {
                mapIndex: {
                    '5ae40702-2d64-4ab6-b755-646bcf79a286': {
                        uuid: '5ae40702-2d64-4ab6-b755-646bcf79a286',
                        name: 'one'
                    },
                    'ea9cb69e-0993-40ad-897d-41fae23f2a35': {
                        uuid: 'ea9cb69e-0993-40ad-897d-41fae23f2a35',
                        name: 'two'
                    }
                }
            };
            const selectors = createSelectors({
                // _export: true,
                mapIndex: {
                    _type: 'index',
                    _export: true,
                    map: {
                        _export: true,
                        // lookup the key in the props instead of using 'map'
                        _key: 'mapUuid'
                    },
                    maps: {
                        _type: 'list',
                        _export: true,
                        // apply this function to the result of the root selector
                        _func: Object.values,
                        names: {
                            _type: 'list',
                            _export: true,
                            _func: R.map(({ name } = {}) => name)
                        }
                    },
                    keys: {
                        _type: 'list',
                        _export: true,
                        _func: Object.keys
                    }
                }
            });
            expect(selectors.selectState(state, {})).toEqual(state);
            expect(selectors.selectMapIndex(state, {})).toEqual(state.mapIndex);
            expect(selectors.selectMaps(state)).toEqual(
                Object.values(state.mapIndex)
            );
            expect(selectors.selectKeys(state)).toEqual(
                Object.keys(state.mapIndex)
            );
            expect(selectors.selectNames(state)).toEqual(['one', 'two']);
        });
        it(`calls a provided return function with additional values from the props`, () => {
            const state = {
                mapIndex: {
                    '5ae40702-2d64-4ab6-b755-646bcf79a286': {
                        uuid: '5ae40702-2d64-4ab6-b755-646bcf79a286',
                        name: 'one',
                        deletable: false
                    },
                    'ea9cb69e-0993-40ad-897d-41fae23f2a35': {
                        uuid: 'ea9cb69e-0993-40ad-897d-41fae23f2a35',
                        name: 'two',
                        deletable: true
                    }
                }
            };
            const selectors = createSelectors({
                // _export: true,
                mapIndex: {
                    _type: 'index',
                    _export: true,
                    maps: {
                        _type: 'list',
                        _export: true,
                        // apply this function to the result of the root selector
                        _func: Object.values,
                        mapsByNameAndDeleteFlag: {
                            _type: 'list',
                            _export: true,
                            _propsKeys: ['name', 'deletable'],
                            _func: (maps, name, deletable) => {
                                return maps.filter(
                                    (map) =>
                                        map.name === name &&
                                        map.deletable === deletable
                                );
                            }
                        }
                    }
                }
            });
            expect(selectors.selectState(state, {})).toEqual(state);
            expect(selectors.selectMapIndex(state, {})).toEqual(state.mapIndex);
            expect(selectors.selectMaps(state)).toEqual(
                Object.values(state.mapIndex)
            );
            expect(
                selectors.selectMapsByNameAndDeleteFlag(state, {
                    name: 'one',
                    deletable: false
                })
            ).toEqual([state.mapIndex['5ae40702-2d64-4ab6-b755-646bcf79a286']]);
            expect(
                selectors.selectMapsByNameAndDeleteFlag(state, {
                    name: 'one',
                    deletable: true
                })
            ).toEqual([]);
        });
    });
    describe(`providing additional selector functions`, () => {
        const createSelectFromProps =
            (key) =>
            (state, { [key]: value } = {}) =>
                value;
        it(`executes  additional selector functions and passes the result on to a provided function`, () => {
            const state = {
                mapIndex: {
                    '5ae40702-2d64-4ab6-b755-646bcf79a286': {
                        uuid: '5ae40702-2d64-4ab6-b755-646bcf79a286',
                        name: 'one'
                    },
                    'ea9cb69e-0993-40ad-897d-41fae23f2a35': {
                        uuid: 'ea9cb69e-0993-40ad-897d-41fae23f2a35',
                        name: 'two'
                    }
                }
            };
            const selectors = createSelectors({
                // _export: true,
                mapIndex: {
                    _type: 'index',
                    _export: true,
                    maps: {
                        _type: 'list',
                        _export: true,
                        // apply this function to the result of the root selector
                        _func: Object.values,
                        mapByName: {
                            _export: true,
                            _selectors: [createSelectFromProps('name')],
                            _func: (maps, name) =>
                                maps.find((map) => map.name === name)
                        }
                    }
                }
            });
            expect(selectors.selectMaps(state)).toEqual(
                Object.values(state.mapIndex)
            );
            expect(selectors.selectMapByName(state, { name: 'one' })).toEqual(
                state.mapIndex['5ae40702-2d64-4ab6-b755-646bcf79a286']
            );
        });
    });
    describe(`accessing the root state without impacting the memoization`, () => {
        describe(`providing additional selector functions`, () => {
            it(`executes  additional selector functions and passes the result on to a provided function`, () => {
                const state = {
                    mapIndex: {
                        '5ae40702-2d64-4ab6-b755-646bcf79a286': {
                            uuid: '5ae40702-2d64-4ab6-b755-646bcf79a286',
                            name: 'one'
                        },
                        'ea9cb69e-0993-40ad-897d-41fae23f2a35': {
                            uuid: 'ea9cb69e-0993-40ad-897d-41fae23f2a35',
                            name: 'two'
                        }
                    }
                };
                const selectors = createSelectors({
                    // _export: true,
                    mapIndex: {
                        _type: 'index',
                        maps: {
                            _type: 'list',
                            // apply this function to the result of the root selector
                            _func: Object.values,
                            mapByName: {
                                _propsKeys: ['name'],
                                _func: (maps, name) =>
                                    maps.find((map) => map.name === name)
                            }
                        }
                    }
                });
                expect(selectors.selectMaps(state)).toEqual(
                    Object.values(state.mapIndex)
                );
                expect(
                    selectors.selectMapByName(state, { name: 'one' })
                ).toEqual(
                    state.mapIndex['5ae40702-2d64-4ab6-b755-646bcf79a286']
                );
                selectors.selectMapByName(state, { name: 'one' });
                selectors.selectMapByName(state, { name: 'one' });
                selectors.selectMapByName(state, { name: 'one' });
                expect(selectors.selectMapByName.recomputations()).toEqual(1);
                selectors.selectMapByName(state, { name: 'two' });
                expect(selectors.selectMapByName.recomputations()).toEqual(2);
                selectors.selectMapByName({ ...state }, { name: 'two' });
                expect(selectors.selectMapByName.recomputations()).toEqual(2);
                state.mapIndex['5ae40702-2d64-4ab6-b755-646bcf79a286'].label =
                    'test';
                const newState = {
                    ...state,
                    mapIndex: {
                        ...state.mapIndex,
                        '5ae40702-2d64-4ab6-b755-646bcf79a286': {
                            ...state.mapIndex[
                                '5ae40702-2d64-4ab6-b755-646bcf79a286'
                            ],
                            label: 'test'
                        }
                    }
                };
                selectors.selectMapByName(newState, { name: 'two' });
                expect(selectors.selectMapByName.recomputations()).toEqual(3);
                const newState2 = {
                    ...newState,
                    label: 'test'
                };
                selectors.selectMapByName(newState2, { name: 'two' });
                expect(selectors.selectMapByName.recomputations()).toEqual(3);
            });
        });
    });
    describe(`changing the export behaviour`, () => {
        it(`exports a selector by default or if the _export flag is set to true`, () => {
            const selectors = createSelectors({
                simpleString1: {},
                simpleString2: {
                    _export: true
                }
            });
            expect(selectors.selectSimpleString1).not.toBeUndefined();
            expect(selectors.selectSimpleString2).not.toBeUndefined();
        });
        it(`does not export a selector if the _export flag is set to false or the selector key starts with an '$'`, () => {
            const selectors = createSelectors({
                simpleString2: {
                    _export: false
                },
                $simpleString1: {}
            });
            expect(selectors.selectSimpleString1).toBeUndefined();
            expect(selectors.select$SimpleString1).toBeUndefined();
            expect(selectors.select$simpleString1).toBeUndefined();
            expect(selectors.selectSimpleString2).toBeUndefined();
        });
        it(`does export descendant selectors correctly`, () => {
            const selectors = createSelectors({
                level11: {
                    _export: false,
                    simpleString1: {}
                },
                $level12: {
                    simpleString2: {}
                }
            });
            const state = {
                level11: {
                    simpleString1: 'simpleString1'
                },
                level12: {
                    simpleString2: 'simpleString2'
                }
            };
            expect(selectors.selectLevel11).toBeUndefined();
            expect(selectors.selectLevel12).toBeUndefined();
            expect(selectors.select$Level12).toBeUndefined();
            expect(selectors.selectSimpleString1(state)).toEqual(
                'simpleString1'
            );
            expect(selectors.selectSimpleString2(state)).toEqual(
                'simpleString2'
            );
        });
    });
    describe(`injecting additional props from other selectors (create-state-to-props-selector)`, () => {
        const state = {
            activeLevelName: 'level11',
            secondeActiveLevelName: 'level12',
            level11: {
                simpleString1: 'simpleString1'
            },
            level12: {
                simpleString2: 'simpleString2'
            },
            nestedState: {
                simpleString3: 'simpleString3'
            }
        };

        it(`injects a property with the value from a selector on the same level`, () => {
            const { selectActiveLevelName } = createSelectors({
                activeLevelName: {}
            });
            const { selectActiveLevel } = createSelectors({
                activeLevel: {
                    _stateToProps: {
                        sameLevelActiveLevelName: selectActiveLevelName
                    },
                    _propsKeys: ['sameLevelActiveLevelName'],
                    _func: (state, sameLevelActiveLevelName) => {
                        return state[sameLevelActiveLevelName];
                    }
                }
            });
            expect(selectActiveLevel(state, {})).toEqual({
                simpleString1: 'simpleString1'
            });
        });
    });
});
