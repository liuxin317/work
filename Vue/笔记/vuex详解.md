vuex是一个专门vue.js应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。vuex也集成到Vue得官方调试工具 devtools extension，提供了诸如零配置的time-travel调试、状态快照导入导出等高级调试功能。

开始：

每一个vuex应用的核心就是store（创库）。store基本上就是一个容器，它包含着你的应用中大部分的状态（state）。
vuex和单纯的全局对象有以下两点不同：

- Vuex的状态存储是响应式的。当vue组件从store中读取状态的时候，若store中状态发生变化，那么相应的组件也会相应地得到更高效更新。

- 你不能直接改变store中得状态。改变store中得状态唯一途径就是显示地提交mutation。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。

## 最简答的Store

安装vuex之后，让我们来创建一个store。创建过程直截了当--仅需要提供一个初始state对象和一些mutation：

// 如果在模块化构建系统中，请确保在开头调用了Vue.use(Vuex);
```javascript
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment (state) {
            state.count++
        }
    }
})
```
现在，你可以通过store.state来获取状态对象，以及通过store.commit方法触发状态变更：

store.commit('increment')

console.log(store.state.count) // => 1

再次强调，我们通过提交mutation的方式，而非直接改变store.state.count, 是因为我们想要更明确地追踪到状态的变化。这个简单的约定能够让你的意图更加明显，这样你在阅读代码的时候能更容易地解读应用内部的状态改变。此外，这样也让我们有机会去实现一些能记录每次状态改变，保存状态快照的调试工具。有了它，我们甚至可以实现如时间穿梭般的调试体验。

由于store中的状态是响应式的，在组件中调用store中的状态简单到仅需要在计算属性中返回即可。触发变化也仅仅是在组件的methods中提交mutation。

这是一个最基本的Vuex记数应用示例。

接下啦，我们将会更深入地探讨一些核心概念，让我们先从state概念开始。


## 核心概念

在这一章，我们将会学到Vue的这些核心概念。它们是：

。State
。Getter
。Mutation
。Action
。Module

深入理解所有的概念对于使用Vuex来说是必要的。

# state

单一状态树，用一个对象就包含了全部的应用层级状态。至此它便作为一个唯一数据源而存在。这也意味着，每个应用将仅仅包含一个store实例。单一状态树让我们能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。

单状态树和模块化并不冲突--后面的章节里我们会讨论如何将状态和状态变更事件分布到各个子模块中。

在Vue组件中获得Vuex状态

那么我们如何在Vue组件中展示状态呢？由于vuex的状态存储是响应式的，从store实例中读取状态最简单的方发就是在计算属性中返回某个状态：

```javascript
// 创建一个Counter组件
cont Counter = {
    template: '<div>{{ count }}</div>',
    computed: {
        count () {
            return store.state.count
        }
    }
}
```
每当store.state.count变化的时候，都会重新求取计算属性，并且触发更新相关联的DOM。

然而，这种模式导致组件依赖全局状态单列。在模块化的构建系统中，在每个需要使用state的组件中需要频繁地导入，并且在测试组件时需要模拟状态。

Vuex通过store选项，提供了一种机制将状态从根组件“注入”到每一个子组件中（需调用Vue.use(Vuex)）;

```javascript
const app = new Vue({
    el: '#app',
    // 把store对象提供给“store”选项，这可以把store的实例注入所有的子组件
    store,
    components: { Counter },
    template: `
        <div class="app">
            <counter></counter>
        </div>
    `
})
```

通过在根实例中注册store选项，该store实例会注入到根组件下得所有子组件中，且子组件能通过this.$store访问到。让我们更新下Counter得实现：

```javascript
const Counter = {
    template: `<div>{{ count }}</div>`,
    computed: {
        count () {
            return this.$store.state.count
        }
    }
}
```

## mapState 辅助函数

当一个组件需要获取多个状态时候，将这些状态都声明为计算属性会有些重复和多余。为了解决这个问题，我们可以使用mapState辅助函数帮助我们生成计算属性，让你少按几次键：

```javascript
// 在单独构建的版本中辅助函数为Vuex.mapState

import { mapState } from 'vuex'

export default {
    // ...
    computed: mapState({
        // 箭头函数可使代码更简练
        count: state => state.count,

        // 传字符串参数‘count’等同于‘state => state.count’
        countAlias: 'count',

        // 为了能够使用this获取局部状态，必须使用常规函数
        countPlusLocalState (state) {
            return state.count + this.localCount
        }
    })
}
```

