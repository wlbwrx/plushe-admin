# Avue

## avue-crud 表格

用于展示常用表格项,头部操作栏及搜索栏,中间区域为表格内容,下部区域为翻页内容

### option 配置

| 参数           |                     说明                     |         类型         | 可选值 | 默认值 |
| :------------- | :------------------------------------------: | :------------------: | :----: | :----: |
| xxxBtn         |      操作区域按钮(触发 xxxBtnFun 函数)       | string/Function(row) |   -    | false  |
| xxxSngl        |    表格操作栏按钮 (触发 xxxSnglFun 函数)     | string/Function(row) |   -    | false  |
| xxxSngllPoP    | 操作栏按钮弹窗确认(触发 xxxSngllPoPFun 函数) | string/Function(row) |   -    | false  |
| pageHide       |                 是否隐藏页码                 |        booble        |  true  | false  |
| tableSelection |               表格首列开启多选               |        string        |  true  | false  |
| column         |           表格项及表单配置(见下表)           |        Arrar         |   -    |   -    |

#### column 配置

| 参数      |           说明           |   类型   |   可选值    | 默认值 |
| :-------- | :----------------------: | :------: | :---------: | :----: |
| label     |     表头及表单 label     |  string  |      -      |   -    |
| prop      |  表格展示字段/表单字段   |  string  |      -      |   -    |
| search    |       表格搜索字段       |  string  |      -      |   -    |
| hide      |  表格/表单不展示该字段   |  string  |      -      |   -    |
| viewShow  |    详情是否展示该字段    |  booble  |      -      |   -    |
| editHide  |      表单 v-if 隐藏      |  string  |    true     | false  |
| editShow  |     表单 v-show 隐藏     |  string  |    true     | false  |
| formatter |        格式化函数        | Function | (row) => {} |   -    |
| other     | 表单配置项(见 avue-form) |  string  |      -      |   -    |

表格及列表默认展示所有字段
hide 为 true 时隐藏(用于仅搜索)
editHide 为 true 时表单 v-if 隐藏,用于更新时间等展示且不需编辑字段
editShow 为 true 时表单 v-show 隐藏,用于 id 非展示需编辑字段
viewShow 为 true 时表单详情展示 (展示页面http://192.168.8.5:8082/#/order)

### avue-form 配置 同 element-ui 组件

| 参数     |                  说明                   |     类型     |               可选值                | 默认值 |
| :------- | :-------------------------------------: | :----------: | :---------------------------------: | :----: |
| editType | 表单类型(el- base-开头不使用 avue 组件) |    string    | button/input/cascader/select/switch | input  |
| Dict     |          select 表单的字典选项          | Array/Object |                  -                  |   -    |
| rules    |              表单验证规则               |    Array     |                  -                  |   -    |
| other    |        各表单配置 同 element-ui         |     any      |                  -                  |   -    |
