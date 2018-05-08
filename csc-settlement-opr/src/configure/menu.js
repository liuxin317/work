import HzIcon from '../imgs/head_icon_01.png';
import { routeRootPath } from '../components/common/method';

/**
 * @state 判断在当前子菜单所在的一级菜单
 */
export default [
    {
        name: "企业汇总",
        url: "",
        code: 10,
        state: "aggregate-query",
        icon: HzIcon,
        active: true,
        children: [
            {
                name: "规则查询",
                code: 1001,
                url: routeRootPath + "aggregate-query/rule",
                active: true,
                children: []
            },
            {
                name: "账户查询",
                code: 1002,
                url: routeRootPath + "aggregate-query/account",
                active: true,
                children: []
            },
            {
                name: "付款查询",
                code: 1003,
                url: routeRootPath + "aggregate-query/payment",
                active: true,
                children: []
            }
        ]
    },
    {
        name: "个人汇总",
        url: "",
        code: 20,
        state: "personal-summary",
        icon: HzIcon,
        active: true,
        children: [
            {
                name: "个人查询",
                code: 2001,
                url: routeRootPath + "personal-summary/personage",
                active: true,
                children: []
            }
        ]
    },
    {
        name: "异常处理",
        url: "",
        code: 30,
        state: "exception-handling",
        icon: HzIcon,
        active: true,
        children: [
            {
                name: "交易处理",
                code: 3001,
                url: routeRootPath + "exception-handling/transaction",
                active: true,
                children: []
            }
        ]
    },
    {
        name: "基础配置",
        url: "",
        state: "basic",
        icon: HzIcon,
        active: true,
        children: []
    }
]