当映射的计算属性的名称与state的子节点名称相同时，我们也可以给mapState传一个字符串数组。

```javascript
computed: mapState([
    // 映射this.count为store.state.count
    'count'
])
```

## 对象开运算符

mapState函数返回的是一个对象。我们如何将它与局部计算属性混合使用呢？通常，我们需要使用一个工具函数将多个对象合并为一个，以使我们可以将最终对象传递给computed属性。但是自从有了对象开运算符，我们可以极大地简化写法：

```javascript
computed: {
    localComputed () {  },
    // 使用对象展开运算符将此对象混入到外部对象中
    ...mapState({
        // ...
    })
}
```

## 组件仍然保有局部状态

使用Vuex并不意味着你需要将所有的状态放入Vuex。虽然将所有的状态放到Vuex会使状态变化更显式和易调试，但也会使代码变得很长和不直观。如果有些状态严格属于单个组件，最好还是作为组件的局部状态。你应该根据你的应用开发需要进行权衡和确定。


# Getter

有时候我们需要从store中得state中派生出一些状态，例如对列表进行过滤并计数：

```javascript
computed: {
    doneTodosCount () {
        return this.$store.state.todos.filter(todo => todo.done).length
    }
}
```

如果有多个组件需要用到此属性，我们要么复制这个函数，或者抽取到一个共享函数然后再多处导入它--无论哪种方式都不是很理想。

Vuex允许我们在store中定义getter（可以认为是store得计算属性）。就像计算属性一样，getter的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

Getter接受state作为其第一个参数：

```javascript
const store = new Vuex.Store({
    state: {
        todos: [
            { id: 1, text: '...', done: true },
            { id: 2, text: '...', done: false }
        ]
    },
    getters: {
        doneTodos: state => {
            return state.todos.filter(todo => todo.done)
        }
    }
})
```

Getter会暴露为store.getters对象：

```javascript
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Getter也可以接受其他getter作为第二个参数：

```javascript
getters: {
    // ...
    doneTodoCount: (state, getters) => {
        return getters.doneTodos.length
    }
}

store.getters.doneTodosCount // -> 1
```

我们很容易地在任何组件中使用它：

```javascript
computed: {
    doneTodosCount () {
        return this.$store.getters.doneTodosCount
    }
}
```

你也可以通过getter返回一个函数，来实现给getter传参。在你对store里的数组进行查询时非常有用。

```javascript
getters: {
    //...
    getTodoById: (state) => (id) => {
        reutrn state.todos.find(todo => todo.id === id)
    }
}

store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

mapGetters 辅助函数

mapGetters 辅助函数仅仅是将store中得getter映射到局部计算属性：

```javascript
import {{ mapGetters }} from 'vuex'

export default {
    // .
    computed: {
        //...
        ...mapGetters({
            'doneTodosCount',
            'anotherGetter',
            // ...
        })
    }
}
```

如果你想将一个getter属性另取一个名字，使用对象形式：

```javascript
mapGetters({
    // 映射`this.doneGount` 为'store.getters.doneTodosCount'
    doneCount: 'doneTodosCount'
})
```

# Mutation

更改Vuex的store中的状态的唯一方式是提交mutation。vuex中的mutation非常类似事件：每个mutation都有一个字符串的事件类型和一个回调函数。这个回调函数就是我们实际进行状态更改的地方，并且它会接受state作为第一个参数：

```javascript
const store = new Vuex.Store({
    state: {
        count: 1
    },
    mutations: {
        increment (state) {
            // 变更状态
            state.count++ 
        }
    }
})
```

你不能直接调用一个mutation handler。这个选项更像是事件注册：“当触发一个类型为increment的mutation时，调用此函数。”需唤醒一个mutation handler，你需要以相应的type调用store.commit方法：

```javascript
store.commit('increment')
```

## 提交载荷（payload）

你可以向store.commit传入额外的参数，即mutation的载荷（payload）：

```javascript
mutations: {
    increment (state, n) {
        state.count += n;
    }
}

store.commit('increment', 10)
```

在大多数情况下，载荷应该是一个对象，这样可以包含多个字段并且记录的mutation会更易读：

```javascript
mutations: {
    increment (state, payload) {
        state.count += payload.amount
    }
}

store.commit('increment', {
    amount: 10
})
```
## 对象风格的提交方式

提交mutation的另一种方式是直接使用包含type属性的对象：

```javascript
store.commit({
    type: 'increment',
    amount: 10
})
```

