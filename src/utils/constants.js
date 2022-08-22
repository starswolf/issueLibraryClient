export const OPTION_ALL = -1

export const USER_TYPE = {
    NORMAL: 0,
    ADMIN: 1
}

export const ISSUE_TYPE = {
    NONE: 0,
    XingShi: 1, // 刑事案件
    XingZheng: 2 // 行政案件
}

export const ISSUE_COMPLETE_STATUS = {
    Complete: 0,
    NoRisk: 1,
    OrangeRisk: 2,
    RedRisk: 3,
    TimeOut: 4
}

export const ISSUE_ACTIONS = [{
    type: ISSUE_TYPE.XingShi,
    name: '刑事拘留',
    value: 0,
    steps: [{
        name: '刑事拘留',
        totalTime: '3 D',
        timeToOrange: '2 D',
        timeToRed: '3 D'
    }, {
        name: '延长羁押期限',
        totalTime: '27 D',
        timeToOrange: '20 D',
        timeToRed: '30 D'
    }]
}, {
    type: ISSUE_TYPE.XingShi,
    name: '取保候审',
    value: 1,
    steps: [{
        name: '取保候审',
        totalTime: '12 M',
        timeToOrange: '9 M',
        timeToRed: '12 M'
    }]
}, {
    type: ISSUE_TYPE.XingShi,
    name: '逮捕',
    value: 2,
    steps: [{
        name: '逮捕',
        totalTime: '2 M',
        timeToOrange: '40 D',
        timeToRed: '50 D'
    }, {
        name: '第一次延长羁押期限',
        totalTime: '1 M',
        timeToOrange: '10 D',
        timeToRed: '20 D'
    }, {
        name: '第二次延长羁押期限',
        totalTime: '2 M',
        timeToOrange: '40 D',
        timeToRed: '50 D'
    }]
}, {
    type: ISSUE_TYPE.XingZheng,
    name: '行政案件立案',
    value: 3,
    steps: [{
        name: '行政调查',
        totalTime: '180 D',
        timeToOrange: '3 M',
        timeToRed: '180 D'
    }, {
        name: '法制审查',
        totalTime: '180 D',
        timeToOrange: '1 M',
        timeToRed: '180 D'
    }]
}]