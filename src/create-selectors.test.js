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
            expect(selectors.selectSimpleBoolean(state, {})).toEqual(false);
        });
        it(`returns a default value for a simple boolean property`, () => {
            const selectors = createSelectors({
                simpleBoolean: {
                    _default: true
                }
            });
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
    });
});