当使用对象风格的提交方式，整个对象都作为载荷传给mutation函数，因此handler保持不变：

```javascript
mutations: {
    increment (state, payload) {
        state.count += payload.amount
    }
}
```

## Mutation需蹲守Vue的响应规则

既然Vuex的store中的状态是响应式的，那么当我们变更状态时，监视状态的Vue组件也会自动更新。这也意味着Vuex中的mutation也需要与使用Vue一样蹲守一些注意事项: 

1、最好提前在你的store中初始化好所有需属性。
2、当需要在对象上添加新属性时，你应该
- 使用Vue.set(obj, 'newProp', 123)，或者
- 以新对象替换老对象。例如，利用stage-3的对象展开运算符我们可以这样写：

```javascript
state.obj = { ...state.obj, newProp: 123 }
```

## 使用常量替代mutation事件类型

使用常量替代mutation事件类型在各种flux实现中是最常见的模式。这样可以使linter之类的工具发挥作用，同时把这些常量放在单独的文件中可以让你的代码合作者对整个app包含的mutation一目了然：

```javascript
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'

// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutaion_types'

const store = new Vuex.Store({
    state: {

    },
    mutations: {
        // 我们可以使用ES5风格的计算属性命名功能来使用一个常量作为函数名
        [SOME_MUTATION] (state) {
            // mutate state
        }
    }
})
```

用不用常量取决于你--需要多人协助的大型项目中，这会很有帮助，但如果不喜欢，你完全可以不这样做。

## Mutation 必须是同步函数

一条重要的原则就是要记住mutation必须是同步函数。

```javascript
mutations: {
    someMutation (state) {
        api.callAsyncMethod(() => {
            state.count++
        })
    }
}
```

现在想象，我们正在debug一个app并且观察devtool中得mutation日志。每一条mutation被记录，devtools都需要捕捉到前一状态和后一状态的快照。然而，在上面的例子中mutation中得异步函数中回调让这不可能完成：devtools不知道什么时候回调函数实际上被调用--实质上任何在回调函数中进行的状态的改变都是不可追踪的。


## 在组建中提交Mutation

你可以在组件中使用this.$store.commit('')提交mutation，或者使用mapMutations辅助函数将组件中额methods映射为store.commit调用（需要在根节点注入store）。

```javascript
import { mapMutation } from 'vuex'

export default {
    // ...
    methods: {
        ...mapMutations([
            'increment', //将`this.increment()`映射为`this.$store.commit('increment')`
            // `mapMutations` 也支持载荷：
            'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
        ]),
        ...mapMutations({
            add: 'increment' // 将`this.add()`映射为`this.$store.commit('increment')`
        })
    }
}
```

## 下一步：Action

在mutation中混合异步调用会导致你的程序很难调试。例如，当你能调用了两个包含异步回调的mutation来改变状态，你怎么知道什么时候回调和那个先回调呢？这就是为什么我们要区分这两个概念。在Vuex中，mutation都是同步事务：

```javascript
store.commit('increment')
// 任何由increment导致的状态变更都应该在此刻完成。
```

为了处理异步操作，让我们来看一看action.

# Action

action类似于mutation，不同在于：
- Action提交的是mutation，而不是直接变更状态。
- Action可以包含任意异步操作。

让我们来注册一个简单的action:

```javascript
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutation: {
        increment (state) {
            state.count++
        }
    },
    actions: {
        increment (context) {
            context.commit('increment')
        }
    }
})
```
Action函数接受一个与store实例具有相同方法和属性的context对象，因此你可以调用context.state和context.getters来获取state和getters。当我们在之后介绍到Modules时，你就知道context对象为什么不是store实例本身了。

实践中，我们会经常用到ES2015的参数结构来简化代码（特别是我们需要调用commit很多次的时候）：

```javascript
actions: {
    increment ({commit}) {
       commit('increment') 
    }
}
```

## 分发Action

Action通过store.dispatch方法触发：

```javascript
store.dispatch('increment')
```

一眼看上去感觉多此一举，我们直接分发mutation岂不是更好？实际上并非如此，还记得mutation必须同步执行这个限制么？
action就不受约束！我们可以在action内部执行操作：

```javascript
actions: {
    incrementAsync ({commit}) {
        setTimeout(() => {
            commit('increment')
        }, 1000)
    }
}
```

Actions 支持同样的载荷方式和对象进行分发：

```javascript
// 以载荷形式分发
store.dispatch('incrementAsync', {
    amount: 10
})

// 以对象形式分发
store.dispatch({
    type: 'incrementAsync',
    amount: 0
})
```

