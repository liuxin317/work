<template>
  <div id="app">
    <img src="./assets/logo.png">
    <hello></hello>
    <hr>
    <v-html></v-html>
    <hr>
    <v-bind></v-bind>
    <hr>
    <v-if></v-if>
    <hr>
    <v-for></v-for>
    <hr>
    <v-on></v-on>
    <hr>
    <v-modal></v-modal>
    <hr>
    <h1>props</h1>
    <to-do
      v-for="item in groceryList"
      v-bind:todo="item"
      v-bind:key="item.id"
    >
    </to-do>
    <hr>
    <h1>使用Javascript表达式</h1>
    <p>{{ number + 1 }}</p>
    <p>{{ ok ? 'YES' : 'NO' }}</p>
    <p>{{ message.split('').reverse().join('') }}</p>
    <hr>
    <watch></watch>
    <hr>
    <sort></sort>
    <hr>
    <computed></computed>
    <class-style class="active"></class-style>
    <hr>
    <v-show></v-show>
    <hr>
    <v-for-on></v-for-on>
    <hr>
    <event></event>
    <hr>
    <h1>动态Props</h1>
    <input type="text" v-model="parentMsg" />
    <child-prop v-bind="todo" :my-message="parentMsg" :parent-fun="parentFun"></child-prop>
    <hr>
    <emit @increment="incrementTotal"></emit>
    <p>{{ total }}</p>
    <hr>
    <refs ref="myRef"></refs>
    <button @click="triggter">指向ref子组件</button>
    <hr>
    <vuex></vuex>
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view></router-view>
    <router-link to="/modal/12/token">modal</router-link>
    <router-link :to="{name: 'on', query: {userId: 1}}">modal2</router-link>
    <hr>
    <!-- 单个插槽 -->
    <h1>我是父组件标题</h1>
    <my-slot>
      <p>这是一些初始内容</p>
      <p>这是更多的初始内容</p>
    </my-slot>
    <hr>
    <!-- 具名插槽 -->
    <div class="container">
      <name-slot>
        <h1 slot="header">具名插槽</h1>
        <p>主要内容的一个段落</p>
        <p>另一个主要段落</p>
        <p slot="footer">这里有一些联系信息</p>
      </name-slot>
    </div>
    <!-- 作用域插槽 -->
    <hr>
    <div class="parent">
      <h1>作用域插槽</h1>
      <!-- <scope-slot>
        <slot text="hello from child"></slot>
      </scope-slot> -->
    </div>
    <hr>
    <!-- 动态组件 -->
    <div class="is">
      <component :is="currentView"></component>
      <button @click="viewType = 'A'">我是A组件</button>
      <button @click="viewType = 'B'">我是B组件</button>
    </div>
    <hr>
    <!-- 动画过渡 -->
    <div class="transition">
      <h1>动画过渡</h1>
      <!-- <my-transition></my-transition> -->
    </div>
  </div>
</template>

<script>
// 导入组件
import Hello from './components/HelloWorld'
import VHtml from './components/VHtml'
import VBind from './components/VBind'
import VIf from './components/VIf'
import VFor from './components/VFor'
import VOn from './components/VOn'
import VModal from './components/VModal'
import ToDo from './components/ToDo'
import Watch from './components/Watch'
import Sort from './components/Sort'
import Computed from './components/Computed'
import ClassStyle from './components/ClassStyle'
import VShow from './components/VShow'
import VForOn from './components/VForOn'
import Event from './components/Event'
import ChildProp from './components/ChildProp'
import Emit from './components/Emit'
import Refs from './components/Refs'
import Vuex from './components/Vuex'
import { mapMutations, mapActions } from 'vuex'
import MySlot from './components/MySlot'
import NameSlot from './components/NameSlot'
import ScopeSlot from './components/ScopeSlot'
import IsA from './components/IsA'
import IsB from './components/IsB'
// import MyTransition from './components/Transition'
// import store from './components/store'

export default {
  name: 'App',
  components: {
    Hello,
    VHtml,
    VBind,
    VIf,
    VFor,
    VOn,
    VModal,
    ToDo,
    Watch,
    Sort,
    Computed,
    ClassStyle,
    VShow,
    VForOn,
    Event,
    ChildProp,
    Emit,
    Refs,
    Vuex,
    MySlot,
    NameSlot,
    ScopeSlot,
    IsA,
    IsB
  },
  data () {
    return {
      currentView: IsA,
      groceryList: [
        { id: 0, text: '蔬菜' },
        { id: 1, text: '奶酪' },
        { id: 2, text: '随便其它什么人吃的东西' }
      ],
      number: 9,
      ok: true,
      message: 'Hello LiuXin!',
      parentMsg: '父级数据',
      todo: {
        text: 'Learn Vue',
        isComplete: false
      },
      total: 0,
      viewType: 'A'
    }
  },
  methods: {
    ...mapMutations([ // 映射mutations
      'inctrment',
      'addObjAttr'
    ]),
    ...mapActions([ // 映射action
      'incrementBy'
    ]),
    parentFun (msg) {
      alert(msg)
    },
    incrementTotal (type) {
      alert(type)
      this.total += 1
    },
    triggter () {
      this.$refs.myRef.refsTrigger('我访问到你了')
      console.log(this.$refs.myRef.message)
    }
  },
  created () { // 实例被创建之后执行
    console.log('created生命周期')
    this.inctrment({
      amount: 10
    })
    this.addObjAttr({
      a: 20
    })
    // 发送action
    this.incrementBy({ name: 'inctrment', payload: { amount: 20 } })
    console.log(this.$store.state)
  },
  mounted () {
    console.log('mounted生命周期')
  },
  watch: {
    viewType (val, oldVal) {
      if (val === 'A') {
        this.currentView = IsA
      } else if (val === 'B') {
        this.currentView = IsB
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 0 300px 0;
}
</style>
