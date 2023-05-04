项目技术使用 vue3 + pina, 涉及不同平台的跨端工作请参考 uniapp 官方架构。

项目架构

┌─uniCloud              云空间目录，阿里云为uniCloud-aliyun,腾讯云为uniCloud-tcb（详见uniCloud）
│─assets								静态资源 css 相关依赖存放
│─components            符合vue组件规范的uni-app组件目录
│  └─comp-a.vue         可复用的a组件
│─config								工程变量配置存放
├─utssdk                存放uts文件
├─pages                 业务页面文件存放的目录
│  ├─index
│  │  └─index.vue       index页面
│  └─list
│     └─list.vue        list页面
├─static                存放应用引用的本地静态资源（如图片、视频等）的目录，注意：静态资源只能存放于此
├─stores 								pina 文件存放
│  ├─user.js						用户信息
├─uni_modules           存放[uni_module](/uni_modules)。
├─platforms             存放各平台专用页面的目录，详见
├─nativeplugins         App原生语言插件 详见
├─nativeResources       App端原生资源目录
│  └─android            Android原生资源目录 详见
├─hybrid                App端存放本地html文件的目录，详见
├─wxcomponents          存放小程序组件的目录，详见
├─unpackage             非工程代码，一般存放运行或发行的编译结果
│─utils									公用工具方法
├─AndroidManifest.xml   Android原生应用清单文件 详见
├─main.js               Vue初始化入口文件
├─App.vue               应用配置，用来配置App全局样式以及监听 应用生命周期
├─manifest.json         配置应用名称、appid、logo、版本等打包信息，详见
├─pages.json            配置页面路由、导航条、选项卡等页面类信息，详见
└─uni.scss              这里是uni-app内置的常用样式变量

pages 只存放一级页面(由于小程序每个文件夹资源 <= 2M),如需要创建其它页面视图，参考下面的架构完成 [](https://uniapp.dcloud.net.cn/collocation/pages.html#subpackages)

┌─pages
│  ├─index
│  │  └─index.vue
│  └─login
│     └─login.vue
├─pagesA
│  ├─static
│  └─list
│     └─list.vue
├─pagesB
│  ├─static
│  └─detail
│     └─detail.vue
├─static
├─main.js
├─App.vue
├─manifest.json
└─pages.json

---

utils 存放公用方法，使用 ES Modlue 来进行导出引入。
已集成方法如下：
1. requset （基于 promise 封装的网络请求方法）
2. pinyin-engine （支持拼音来检索内容）
3. login （基于不同平台来调用的登录方法，目前只写了小程序，后面需要完善）
4. getStatusBar （获取顶部状态栏高度相关信息）
5. dayJs  (时间库)[文档地址](https://dayjs.gitee.io/docs/zh-CN/parse/now)
6. common (公用方法)

---

componets 存放基础组件
已集成基础组件如下：
1. custom-icon （iconFont 图标组件，也可以使用第三方ui库的，例如 wxcomponents 存放的 vant 组件）
2. nav-bar  (顶部状态栏)
3. empy	 (空页面)
4. select-popup  (选择器弹出框，支持日期与其它选择)
5. cell  (列表组件)

---

hooks 存放功能 hooks 
已集成 hooks 如下：
1. VueRequest [文档地址](https://next.attojs.com/guide/documentation/dataFetching.html)