来看一个更加实际的购物车示例，涉及到调用异步API和分发多重mutation：

```javascript
actions: {
    checkout ({ commit, state }, products) {
        // 把当前购物车的物品备份起来
        const savedCartItems = [...state.cart.added]
        // 发出结账请求，然后乐观地清空购物车
        commit(types.CHECKOUT_REQUEST)

        // 购物车APi接受一个成功和失败的回调
        shop.buyProducts(products, 
            // 成功
            () => commit(types.CHECKOUT_SUCCESS),
            // 失败
            () => commit(types.CHECKOUT_FAILURE, savedCartItems)
        )
    }
}
```

注意我们正在进行一系列的异步操作，并且通过提交mutation来记录action产生的副作用（即状态变更）。

## 组件中分发action

你在组件中使用this.$store.dispatch()来分发action，或者使用mapAction辅助函数组件的methods映射为store.dispatch调用（需要在根节点注入store）：

```javascript
import { mapActions } from 'vuex'

export default {
    //...
    methods: {
        ...mapActions([
            'increment', //将`this.increment()`映射为`this.$store.dispatch('increment')`
            // `mapActions`也支持载荷
            'incrementBy' //将`this.incrementBy(amount)`映射为`this.#store.dispatch('incrementBy', amount)`
        ])
    }
}
```

## 组合Action

action通常是异步的，那么如何知道action什么时候结束呢？更重要的是，我们如何才能组合多个action，以处理更加复杂的异步流程？

首先，你需要明白store.dispatch可以处理被触发的action的处理函数返回的promise，并且store.dispatch仍旧返回promise：

```javascript
actions: {
    actionA ({commit}) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                commit('someMutation')
                resolve()
            }, 1000)
        })
    }
}
```

现在你可以：

```javascript
store.dispatch('actionA').then(() => {
    // ...
})
```

在另一个action中也可以

```javascript
actions: {
    // ...
    actionB ({ dispatch, commit }) {
        return dispatch('actionA').then(() => {
            commit('someOtherMutation')
        })
    }
}
```

最后，如果我们利用async/await, 我们可以如下组合action：

```javascript
// 假设getData()和getOtherData()返回的是Promise
actions: {
    async actionA ({ commit }) {
        commit('gotData', await getData())
    },
    async actionB ({ dispatch, commit }) {
        await dispatch('actionA') // 等待actionA完成
        commit('gotOtherData', await getOtherData())
    }
}
```

一个store.dispatch在不同模块中可以触发多个action函数。在这种情况下，只有当所有触发函数完成后，返回的promise才会执行。


# Module

由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store对象就有可能变得相当臃肿。

为了解决以上问题，vuex允许我们将store分割成模块（module）。每个模块拥有自己的state、mutation、action、getter、甚至是嵌套子模块--从上至下进行同样方式的分割：

```javascript
const moduleA = {
    state: {},
    mutation: {},
    actions: {},
    getters: {}
}

const moduleB = {
    state: { ... },
    mutations: { ... },
    actions: { ... }
}

const store = new Vuex.Store({
    modules: {
        a: moduleA,
        b: moduleB
    }
})

store.state.a // -> moduleA的状态
store.state.b // -> moduleB的状态
```

## 模块的局部状态

对于模块内部的mutation和getter，接受的第一个参数是模块的局部状态对象。

```javascript
const moduleA = {
    state: { count: 0 },
    mutations: {
        increment (state) {
            // 这里的state对象时模块的局部状态
            state.count++
        }
    },
    getters: {
        doubleCount (state) {
            return state.count * 2
        }
    }
}
```

同样，对于模块内部的action，局部状态通过context.state暴露出来，根节点状态则为context.rootState:

```javascript
const moduleA = {
    // ...
    actions: {
        incrementIfOddOnRootSum({ state,commit, rootState }) {
            if ((state.count + rootState.count)%2 === 1) {
                commit('increment')
            }
        }
    }
}
```

对于模块内部的getter，根节点状态会作为第三个参数暴露出来：

```javascript
const moduleA = {
    //...
    getters: {
        sumWithRootCount (state, getters, rootState) {
            return state.count + rootState.count
        }
    }
}
```

## 命令空间

默认情况系，模块内部的action、mutation和getter是注册在全局命名空间的--这样使得多个模块能够对同一mutation或action作出响应。

如果希望你的模块具有更高的封装度和复用性，你可以通过添加namespaced: true 的方式使其成为命名空间模块。当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。例如：


