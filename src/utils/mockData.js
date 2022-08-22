import {
    ISSUE_ACTIONS,
    USER_TYPE
} from "./constants";

export const curUserId = 1

export const userList = [{
        id: 0,
        name: '包拯',
        pwd: 'baozhen',
        type: USER_TYPE.ADMIN,
        privilege: 3
    },
    {
        id: 1,
        name: '公孙策',
        pwd: 'gongsunce',
        type: USER_TYPE.ADMIN,
        privilege: 3
    }, {
        id: 2,
        name: '展昭',
        pwd: 'zhanzhao',
        type: USER_TYPE.NORMAL,
        privilege: 3
    }, {
        id: 3,
        name: '凌楚楚',
        pwd: 'lingchuchu',
        type: USER_TYPE.NORMAL,
        privilege: 1
    }, {
        id: 4,
        name: '庞飞燕',
        pwd: 'pangfeiyan',
        type: USER_TYPE.NORMAL,
        privilege: 2
    }
]

function getRandomNum(start, end) {
    return Math.ceil(Math.random() * (end - start + 1) + start - 1)
}

function getRandomName() {
    const length = getRandomNum(5, 20)
    const str1 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ '
    let name = ''
    for (let i = 0; i < length; i++) {
        name += str1[getRandomNum(0, 32)]
    }
    return name
}

export function getRandomIssue() {
    const issueList = []
    for (let i = 0; i < 108; i++) {
        let issue = {}
        issue.id = i
        issue.issueName = getRandomName()
        issue.action = getRandomNum(0, 3)
        issue.targetName = getRandomName()
        issue.ownerId = getRandomNum(0, 4)
        if (userList[issue.ownerId].privilege & ISSUE_ACTIONS[issue.action].type === 0) {
            i--
            continue
        }
        const action = ISSUE_ACTIONS[issue.action]
        issue.status = getRandomNum(-1, action.steps.length - 1)
        let timeSpan = getRandomNum(-180, -1)
        issue.startTimeArr = [new Date().setDate(timeSpan)]
        for (let i = 0; i < issue.status; i++) {
            timeSpan = getRandomNum(timeSpan, -1)
            issue.startTimeArr.push(new Date().setDate(timeSpan))
        }
        issue.completeTime = issue.status !== -1 ? '' : new Date().setDate(getRandomNum(timeSpan, -1))
        issue.details = getRandomName()
        issueList.push(issue)
    }
    return issueList
}

