## node-graphhql-api 說明
### 功能
* 提供Restful API 資料服務架構
* 提供graphql 資料服務架構
* 通用 REST API 支援 db table CRUD
* 通用 graphql支援 db table查詢
* 封裝可執行檔
### 安裝
* 安裝global工具
  npm install mocha gulp pkg nodemon
* 目錄下執行 npm install
### 開發指令
* gulp
  執行 src/index
* gulp es5
  編譯產生dist目錄，並執行dist/index
* gulp build
  產生執行檔在output目錄下
* gulp test
  執行單元測試，測試結果在test/report.log
* gulp add-route --ns 目錄名稱
  建立新的route規則
* gulp build-model --host 主機 --db db名稱 --table table名稱 --type
  - 建立指定主機指定db上的table schema
  - table (非必填)若不設定為設定則會建立整個db table scema
  - table 若為多個table 以,區隔 例 --table a,b,c , table
  - type 輸出格式 json|js 預設json model
### 設定檔
* index.yml 主設定檔
* hosts.yml 設定db主機資訊
* routes.yml 設定routes
### 規格
* 主系統框架: Express https://expressjs.com/
* Token: 使用JWT https://jwt.io/
* API規格: JSON API https://jsonapi.org/
* ORM: Sequalizejs https://sequelize.org/master/
* 單元測試: mocha https://mochajs.org/
* API測試: supertest https://github.com/visionmedia/supertest
* Task Runner: gulp https://gulpjs.com/
* 封裝:pkg https://github.com/zeit/pkg
* Socket: SocketIO https://socket.io/
* Graphql Apoll Graphql https://www.apollographql.com/docs/apollo-server/
### 使用
1. 透過node直接執行 或透過 forever | pm2 執行
     - 初次使用會自動產生conf目錄檔案，請修改相關設定以符合開發需求
     - dist/index 這是編譯過的es5檔案
     - src/index 這是es6版本程式
2. 可執行檔
     - 透過gulp build 在output/下建立可執性檔
     - 可將封裝的可執行檔複製到機器上執行
     - 初次使用會自動產生conf目錄檔案
3. server設定
     - 預設運行API於 port 3138, socket 3139
     - 可自行修改conf/index.yaml內設定
4. db連線設定
     - 請修改conf/hosts.yml設定
     - 若需連線多主機，可自行增加
5. api route設定
     - 請修改conf/routes.yml設定
     - 可設定運行的api url，並對應程式目錄
6. graphql 設定
     - 請修改conf/index.yml 下graphql設定允許做通用graphql操作的主機與db 
     - 已提供通用graphql 做db table查詢
     - 可在 graphql/types目錄下建立自訂的object type
     - 可在 graphql/query 目錄下自訂查詢項目

## 開發指南
### 建立route
1. 透過gulp add-route可自動產生新的route
    - gulp add-route --n 目錄名稱
    - 指令即會動寫入設定並產生檔案目錄
2. 說明在routes.yml上建立設定資料
    - dir: 新建的api程式檔案放的目錄
    - ns: sample 目錄下所有api 都會預設加上這個ns<br>
      http://localhost:3138/sample/xxx
    - enable: true 是否載入這個設定
    - auth: default 做token驗證使用的jwt id<br>
      jwt id設定在 index.yml內
3. 說明建立的route程式檔案
   - 依照設定檔案，在routes目錄下開目錄
   - 並開子目錄 public/ private
   ex:
   <pre>
    routes/sample/public
                /private
   </pre>
4. route api url
    - 需要驗證token的api url 為 ${ns}/s/xxx
    - public內放不需token驗證的route
      api url為 http://localhost:3138/sample/xxx
    - private內放需要token驗證的route
      api url為 http://localhost:3138/sample/s/xxx
5. route程式
     - 繼承自RouteClass
     - 所有api都寫在route()內
6. RouteClass提供method
     - get 對應建立get method
     - post 對應建立post method
     - put 對應建立put method
     - delete 對應建立delete method
     - json 輸出json
     - orm 取得ORM物件做db連線與操作
### ORM 資料庫操作
1. 建立data model
      - orm若要使用model做orm操作需先建立schema model
      - 使用 gulp build-model 指令建立
2. 建立orm物件
      - 在route內 可直接透過this.orm(hostId, db)取得
      - new ORM(hostId, db) 建立
      - 參數hostId(必填)為要連線的主機 id,對應hosts.yml內的設定
      - 參數db(必填)為要連線的db名稱

3. orm物件提供功能
      - model(tableName) 取得指定table的 data model
      - schema(tableName) 取得指定table的 schema資訊
      - query() 以sql 做db查詢
4. orm支援的model method
      - 這部分adapte自seqlize 的model method
      - bulkCreate 一次新增多筆資料
      - count 取得筆數
      - create 新增資料
      - destroy 刪除
      - findAll 查詢
      - findOne 查詢只取一筆
      - max 取得條件下最大值
      - min 取得條件下最小值
      - sync 同步
      - update 更新資料
      - upsert 資料存在則更新，不存在則新增
### 建立 data model 通用API
1. 建立
     - url: http://localhost:3138/global/model/build/:host/:db
     - method: get
     - 參數 attributes(非必填): 要查詢的欄位以 ,分隔字串列出,預設 未帶attributes則載入全部
     - 參數 page(非必填): 查詢第幾頁,不帶 預設為第一頁
     - 參數 perPage(非必填): 每頁幾筆,不帶 預設不分頁載入全部
     - ex: http://localhost:3138/global/model/build/:host/:db?attributes=a,b,c
### 單一Table 通用API
1. 查詢
     - url: http://localhost:3138/global/db/:host/:db/:table
     - method: get
     - 參數 params
2. 新增
     - url: http://localhost:3138/global/db/:host/:db/:table
     - method: post
     - 參數 values
3. 刪除
     - url: http://localhost:3138/global/db/:host/:db/:table
     - method: delete
     - 參數 params
4. 修改
     - url: http://localhost:3138/global/db/:host/:db/:table
     - method: put
     - 參數 values
5. 建立db table model
     - url: http://localhost:3138/global/model/build/:host/:db
     - method: get
### Graphql 使用
1. 自訂ObjectType
     - src/graphql/schema/types 目錄管理自訂type
2. 管理query
     - src/graphql/schema/query 目錄管理query功能
3. 通用graphal使用
     1. 建立 data model http://localhost:3138/global/model/build/:host/:db
     2. conf/index.yml 設定graphql [{ host:主機 dbs:[] 允許操作的db]
     3. 查詢使用方式
     ```
      {
        host名稱{
          db名稱{
               table名稱(page:1, perPage:10) {
                    欄位..
               }
          }
        }
      }
     ```
### REST 與Graphql 對照
1. 透過通用API查詢
   ```
   http://localhost:3138/global/db/:myHost/:myDb/:myTable?attributes=column1,column2
   ```
2. 透過graphql查詢
   ```
   myHost {
    myDb {
      myTable(page:1, perPage:10) {
        column1
        column2
      }
    }
  }
   ```

        
   
  