// export const issueList = [{
//     id: 0,
//     issueName: '高丽太子案件',
//     action: 0,
//     targetName: '沈良',
//     ownerId: 1,
//     startTimeArr: ['1651363200000'],
//     completeTime: '1651881600000',
//     status: -1,
//     details: '宋朝，大宋西北有辽人虎视眈眈，东北与高丽冲突频盈。在八贤王出面调停下，终与高丽签得盟约，更得高丽国王应允，将甥女嫁与仁宗，令二国永结秦晋。\n高丽护嫁使团来到中土，在庐州稍作休息，然就在此时，随团出使的高丽太子、七皇子却相继被杀，这事牵起了两国冲突，大战一触即发。八贤王受命到庐州缉凶，却为庞太师诸多为难，最后，终凭包拯的机智，将真凶追查出来。原来凶手是辽国潜伏在宋境的间谍，欲借此挑起宋及高丽之争，乘机入侵大宋，幸得包拯将战事消弭于无形，更因此案而名扬天下。'
// }, {
//     id: 1,
//     issueName: '天鸿书院案',
//     action: 0,
//     targetName: '蒙放',
//     ownerId: 0,
//     startTimeArr: ['', '1653436800000'],
//     completeTime: '',
//     endTime: '1654128000000',
//     status: 1,
//     details: '为应付即将而为的秋试，天鸿书院中各学生皆埋头苦读。然就在此时，命案一件一件的发生，包拯的同窗好友，有知遇之恩的院士，亦师亦友的老师，皆一一被杀，更有甚者，书院附近挖掘出了一个消失了的古民族之祭坛，书院内各人之死相，便如祭坛内所刻的咒诅般。书院中登时人心惶惶，众人皆深恐自己是受了咒诅，将是下一个牺牲之人！包拯从不相信鬼神咒诅之说，誓要破除迷信，给同窗好友找出真凶，令其沉冤得雪。\n在包拯的追查下，发觉那消失了的民族，原来是给人一把火灭掉的。当日手染鲜血之人，竟就是今天被害之士，而真凶，竟是书院里的一名死者。'
// }, {
//     id: 2,
//     issueName: '隐逸村之谜',
//     action: 1,
//     targetName: '卓云',
//     ownerId: 0,
//     startTimeArr: ['1651881600000'],
//     completeTime: '',
//     endTime: '1653091200000',
//     status: 0,
//     details: '包拯别过母亲，在红颜知己楚楚及忘年之交、十一岁之小展昭陪伴下，上京赴试。众人途经远在深山的楚楚的老家隐逸村，稍作停留。\n包拯发现隐逸村内各人皆神秘兮兮的，且在六家人的密室里，皆有一具缺了身体一部分的干尸。就在此时，六家人的庄主一个一个的相继被杀，其中更包括楚楚的父亲。包拯全力追查下，发觉这跟各人家人那具干尸有密切的关系，原来在廿多年前，六家庄主将另一名情如手足的兄弟一家杀掉，并将那家人的干尸藏起，以示各人皆有罪在身，互相牵制。包拯终查得真凶，原来是那第七名兄弟之后人，潜伏在村中，等候复仇。'
// }, {
//     id: 3,
//     issueName: '殿前扬威',
//     action: 2,
//     targetName: '崔明冲',
//     ownerId: 0,
//     startTimeArr: ['1653782400000'],
//     completeTime: '',
//     endTime: '1655596800000',
//     status: 0,
//     details: '包拯来到汴京，准备赴试，但有名望的考生，却一个一个的被杀。包拯开始误认为凶手为同届考生赛中原，但随之通过店小二周八斤之死和赛中原的枕头得知凶手另有其人。公孙策破了湖边碑文之谜，遭人下毒。包拯用计捉拿真凶。真凶竟然是太师女婿崔明冲！原来一切动机都源于碑文的秘密。'
// }, {
//     id: 4,
//     issueName: '相国寺血案',
//     action: 2,
//     targetName: '戒贤',
//     ownerId: 0,
//     startTimeArr: ['', '1652918400000'],
//     completeTime: '',
//     endTime: '1654905600000',
//     status: 1,
//     details: '包拯因专注破案，令秋试缺考一科，而根据成绩，包拯亦算进士及第，仁宗虽欲点包拯为龙图阁大学士，包拯却不肯接受。包拯一行人到展昭长大的相国寺参加主持改选大典，却遭遇展昭四师兄戒空、师父衍悔大师、吐蕃高僧达摩智圆寂以及朝廷命官航天豹被杀。\n衍悔大师乃展昭之授业恩师，小展昭悲愤莫名，誓要给衍悔报仇。而最大的疑凶，正是常到相国寺偷东西吃的一班童堂，自称为五鼠之五名少年人。五鼠皆为孤儿，五人虽以偷骗度日，然却兄弟情深，五相扶持。包拯同情之，更觉众人不似是杀人犯，遂加以调查，发现原来真凶竟是展昭三师兄戒贤。戒贤为保相国寺和衍悔大师名声，遂动了杀机。'
// }, {
//     id: 5,
//     issueName: '魔法幻影',
//     action: 3,
//     targetName: '戚老爹',
//     ownerId: 1,
//     startTimeArr: ['', '1652227200000'],
//     completeTime: '',
//     endTime: '1653753600000',
//     status: 1,
//     details: '包拯为躲抓他回相国寺当主持的展昭，于是与公孙策分道回泸州。公孙策等三人途中结识了一知名戏班，结伴同行。然就在来燕镇落脚之时，戏班中各人却一个一个的惨死，戏班中人只感人人自危。\n公孙策彻查之下，根据“冰冰凉凉血，梳梳密密风，谁共涉流水，依仗石桥东”发现了三年前的秘密。原来三年前护卫贡品金龙的大将军一家人被此戏班趁其不备下蒙汗药杀死，只剩下将军一名手下老戚及将军的女儿“丫头”隐姓埋名于祠堂里伺机报仇。最后戏班人被绳之以法，老戚中毒而死。法外容情，将军的女儿“丫头”从轻发落。'
// }, {
//     id: 6
// }]