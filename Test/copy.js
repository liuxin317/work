var companyId = getCookie('acompanyId');
var masterId  = getCookie('amasterId');
var tenantId  = getCookie('atenantId');
var orgCode = getCookie('orgCode');

var Content = React.createClass({ // 根组件;
  getInitialState: function() {
    return {
      data: [],
      name: '', // 新增或者编辑的姓名
      email: '', // 电子邮箱;
      saveState: 1,
      userId: '',
      // tenantUserId: '',
      isSuccess: true,
      addCallback: true,
      iText: '',
      adminState: '',
      current: 1,
      loading: true,
      iconLoading: false,
      listPageSize: 10,
      keywords: '',
      regist: {},
      perResources: [],
      userResources: [],
      rspDesc: '',
      errorInfo: '',
      tabIdentification: 1, // tab切换标识(1 => 人员管理， 2 => 职位管理);
      orgsOfTree: [], // 组织机构数据;
      orgs: '', // 组织机构搜索id;
      positions: [], // 职位数据;
      orgId: '', // 新增/编辑主数据Id
      positionId: '', // 当前职位Id
      tenantUserId: '', // 编辑保存时传的Id;
      replaceOrgName: '', // 当前列表公司名称;
      replaceOrgId: '', // 当前列表公司ID;
      replaceOrgNameZ: '', // 编辑组织机构名称
      initTreeData: null // 方法;
    }
  },
  componentDidMount: function () {
    if (this.state.tabIdentification === 1) {
      this.getTenantUserList(this, 1, this.state.keywords, this.state.listPageSize);
    }
  },
  escLoad: function (status) { // 管理全屏蒙版;
    this.setState({
      loading: status
    });
  },
  keyWord: function () {
    if (this.state.isSuccess) {
      var keywords = arguments[0];
      var orgs = arguments[1];

      this.setState({
        isSuccess: false,
        loading: true,
        keywords: keywords,
        orgs: orgs,
        current: 1
      })

      this.getTenantUserList(this,1,keywords,this.state.listPageSize, orgs);
    }
  },
  getTenantUserList: function (_this,number,keyWord,listPageSize,orgs) {
    if (keyWord === undefined) {
      keyWord = ''
    };

    if (orgs === '') {
      orgs = '';
    } else if (orgs === undefined) {
      orgs = _this.state.orgs;
    };

    ajaxStart("POST",{
      addr: "getTenantUserList",
      companyId: companyId,
      keyword: keyWord,
      pageNumber: number,
      orgs: orgs,
      pageSize: listPageSize
    },function(data){
      _this.setState({
        data: data.data,
        isSuccess: true,
        loading: false
      });
    },function(){
      _this.setState({
        loading: false
      });
    });
  },
  closePop: function () {
    this.setState({ perResources: [], userResources: [], rspDesc: '' });

    document.getElementsByTagName('body')[0].style.height = 'auto';
    document.getElementsByClassName('pop-box')[0].style.display = 'none';
    document.getElementsByClassName('pop-box1')[0].style.display = 'none';
  },
  showAddPop: function (orgsOfTree) { // 添加用户;
    var bodyH = document.getElementsByTagName('body')[0].clientHeight;
    if (bodyH < 628) {
      document.getElementsByTagName('body')[0].style.height = '628px';
    }
    this.refs.organization.clearName();
    this.getOrgsOfTree(1);
    this.setReloaData();

    this.setState({ 
      loading: false,
      saveState: 1,
      name: '',
      email: '',
      orgId: '',
      positionId: '',
      tenantUserId: '',
      isSuccess: true,
      errorInfo: '',
      orgsOfTree: orgsOfTree,
      replaceOrgName: '',
      replaceOrgId: '',
      replaceOrgNameZ: ''
    });

    this.refs.phoneInput.disabled = false;
    this.refs.phoneInput.style.backgroundColor = '#fff';
    this.refs.phoneInput.value = '';
    this.refs.nameInput.value = '';
    this.refs.emailInput.value = '';
    document.getElementsByClassName('pop-box')[0].style.display = 'block';
  },
  getOrgsOfTree: function (type, d) { // 获取组织机构树
    var _this = this;
    ajaxStart("POST",{
      addr: "getOrgsOfTree",
      code: orgCode
    },function(data){
      _this.setState({
        orgsOfTree: data.orgs,
        orgId: data.orgs[0].id
      });
      if (type == 1) {
        _this.getPostions(data.orgs[0], 1);
      } else {
        _this.editGetPostions(d);
      }
    });
  },
  showChangePop: function () { // 编辑用户;
    var bodyH = document.getElementsByTagName('body')[0].clientHeight;
    var data = arguments[5];
    this.refs.organization.clearName();
    this.getOrgsOfTree(2, data);
    this.setReloaData();

    if (bodyH < 628) {
      document.getElementsByTagName('body')[0].style.height = '628px';
    }

    this.setState({ 
      loading: true,
      saveState: 2,
      name: arguments[1],
      email: data.companyUserEmail,
      orgId: data.orgId,
      positionId: data.positionId,
      tenantUserId: arguments[2],
      userId: arguments[3],
      isSuccess: true,
      errorInfo: '',
      replaceOrgNameZ: data.organizationName,
      replaceOrgId: data.orgId
    });

    this.refs.phoneInput.disabled = true;
    this.refs.phoneInput.style.backgroundColor = '#eee';
    this.refs.phoneInput.value = arguments[0]; // 电话号码;
    this.refs.nameInput.value = arguments[1];
    this.refs.emailInput.value = data.companyUserEmail;
    document.getElementsByClassName('pop-box')[0].style.display = 'block';
    this.getPermission(arguments[4],arguments[3]); // 调用权限接口;
  },
  editGetPostions: function (data) { // 编辑获取职位列表;
    var item = data;
    var _this = this;

    ajaxStart("POST",{
      addr: "getPositions",
      orgId: item.orgId
    },function(data){
      _this.setState({
        positions: data.positions,
        orgId: item.orgId,
        replaceOrgName: item.positionName
      })
      _this.refs.position.clearName();
    });
  },
  switchImg: function() {
    if (true) {
      this.setState({
        showImg: false
      })
      document.getElementById('j').style.display = 'none';
      document.getElementById('s').style.display = 'block';
    } else {
      this.setState({
        showImg: true
      })
      document.getElementById('j').style.display = 'block';
      document.getElementById('s').style.display = 'none';
    }
  },
  testPhone: function(event) { // 查询姓名;
    var self = this;

    var sMobile = event.target.value.trim();

    if(!(/^1[3|4|5|8|7|6][0-9]\d{8}$/.test(sMobile))){
      this.setState({
        addName: '',
        perResources: [], 
        userResources: [], 
        rspDesc: ''
      });
    }else {
      this.setState({
        addName: '',
        userId: ''
      });

      if (this.state.addCallback) {
        this.setState({
          addCallback: false
        });

        ajaxStart("POST",{
          addr: "findUserByPhone",
          companyId: companyId,
          phone: sMobile
        },function(data){
          self.setState({
            userId: data.userId,
            loading: true,
            addCallback: true,
            name: data.name
          })

          self.getPermission(companyId,data.userId);
        },function(){
          self.setState({
            addCallback: true
          })
        });
      };
    }
  },
  saveTenantUser: function () { // 添加/编辑;
    var self = this;
    
    if (this.refs.nameInput.value === '') {
      antd.message.warning('姓名不能为空');
      return false;
    } else if (this.refs.phoneInput.value === '') {
      antd.message.warning('手机号不能为空');
      return false;
    } else if(!(/^1[3|4|5|8|7|6][0-9]\d{8}$/.test(this.refs.phoneInput.value))) {
      antd.message.warning('手机号格式不正确');
      return false;
    } else if (self.state.email) {
      if (!(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/).test(self.state.email)) {
        antd.message.warning('邮箱格式不正确');
        return false;
      }
    }
 
    if (this.state.isSuccess) {
      self.setState({
        isSuccess: false,
        iconLoading: true
      });

      if (self.state.saveState == 1) { // 添加;
        var obj = {
          addr: "saveTenantUser",
          companyId: companyId,
          tenantId: tenantId,
          userId: self.state.userId,
          masterCompanyId: masterId,
          name: self.state.name,
          orgId: self.state.orgId,
          email: self.state.email,
          pers: self.state.userResources === null ? self.state.userResources : self.state.userResources.join(',')
        };

        if (self.state.positionId) {
          obj.positionId = self.state.positionId;
        };

        var sendDate = obj;
        
        // var sendDate = {
        //   addr: "saveTenantUser",
        //   companyId: companyId,
        //   tenantId: tenantId,
        //   userId: self.state.userId,
        //   masterCompanyId: masterId,
        //   name: self.state.name,
        //   orgId: self.state.orgId,
        //   positionId: self.state.positionId,
        //   email: self.state.email,
        //   pers: self.state.userResources === null ? self.state.userResources : self.state.userResources.join(',')
        // }
      }else { // 编辑;
        var obj = {
          addr: "saveTenantUser",
          tenantId: tenantId,
          companyId: companyId,
          userId: self.state.userId,
          masterCompanyId: masterId,
          name: self.state.name,
          orgId: self.state.orgId,
          email: self.state.email,
          tenantUserId: self.state.tenantUserId,
          pers: self.state.userResources === null ? self.state.userResources : self.state.userResources.join(',')
        };

        if (self.state.positionId) {
          obj.positionId = self.state.positionId;
        };

        var sendDate = obj;

        // ajaxStart("POST",sendDate,function(data){
        //   if (self.state.saveState == 1) {
        //     antd.message.success('添加成功');
        //     self.getTenantUserList(self, 1, self.state.keywords,self.state.listPageSize);
        //   }else {
        //     antd.message.success('编辑成功');
        //     self.getTenantUserList(self, self.state.current, self.state.keywords,self.state.listPageSize);
        //   }
          
        //   self.closePop();
        //   self.setState({
        //     isSuccess: true,
        //     iconLoading: false
        //   });
        // },function() {
        //   self.setState({
        //     isSuccess: true,
        //     iconLoading: false
        //   });
        // });
      }

      var addPermissionData = {
        addr: "updatePermission",
        companyId: companyId,
        userId: self.state.userId,
        pers: self.state.userResources === null ? self.state.userResources : self.state.userResources.join(',')
      };

      self.addPermission(addPermissionData, sendDate);
    }
  },
  addPermission: function (addPermissionData,sendDate) { // 添加权限接口;
    var self = this;

    ajaxStart("POST",addPermissionData,function(data){
      ajaxStart("POST",sendDate,function(data){
        if (self.state.saveState == 1) {
          antd.message.success('添加成功');
          self.getTenantUserList(self, 1, self.state.keywords,self.state.listPageSize);
        }else {
          antd.message.success('编辑成功');
          self.getTenantUserList(self, self.state.current, self.state.keywords,self.state.listPageSize);
        }
        
        self.closePop();
        self.setState({
          isSuccess: true,
          iconLoading: false
        });
      },function() {
        self.setState({
          isSuccess: true,
          iconLoading: false
        });
      });
    },function() {
      self.setState({
        isSuccess: true,
        iconLoading: false
      });
    });
  },
  changeUserState: function () { // 冰冻/启用;
    var self = this;
    var state = arguments[0];
    var tenantUserId = arguments[1];
    
    if (this.state.isSuccess) {
      self.setState({
        isSuccess: false,
        loading: true
      });

      ajaxStart("POST",{
        addr: 'changeUserState',
        state: state == 1 ? 0 : 1,
        tenantUserId: tenantUserId
      },function(data){
        if (state == 1) {
          antd.message.success('冻结成功');
        }else {
          antd.message.success('启用成功');
        }

        self.getTenantUserList(self, self.state.current, self.state.keywords, self.state.listPageSize);
        self.setState({
          isSuccess: true,
          loading: false
        });
      });
    }
  },
  confirm: function () {
    document.getElementsByClassName('confirm')[0].style.display = 'block';
    if (arguments[0] == 1) {
      this.setState({
        iText: '确定冻结该用户嘛？',
        tenantUserId: arguments[1],
        adminState: arguments[0]
      })
    }else {
      this.setState({
        iText: '确定启用该用户嘛？',
        tenantUserId: arguments[1],
        adminState: arguments[0]
      })
    }
  },
  hideConfirm: function () { //取消提示弹窗;
    document.getElementsByClassName('confirm')[0].style.display = 'none';
  },
  enterZx: function () { // 确认的回调函数;
    this.changeUserState(this.state.adminState,this.state.tenantUserId);
    document.getElementsByClassName('confirm')[0].style.display = 'none';
  },
  onPageChange: function(page) { // 页码改变的回调
    this.setState({
      current: page,
      loading: true
    });
    this.getTenantUserList(this, page, this.state.keywords,this.state.listPageSize);
  },
  pageTz: function () { // 跳转页面;
    var parInput = document.getElementById('page');
    if (parInput.value < 0) {
      antd.message.warning('条数不能小于0');
    } else if (parInput.value === '') {
      antd.message.warning('条数不能为空');
    } else if (parInput.value > Math.ceil(this.state.data.total / this.state.listPageSize)) {
      antd.message.warning('没有那么多条数');
    } else {
      this.setState({
        current: Number(parInput.value),
        loading: true
      });
      this.getTenantUserList(this, parInput.value, this.state.keywords,this.state.listPageSize);
    }
  },
  selectSize: function (value) { // 每页展示多少条;
    this.setState({
      listPageSize: Number(value)
    })
    this.getTenantUserList(this,1,this.state.keywords,value);
  },
  getInitRegistData: function (data) {
    this.setState({
      regist: data
    });
  },
  removeList: function (id) { // 删除功能
    this.setState({
      loading: true
    });

    var self = this;

    ajaxStart("POST",{
      addr: 'delTenantUser',
      tenantUserId: id
    },function(data){
      antd.message.success('删除成功');
      self.getTenantUserList(self, self.state.current, self.state.keywords, self.state.listPageSize);
      self.setState({
        loading: false
      });
    },function () {
      self.setState({
        loading: false
      });
    });
  },
  getPermission: function (companyId,userId) { // 权限请求;
    var self = this;
    self.setState({
      errorInfo: ''
    })

    ajaxStart("POST",{
      addr: 'getPermission',
      companyId: companyId,
      userId: userId
    },function(data){
      self.setState({
        loading: false,
        perResources: data.perResources,
        userResources: data.userResources,
        rspDesc: data.rspDesc
      })
    },function (info) {
      self.setState({
        loading: false,
        errorInfo: info
      })
    });
  },
  setUserResources: function (pers) {
    this.setState({ userResources: pers });
  },
  showDetail: function () {
    var bodyH = document.getElementsByTagName('body')[0].clientHeight;
    if (bodyH < 628) {
      document.getElementsByTagName('body')[0].style.height = '628px';
    }

    this.setState({ 
      loading: true
    });

    document.getElementsByClassName('pop-box1')[0].style.display = 'block';
    this.getPermission(arguments[0],arguments[1]); // 调用权限接口;
  },
  tabSwitch: function (identification) { // tab切换;
    this.escLoad(true);

    if (identification === 1) {
      this.getTenantUserList(this, 1, this.state.keywords, this.state.listPageSize);
    };

    this.setState({
      tabIdentification: identification
    });
  },
  testEmail: function (event) { // 监听邮箱状态;
    var email = event.target.value.trim();
    this.setState({
      email: email
    });
  },
  testName: function (event) { // 监听姓名value
    var name = event.target.value.trim();
    this.setState({
      name: name
    });
  },
  getPostions: function (data, type) { // 根据选择组织机构树查询职位;
    var item = data;
    var _this = this;

    ajaxStart("POST",{
      addr: "getPositions",
      orgId: item.id
    },function(data){
      if (type == 1) {
        _this.setState({
          positions: data.positions,
          positionId: data.positions && data.positions.length ? data.positions[0].id : '',
          orgId: item.id
        })
      } else {
        _this.setState({
          positions: data.positions,
          orgId: item.id,
          positionId: '',
          replaceOrgName: ''
        })
      }
      _this.refs.position.clearName();
    });
  },
  getPostionsDate: function (data) { // 选中的职位;
    this.setState({
      positionId: data.id
    })
  },
  setReloaData: function (fun) {
    if (fun) {
      this.setState({
          initTreeData: fun
      });
    };

    if (this.state.initTreeData) {
      this.state.initTreeData();
    };

    // if (fun) {
    //   if (this.state.saveState == 2) {
    //     // fun()
    //   };
    //   this.setState({
    //     initTreeData: fun
    //   });
    // } else {
    //   if (this.state.initTreeData) {
    //     this.state.initTreeData();
    //   };
    // }
  },
  render: function() {
    return (
      <section className="container">
        <antd.Spin spinning={this.state.loading} size="large">
        <div className="box">
          <div className="head-tab">
            {
              this.state.tabIdentification === 1 
              ?
              <div>
                <a onClick={ this.tabSwitch.bind(this, 1) } className="active" href="javascript: ">人员管理</a>
                <a onClick={ this.tabSwitch.bind(this, 2) }  href="javascript: ">职位管理</a>
              </div>
              : 
              <div>
                <a onClick={ this.tabSwitch.bind(this, 1) } href="javascript: ">人员管理</a>
                <a onClick={ this.tabSwitch.bind(this, 2) }    className="active" href="javascript: ">职位管理</a>
              </div>
            }
          </div>
          {
            this.state.tabIdentification === 1 
            ?
            <div className="personnel"> {/* 人员管理 */}
              <BoxTop fun={ this.showAddPop } cx={ this.keyWord } orgsOfTrees={this.state.orgsOfTree} />

              <BoxCent 
              didMount={ this.componentDidMount } 
              showImg={ this.switchImg } 
              fun={ this.showChangePop } 
              data={ this.state.data } 
              confirms={ this.confirm } 
              pageChange={ this.onPageChange } 
              page={ this.state.current } 
              pageSize= { this.state.listPageSize } 
              pageTz={this.pageTz} 
              selectSize={this.selectSize} 
              getInitRegistData={this.getInitRegistData} 
              removeList={this.removeList} 
              getPermission={this.getPermission} 
              orgsOfTrees={this.state.orgsOfTree}
              showDetail={this.showDetail} /> 
            </div>
            :
            <div className="job"> {/* 职位管理 */}
              <JobManagement escLoad={ this.escLoad } />
            </div>
          }
        </div>
        </antd.Spin>

        <section className="pop-box">
          <div className="pop-group">
            <figure>
              <figcaption className="pull-left">{this.state.saveState == 1 ? '用户添加' : '用户编辑'}</figcaption>
              <antd.Icon onClick={this.closePop} className="pull-right" type="close" />
              <div className="clear"></div>
            </figure>

            <div className="input-row admin-phone">
              <label className="pull-left" for="name"><em>*</em> 手机号：</label>
              <input className="pull-left" onKeyUp={ this.testPhone } placeholder="输入手机号" type="text" ref="phoneInput" />
              <div className="clear"></div>
            </div>

            <div className="input-row admin-name">
              <label className="pull-left" for="name"><em>*</em> 姓名：</label>
              <input className="pull-left" type="text" ref="nameInput" placeholder="输入姓名" onChange={ this.testName } value={ this.state.name } />
              <div className="clear"></div>
            </div>

            <div className="input-row admin-phone">
              <label className="pull-left" for="name">邮箱：</label>
              <input className="pull-left" onKeyUp={ this.testEmail } placeholder="输入邮箱" type="text" ref="emailInput" />
              <div className="clear"></div>
            </div>

            <div className="dropdown zhuzhi">
              <Dropdown name="组织机构：" setReloaData={this.setReloaData} ref="organization" saveState={ this.state.saveState } isDisplayBox={true} replaceOrgName={this.state.replaceOrgNameZ} displaySearch={true} checkbox={false} orgsOfTree={this.state.orgsOfTree} oneTreeData={true} radioActive={this.getPostions} />
            </div>

            <div className="dropdown postions">
              <Position name="职位：" saveState={this.state.saveState} ref="position" orgsOfTree={ this.state.positions } radioActive={this.getPostionsDate} replaceOrgName={ this.state.replaceOrgName } />
            </div>

            <div className="jx-admin">
              <h4>权限管理</h4>

              <antd.Spin spinning={this.state.loading} tip="Loading...">
              <div style={{ height: '240px' }}>
                {
                  this.state.perResources && this.state.perResources.length
                  ?
                  <AuthGroup perResources={this.state.perResources} userResources={this.state.userResources} setUserResourcesFn={this.setUserResources} />
                  :
                  this.state.perResources === null ?
                  <p style={{textAlign: 'center', fontSize: '14px', color: '#999'}}>该用户无权限，请联系超级管理员</p>
                  :<p style={{textAlign: 'center', fontSize: '14px', color: '#999'}}>{this.state.errorInfo}</p>
                }
              </div>
              </antd.Spin>
            </div>

            <div className="btn-group">
              <antd.Button type="primary" className="btn-close" onClick={this.closePop}>
                    取消
                  </antd.Button>
              <antd.Button type="primary" className="btn-enter" loading={this.state.iconLoading} onClick={this.saveTenantUser}>
                    确定
              </antd.Button>
            </div>
          </div>
        </section>

        <section className="confirm">
          <div className="confirm-box">
            <p>{ this.state.iText }</p>
            <div className="confirm-btn">
              <a onClick={ this.hideConfirm } href="javascript: ">取消</a>
              <a onClick={ this.enterZx } href="javascript: ">确认</a>
            </div>
          </div>
        </section>

        <section className="pop-box1">
          <div className="pop-group">
            <figure>
              <figcaption className="pull-left">权限详情</figcaption>
              <antd.Icon onClick={this.closePop} className="pull-right" type="close" />
              <div className="clear"></div>
            </figure>

            <div className="jx-admin">
              <antd.Spin spinning={this.state.loading} tip="Loading...">
              <div style={{ height: '240px' }}>
                {
                  this.state.perResources && this.state.perResources.length
                  ?
                  <AuthGroup perResources={this.state.perResources} userResources={this.state.userResources} setUserResourcesFn={this.setUserResources} showAuth={true} />
                  :
                  this.state.perResources === null ?
                  <p style={{textAlign: 'center', fontSize: '14px', color: '#999'}}>该用户无权限，请联系超级管理员</p>
                  :<p style={{textAlign: 'center', fontSize: '14px', color: '#999'}}>{this.state.errorInfo}</p>
                }
              </div>
              </antd.Spin>
            </div>

            <div className="btn-group">
              <antd.Button type="primary" className="btn-close" onClick={this.closePop}>关闭</antd.Button>
            </div>
          </div>
        </section>

        <RegistrationTransfer regist={this.state.regist} />
      </section>
    )
  }
});

var BoxTop = React.createClass({ // 头部;
  getInitialState: function () {
    return {
      keyword: '',
      searchPostionData: '', // 搜索组织机构;
      orgsOfTree: [] //组织机构数据; 
    }
  },
  componentDidMount: function () {
    this.getOrgsOfTree();
  },
  getOrgsOfTree: function () { // 获取组织机构树
    var _this = this;
    ajaxStart("POST",{
      addr: "getOrgsOfTree",
      code: orgCode
    },function(data){
      _this.setState({
        orgsOfTree: data.orgs
      });
    });
  },
  handleChange: function (event) {
    this.setState({
      keyword: event.target.value
    })
  },
  setSearchPostionData: function (data) { // 选中查询数据替换;
    var str = '';
    data.forEach(function(item) {
      str += item.id +','
    });

    this.setState({
      searchPostionData: str.substr(0, str.length-1)
    });
  },
  clearSearchPostionData: function () { // 清空选择;
    this.setState({
      searchPostionData: ''
    });
  },
  render: function() {
    return (
      <div className="box-top">
        <div className="pull-left" id="search">
          <input className="pull-left search-info" type="text" onChange = { this.handleChange } placeholder="请输入用户手机号/姓名/邮箱" />
          <Dropdown name="组织机构：" isDisplayBox={true} displaySearch={true} checkbox={true} postionData={this.setSearchPostionData} orgsOfTree={this.state.orgsOfTree} clearSearchPostionData={this.clearSearchPostionData} oneTreeData={false} />
          <antd.Tooltip placement="top" title="查询">
            <span className="pull-left search-btn" onClick={ this.props.cx.bind(this,this.state.keyword, this.state.searchPostionData) }><antd.Icon className="icon-style" type="search" style={{ fontSize: 18, color: '#fff' }} /></span>
          </antd.Tooltip>
          <div className="clear"></div>
        </div>
        <div className="pull-right box-top-right">
          <antd.Tooltip placement="top" title="添加">
            <a className="add-user" onClick={ this.props.fun.bind(this, this.state.orgsOfTree) } href="javascript: "><img src="../icon/add.png" alt="" /></a>
          </antd.Tooltip>
        </div>
        <div className="clear"></div>
      </div>
    )
  } 
});

var BoxCent = React.createClass({ // 人员列表;
  getInitialState: function () {
    return {
      id: ''
    }
  },
  adminDefault: function () {  
    antd.message.warning('功能开发中...');
  },
  showConfirm: function (uid) {
    this.setState({
      id: uid
    });

    var self = this;

    var confirm = antd.Modal.confirm;

    confirm({
        title: '您确定要删除吗？',
        content: '',
        onOk() {
            self.props.removeList(self.state.id);
        },
        onCancel() {
            console.log('Cancel');
        },
    });
  },
  showPop: function (data) {
      document.getElementsByClassName('pop-wid')[0].style.display = 'block';
      this.props.getInitRegistData(data);
  },
  render: function () {
    var self = this;
    
    if (this.props.data.length === 0) {
      var d = [];
    } else {
      var d = this.props.data.rows;
      
      var total = this.props.data.total;
      var zp = Math.ceil(total / (this.props.pageSize) );

      if(document.getElementById('sy') !== undefined && document.getElementById('sy') !== null){
        this.props.page == 1 ? $("#sy").addClass('active') : $("#sy").removeClass('active');
        
        this.props.page == Math.ceil(total / (this.props.pageSize) ) ? $("#wy").addClass('active') : $("#wy").removeClass('active');
      }
    }

    return (
      <div className="list-group">
        <ol>
          {
            d.map(function (res) {
              return (
                <li>
                  <div className="pull-left">
                    <figure className="pull-left user-info">
                    <img style={{ width: '88px', height: '88px', borderRadius: '88px' }} src={res.iconUrl === undefined || res.iconUrl === null ? '../img/default_headImg.png' : res.iconUrl} alt="" />
                                            {
                                                res.userFlag === 1 ? 
                                                <figcaption className="user-name">企业注册者														</figcaption>
                                                : ''
                                            }
                    </figure>

                    <div className="pull-left">
                      <p className="admin-style">{ res.companyUserName }														</p>
                      <p className="phone-style">{ res.phoneNum }														</p>
                    </div>

                    <div className="clear"></div>
                  </div>
                  <div className={res.userFlag === 2 ? 'pull-right' : 'pull-right marg-top'} id={ res.key }>
                                            {
                                            res.userFlag === 2 ? 
                                            <section className="pull-left">
                                            {
                                              res.state === 1 ?
                                              <antd.Tooltip 
                      onClick={ self.props.fun.bind(this,res.phoneNum,res.companyUserName,res.id,res.userId,res.companyId, res) } 
                      placement="top" 
                      title="修改">
                        <a href="#">
                        <img src="../img/replace.png" alt="" style={{width: '26px', height: '26px'}} />
                        </a>
                      </antd.Tooltip>
                      : ''
                                            }
                    
                    {
                      res.state === 1 ?
                    
                      <antd.Tooltip placement="top" title="冻结">
                      <a onClick={self.props.confirms.bind(this,res.state,res.id)} href="javascript: ">
                      <img id="j" src="../img/j.png" alt="" style={{width: '28px', height: '24px'}} />
                      </a>
                      </antd.Tooltip>

                      : 

                      <antd.Tooltip placement="top" title="启动">
                      <a onClick={self.props.confirms.bind(this,res.state,res.id)} href="javascript: ">
                      <img id="s" src="../img/s.png" alt="" style={{width: '20px', height: '24px'}} />
                      </a>
                      </antd.Tooltip>
                    }
                                            <antd.Tooltip onClick={ self.showConfirm.bind(this,res.id) } placement="top" title="删除">
                                            <a href="javascript: "><img src="../img/remove.png" alt="" style={{width: '26px', height: '26px'}} /></a>
                                            </antd.Tooltip>
                                            </section>
                                            : ''
                                            }

                    <section className="pull-left btns-group">
                                                <a onClick={ self.props.showDetail.bind(this,res.companyId,res.userId) } className="see-default" href="javascript: ">权限详情</a>   
                                                {
                                                    res.userFlag === 1 ?
                                                    <a onClick={self.showPop.bind(this,res)} className="btn-register" href="javascript: ">注册账号转移</a>
                                                    : ''
                                                }                                 
                                            </section>
                    <div className="clear"></div>
                  </div>
                  <div className="personal-details">
                    <p>组织机构：{ res.organizationName }</p>
                    <p style={{marginTop: '10px'}}>职位: { res.positionName }</p>
                  </div>
                  <div className="clear"></div>
                </li>
              )
            })
          }
        </ol>
        
        <div className="page-group">
        {
          total === 0 
          ? 
          <p className="no-data">无数据</p>
          :
          <section>
          <a className="sy" onClick={this.props.pageChange.bind(this,1)} id="sy" href="javascript: ">首页</a>
          <antd.Pagination current={this.props.page} pageSize={this.props.pageSize} onChange={this.props.pageChange} total={ total } />
          <a className="wy" onClick={this.props.pageChange.bind(this,zp)} id="wy" href="javascript: ">尾页</a>

          <div className="tz pull-left">
            <span>跳至 </span>
            <input type="text" id="page" /> 页
          </div>
          <button className="page-tz" onClick={this.props.pageTz}>跳转</button>
          
          <div className="pull-right">
            <span>每页显示
            <antd.Select defaultValue="10" className="select-wid" onChange={this.props.selectSize}>
                <antd.Select.Option value="10">10</antd.Select.Option>
                <antd.Select.Option value="20">20</antd.Select.Option>
                <antd.Select.Option value="50">50</antd.Select.Option>
              </antd.Select>
              条记录
              </span>

            <span> 总共{ total }条记录</span>
            <span> 当前{ this.props.page } / { Math.ceil(total / (this.props.pageSize) ) }页</span>
          </div>
          <div style={{ clear: 'both' }}></div>
          </section>
        }
        </div>
      </div>
    )
  }
});

var RegistrationTransfer = React.createClass({ // 注册转移弹窗;
  getInitialState: function () {
    return {
    originalUrl: '',
    fileList: [],
    newName: '',
    userId: '',
    newPhone: ''
    }
  },
  closePop: function () {
    this.setState({
    originalUrl: '',
    fileList: [],
    newName: '',
    userId: '',
    newPhone: ''
    });

    this.refs.reset.setInitState();
    this.refs.reset1.setInitState();
    var clearVal = document.getElementsByClassName('clear-val');
    for (var i = 0; i < clearVal.length; i++ ) {
    clearVal[i].value = '';
    };

    document.getElementsByClassName('pop-wid')[0].style.display = 'none';
    document.getElementById('enter_info').style.display = 'block';
    document.getElementById('enter_change').style.display = 'none';
  },
  handleChange: function (info) {
    this.setState({
    fileList: info.fileList.slice(-1)
    });

    if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
    antd.message.success(`${info.file.name} 上传成功`);
    this.setState({
    originalUrl: info.file.response.originalUrl
    });
    } else if (info.file.status === 'error') {
    antd.message.error(`${info.file.name} 上传失败`);
    }
  },
  handleBeforeUpload: function (file) {
    if (file.size) { // IE浏览器下;
    var isJPEG = file.type === 'image/jpeg';
    var isPNG = file.type === 'image/png';
    var isJPG = file.type === 'image/jpg';
    if (isJPG || isJPEG || isPNG) {

    } else {
    antd.message.error('上传的不是图片类型');
    }

    var isLt2M = file.size / 1024 / 1024 < 10;

    if (!isLt2M) {
    antd.message.error('图片大小不能超过10MB!');
    }

    return (isJPG || isJPEG || isPNG) && isLt2M;
    } else {
    return true;
    }
  },
  nextDate: function () {
    var oldCode = document.getElementById('old_code');

    if (this.state.originalUrl === '') {
    antd.message.warning('授权文件必传');
    return false;
    } else if (oldCode.value.trim() === '') {
    antd.message.warning('请填写验证码');
    return false;
    };

    ajaxStart("POST",{
      addr: "verifyAuthCode",
      type: 'phone',
      value: this.props.regist.phoneNum,
      code: oldCode.value
    },function(data){
      document.getElementById('enter_info').style.display = 'none';
      document.getElementById('enter_change').style.display = 'block';
    },function(){}, false);
  },
  submitNewReset: function () {
      var newCode = document.getElementById('new_code');
      if (newCode.value.trim() === '') {
      antd.message.warning('请填写验证码');
      } else {
      this.closePop();
      }
  },
  testPhone: function(event) { // 查询姓名;
    var self = this;

    var sMobile = event.target.value.trim();

    if(!(/^1[3|4|5|8][0-9]\d{8}$/.test(sMobile))){

    }else {
      this.setState({
      newName: '',
      userId: ''
      });

      ajaxStart("POST",{
        addr: "findUserByPhone",
        companyId: companyId,
        phone: sMobile
      },function(data){
        self.setState({
        newName: data.name,
        userId: data.userId,
        newPhone: sMobile,
        name: data.name
        })
      });
    }
  },
  render: function () {
    var self = this;

    var props = { // 上传信息;
      name: 'file',
      data: { fileType: 'jpg', name: 'dasd', token: TOKEN, addr: 'uploadFile' },
      action: '/ImgUploadServlet',
      headers: {
        authorization: 'authorization-text',
      },
      beforeUpload: this.handleBeforeUpload,
      onChange: this.handleChange
    };

    return (
      <section className="pop-box pop-wid" style={{display: 'none'}}>
          <div className="pop-group">
              <figure>
                  <figcaption className="pull-left"></figcaption>
                  <antd.Icon onClick={this.closePop} className="pull-right" type="close" />
                  <div className="clear"></div>
              </figure>

              <article id="enter_info">
                  <div className="input-group">
                      <label for="name">转移人手机号：</label>
                      <input value={this.props.regist.phoneNum} disabled="disabled" className="disabled" type="text" />
                  </div>

                  <div className="input-group">
                      <label for="name">转移人姓名：</label>
                      <input value={this.props.regist.realName} disabled="disabled" className="disabled" type="text" />
                  </div>

                  <div className="input-group">
                      <label for="name" className="pull-left">转移授权文件：</label>
                      <antd.Upload {...props} fileList={this.state.fileList} className="pull-left">
                          <img className="upload-img" src="../img/upload.png" alt="" />
                      </antd.Upload>
                      <div className="clear"></div>
                  </div>

                  <div className="input-group" style={{marginTop: '10px'}}>
                      <label className="pull-left" for="name">手机验证码：</label>
                      <input id="old_code" className="test-input pull-left clear-val" type="text" />
                      <CountDown ref="reset" phone={this.props.regist.phoneNum} />
                      <div className="clear"></div>
                  </div>

                  <div className="enter-btn">
                      <a onClick={this.nextDate} className="see-default" href="javascript: ">下一步</a>
                  </div>
              </article>

              <article id="enter_change">
                  <div className="input-group" style={{marginTop: '10px'}}>
                      <label for="name">转移到新手机号：</label>
                      <input onKeyUp={this.testPhone} className="no-disabled clear-val" type="text" />
                  </div>

                  <div className="input-group" style={{marginTop: '10px'}}>
                      <label for="name">转移到新姓名：</label>
                      <input value={this.state.newName} disabled="disabled" className="disabled" type="text" />
                  </div>

                  <div className="input-group" style={{marginTop: '10px'}}>
                      <label className="pull-left" for="name">手机验证码：</label>
                      <input id="new_code" className="test-input pull-left clear-val" type="text" /> 
                      <CountDown ref="reset1" phone={this.state.newPhone} />
                      <div className="clear"></div>
                  </div>

                  <div className="enter-btn">
                      <a onClick={this.submitNewReset} className="see-default" href="javascript: ">确认</a>
                  </div>
              </article>
          </div>
      </section>
    )
  }
});

var timer = null;

var CountDown = React.createClass({ // 倒计时;
  getInitialState: function () {
    return {
      isTrue: false,
      timeNum: 60
    }
  },
  setInitState: function () {
    clearInterval(timer);
      this.setState({
        isTrue: false,
        timeNum: 60
      });
  },
  testCodeTime: function (state) {
    timer = setInterval(function() {
    if (this.state.timeNum > 0) {
      this.setState({
      timeNum: this.state.timeNum - 1
      })
    } else {
      clearInterval(timer);
      this.setState({
        timeNum: 60,
        isTrue: false
      })
    };
    }.bind(this), 1000)
  },
  getPhoneCode: function (state) { // 获取验证码
    var slef = this;
    if (this.props.phone !== '') {
    ajaxStart("POST",{
      addr: "getAuthCode",
      type: 'sms',
      flag: false,
      value: this.props.phone
    },function(data){
      antd.message.success(data.rspDesc);
      slef.setState({
        isTrue: true
      });
      slef.testCodeTime();
    });
    } else {
      antd.message.warning('手机号不正确');
    }
  },
  render: function () {
    return (
      <a onClick={this.state.isTrue ? '' : this.getPhoneCode} className="pull-left" href="javascript: ">{this.state.isTrue === true ? this.state.timeNum + '秒' : '获取验证码' + this.state.b}</a>
    )
  }
});

var AuthGroup = React.createClass({ // 权限管理树形菜单
  onSelect: function (selectedKeys, info) {
    if (!this.props.showAuth) {
        this.props.setUserResourcesFn(selectedKeys);
      }
  },
  setCheckboxActive: function () {
    var aSpan = $('.ant-tree-node-content-wrapper');
      for (var i=0; i< aSpan.length; i++) {
         if (aSpan.eq(i).hasClass('ant-tree-node-selected')) {
           aSpan.eq(i).prev().addClass('ant-tree-checkbox-active');
         } else {
           aSpan.eq(i).prev().removeClass('ant-tree-checkbox-active');
         }
      }
  },
  componentDidMount: function () {
    this.setCheckboxActive();
  },
  componentDidUpdate: function () {
    this.setCheckboxActive();
  },
  render: function () {
    var loop = data => data.map((item) => {
        if (item.children) {
          return (
            <antd.Tree.TreeNode 
              key={item.id} title={item.display} 
            >
              {loop(item.children)}
            </antd.Tree.TreeNode>
          );
        }
        return <antd.Tree.TreeNode key={item.id} title={item.display}/>;
      });

      return (
        <div style={{height: 240, overflow: 'auto', border: '1px solid #ddd', margin: '20px'}}>
          <antd.Tree
            multiple
            checkable
            onSelect={this.onSelect.bind(this)}
            defaultExpandedKeys={this.props.userResources}
            selectedKeys={this.props.userResources}
            checkedKeys={this.props.userResources}
          >
            {loop(this.props.perResources)}
          </antd.Tree>
        </div>
      )
  }
});

var JobManagement = React.createClass({ // 职位管理组件;
  getInitialState: function () {
    return {
      popState: false, // 弹窗状态;
      orgsOfTree: [], // 组织机构数据;
      orgsOfTreefirstData: '', // 组织机构默认数据
      defaultSelectedKeys: '', // 默认选中组织机构数据;
      selectTreeData: '', // 选中树级;
      keyword: '', // 搜索关键词
      pageNumber: 1, // 分页页码
      pageSize: 10, // 分页条数
      popLoad: false, // 弹窗按钮;
      positionName: '', // 职位名称;
      expandedKeys: [], // 指定打开第一级父节点;
      positionId: '', // 编辑时的positionId;
      code: '' // 当前code
    }
  },  
  closePop: function (type, data) {
    this.setState({
      popState: this.state.popState ? false : true,
      positionId: type == 1 ? '' : data.id,
      positionName: type == 1 ? '' : data.name
    });

    document.getElementById('add_position').value = type == 1 ? '' : data.name;
  },
  componentDidMount: function () {
    this.getOrgsOfTree();
  },
  getOrgsOfTree: function () { // 获取组织机构树
    var _this = this;
    ajaxStart("POST",{
      addr: "getOrgsOfTree",
      code: orgCode
    },function(data){
      _this.getPositionList(data.orgs[0].code, _this.state.keyword, _this.state.pageNumber, _this.state.pageSize);

      _this.setState({
        orgsOfTree: data.orgs,
        orgsOfTreefirstData: data.orgs[0],
        defaultSelectedKeys: [data.orgs[0].code],
        code: data.orgs[0].code
      });
      _this.props.escLoad();
    },function(){
      _this.props.escLoad();
    });
  },
  newTreeData: function (data) { // 获取选中树级数据;
    var _this = this;

    recursion(this.state.orgsOfTree, data[0].props.title);

    this.getPositionList(data[0].key, this.state.keyword, this.state.pageNumber, this.state.pageSize);

    function recursion (orgsOfTree, name, obj) {
      orgsOfTree.forEach(function(item) {
        if (item.name === name) {
          _this.setState({
            orgsOfTreefirstData: item,
            code: item.code
          });
        } else {
          if (item.children) {
            recursion(item.children, name, obj);
          }
        }
      });
    };
  },
  getPositionList: function (code, keyword, pageNo, pageSize) { // 获取职位列表;
    var _this = this;
    this.props.escLoad(true);

    ajaxStart("POST",{
      addr: "getPositionList",
      orgCode:code,
      keyword: keyword,
      pageNo: pageNo,
      pageSize: pageSize
    },function(data){
      _this.setState({
        selectTreeData: data
      });
      _this.props.escLoad(false);
    },function(){
      _this.setState({
        loading: false
      });
      _this.props.escLoad(false);
    });
  },
  savePosition: function () { // 保存职位;
    var _this = this;
    var obj = {};

    if (this.state.positionName === '') {
      antd.message.warning('职位不能为空');
    } else {
      this.setState({
        popLoad: true
      });

      if (this.state.positionId === '') {
        obj.addr = "savePosition";
        obj.orgId= _this.state.orgsOfTreefirstData.id;
        obj.name= this.state.positionName;
      } else {
        obj.addr = "savePosition";
        obj.positionId = this.state.positionId;
        obj.orgId= _this.state.orgsOfTreefirstData.id;
        obj.name= this.state.positionName;
      };

      ajaxStart("POST",obj,function(data){
        antd.message.success('保存成功');
        _this.setState({
          popLoad: false,
          positionName: ''
        });  
        _this.getPositionList(_this.state.code, _this.state.keyword, _this.state.pageNumber, _this.state.pageSize);
        _this.closePop(1);
        document.getElementById('add_position').value = '';
      },function(){
        _this.setState({
          popLoad: false
        });    
      });
    }
  },
  position: function (type, event) { // 监听职位名称 1 => 新增监听 2=> 搜索职位监听;
    var name = event.target.value;
    if (type === 1) {
      this.setState({
        positionName: name
      });
    } else if (type === 2) {
      this.setState({
        keyword: name
      });
    };
  },
  searchPostion: function () { // 搜索职位列表;
    this.getPositionList(this.state.orgsOfTreefirstData.code, this.state.keyword, this.state.pageNumber, this.state.pageSize);
  },
  showDeleteConfirm: function (id) { // 删除;
    var self = this;
    var confirm = antd.Modal.confirm;

    confirm({
        title: '您确定要删除吗？',
        content: '',
        onOk() {
          self.delPosition(id);
        },
        onCancel() {
            console.log('Cancel');
        },
    });
  },
  delPosition: function (positionId) { // 删除接口;
    var _this = this;

    ajaxStart("POST",{
      addr: 'delPosition',
      positionId: positionId
    },function(data){
      antd.message.success('删除成功');
      _this.getPositionList(_this.state.code, _this.state.keyword, _this.state.pageNumber, _this.state.pageSize);
    },function(){
      _this.setState({
        popLoad: false
      });    
    });
  },
  onPageChange: function (page) { // 分页回调;
    var _this = this;
    
    this.setState({
      pageNumber: Number(page)
    });
    _this.getPositionList(_this.state.code, _this.state.keyword, page, _this.state.pageSize);
  },
  selectSize: function (size) { // 选择分页条数;
    var _this = this;
    
    this.setState({
      pageSize: Number(size)
    });

    _this.getPositionList(_this.state.code, _this.state.keyword, _this.state.pageNumber, Number(size));
  },
  render: function () {
    var popState = this.state.popState ? 'job-pop active' : 'job-pop';

    return (
      <section className="job-box">
        <h4>当前组织：{ this.state.orgsOfTreefirstData.name }</h4>

        <article className="job-group">
          <div className="pull-left job-navbar">
            <JobTree orgs={ this.state.orgsOfTree } defaultKeys={ this.state.defaultSelectedKeys } newTreeDatas={ this.newTreeData } expandedKey={ this.state.expandedKeys } />
          </div>

          <div className="pull-right job-content">
            <div className="pull-left" id="job_search">
              <input className="pull-left search-info" type="text" onKeyUp={ this.position.bind(this, 2) } placeholder="请输入职位" />
              <antd.Tooltip placement="top" title="查询">
                <span onClick={ this.searchPostion } className="pull-left search-btn"><antd.Icon className="icon-style" type="search" style={{ fontSize: 18, color: '#fff' }} /></span>
              </antd.Tooltip>
              <div className="clear"></div>
            </div>

            <div className="pull-right box-top-right" id="job_add">
              <antd.Tooltip placement="top" title="添加">
                <a className="add-user" onClick={ this.closePop.bind(this, 1) } href="javascript: "><img src="../icon/add.png" alt="" /></a>
              </antd.Tooltip>
            </div>
            
            <div className="clear"></div>

            <JobManagementListed closePop={this.closePop} selectedData={ this.state.selectTreeData } showDelete={this.showDeleteConfirm} pageChange={ this.onPageChange } page={ this.state.pageNumber } pageSize= { this.state.pageSize }selectSize={this.selectSize}  />
          </div>
          <div className="clear"></div>
        </article>

        <div className={ popState }>
          <div className="pop-group">
            <div className="pop-input-group">
              <label className="pull-left">组织机构：</label>
              <input disabled="disabled" value={ this.state.orgsOfTreefirstData.name } className="pull-right" type="text" />
              <div className="clear"></div>
            </div>  

            <div className="pop-input-group">
              <label className="pull-left">职位：</label>
              <input id="add_position" className="pull-right" type="text" onKeyUp={ this.position.bind(this, 1) } />
              <div className="clear"></div>
            </div> 

            <div className="btn-group">
              <antd.Button type="primary" className="btn-close" onClick={ this.closePop.bind(this, 1) }>
                取消
              </antd.Button>

              <antd.Button onClick={ this.savePosition } type="primary" className="btn-enter" loading={ this.state.popLoad }>
                确定
              </antd.Button>
            </div>
          </div>
        </div>
      </section>
    )
  }
});

var JobManagementListed = React.createClass({ // 职位管理列表组件;
  tiaozhuan: function () { // 跳转分页;
    var parInput = document.getElementById('page');
    var reg = /^[0-9]*[1-9][0-9]*$/;

    if (parInput.value < 0) {
      antd.message.warning('条数不能小于0');
    } else if (parInput.value === '') {
      antd.message.warning('条数不能为空');
    } else if (!reg.test(parInput.value)) {
      antd.message.warning('请输入正整数');
    } else if (parInput.value > Math.ceil(this.props.selectedData.data.total/this.props.pageSize)) {
      antd.message.warning('没有那么多条数');
    } else {
      this.props.pageChange(parInput.value);
    }
  },
  render: function () { 
    var d = this.props.selectedData.data ? this.props.selectedData.data.rows : [];
    var total = this.props.selectedData.data ? this.props.selectedData.data.total : 0;
    var dLen = this.props.selectedData.data ? this.props.selectedData.data.rows.length : 0;
    var _this = this;

    return (
      <div className="list-group">
        {
          total != 0 ?
          <ol>
            {
              d.map(function (item) {
                return (<li>
                  <div className="pull-left">
                    <div className="pull-left">
                      <p className="admin-style">组织机构：{item.organization.name}</p>
                      <p className="phone-style">职位: {item.name}</p>
                    </div>
                    <div className="clear"></div>
                  </div>
                  <div className='pull-right'>
                    <antd.Tooltip 
                    placement="top" 
                    title="修改">
                      <a href="#" onClick={_this.props.closePop.bind(this, 2, item)}>
                      <img src="../img/replace.png" alt="" style={{width: '26px', height: '26px'}} />
                      </a>
                    </antd.Tooltip>

                    <antd.Tooltip placement="top" title="删除">
                      <a href="javascript: " onClick={_this.props.showDelete.bind(this,item.id)}><img src="../img/remove.png" alt="" style={{width: '26px', height: '26px'}} /></a> 
                    </antd.Tooltip>
                  </div>
                  <div className="clear"></div>
                </li>)
              })
            }
          </ol>
          : ''
        }
        
        <div className="page-group">
          { dLen === 0 
            ? 
            <p className="no-data">无数据</p> 
            : 
            <section>
            <a className="sy" onClick={_this.props.pageChange.bind(this, 1)} id="sy" href="javascript: ">首页</a>
            <antd.Pagination current={_this.props.page} pageSize={_this.props.pageSize} onChange={_this.props.pageChange} total={ total } />
            <a className="wy" onClick={_this.props.pageChange.bind(this, Math.ceil(total/_this.props.pageSize))} id="wy" href="javascript: ">尾页</a>

            <div className="tz pull-left">
              <span>跳至 </span>
              <input type="text" id="page" /> 页
            </div>
            <button className="page-tz" onClick={_this.tiaozhuan}>跳转</button>
            
            <div className="pull-right">
              <span>每页显示
              <antd.Select defaultValue="10" className="select-wid" onChange={_this.props.selectSize}>
                <antd.Select.Option value="10">10</antd.Select.Option>
                <antd.Select.Option value="20">20</antd.Select.Option>
                <antd.Select.Option value="50">50</antd.Select.Option>
              </antd.Select>
              条记录
              </span>

              <span> 总共条{ total }记录</span>
              <span> 当前{ _this.props.page } / { Math.ceil(total/_this.props.pageSize) }页</span>
            </div>
            <div style={{ clear: 'both' }}></div>
            </section>
          }
        </div>
      </div>
    )
  }
});

var JobTree = React.createClass({ // 组织机构数树;
  selectData: function (selectedKeys, e) {
    if (e.selected) {
      this.props.newTreeDatas(e.selectedNodes);
    };
  },
  render: function () {
    var _this = this;
    var arr = [];
    if (this.props.orgs) {
      this.props.orgs.forEach(function (item) {
        arr.push(item.code ? item.code : item.id)
      });
    };

    var loop = data => data.map((item) => {
      if (item.children) {
        return (
          <antd.Tree.TreeNode 
            key={item.code ? item.code : item.id} title={item.name}
          >
            {loop(item.children)}
          </antd.Tree.TreeNode>
        );
      }
      return <antd.Tree.TreeNode key={item.code ? item.code : item.id} title={item.name}/>;
    });

    return (
      arr[0] 
      ? 
      <antd.Tree
        multiple={this.props.checkbox ? true : false}
        onSelect={ this.selectData }
        defaultExpandAll={true}
      >
        {loop(this.props.orgs)}
      </antd.Tree>
      : 
      <p></p>
    )
  }
});

var Dropdown = React.createClass({ // 组织机构下拉;
  getInitialState: function () {
    return {
      dorpdownState: false, // 下拉框的状态;
      selectName: '' // 选中的name;
    }
  },
  closeDorpdown: function () {
    if (!this.state.dorpdownState) {
      // if (this.props.checkbox) {
      //   this.props.clearSearchPostionData();
      // };
      this.clickOtherClose();
    } else {
      $('body').off('click');
    };

    this.setState({
      dorpdownState: this.state.dorpdownState ? false : true
    });
  },
  clickOtherClose: function () { // 点击其他关闭下拉;
    var _this = this;

    $('body').on('click', function (event) {
      if ($(event.target).parents().hasClass('dorpdown-content') || $(event.target).hasClass('dorpdown-content')) {
        
      } else if ($(event.target).parents().hasClass('closeDorpdown') || $(event.target).hasClass('closeDorpdown')) {

      } else {
        _this.setState({
          dorpdownState: false
        });
        
        $(this).off('click');
      };
    });
  },    
  newTreeData: function (data) { // 选中的数据;
    if (this.props.oneTreeData) {
      
    } else {
      if (!this.props.checkbox) { // 单选;
        this.setState({
          // dorpdownState: false,
          selectName: data[0].name
        });
      } else {
        var names = '';
        data.forEach(function (item) {
          names += item.name + ', ';
        });
        names = names.substr(0, names.length - 2);
  
        this.setState({
          selectName: names
        });
      };
  
      this.props.postionData(data);
    }
  },
  radioActive: function (data) { // 抛出选中数据;
    this.setState({
      selectName: data.name
    });

    if (this.props.radioActive) {
      this.props.radioActive(data, this.props.saveState);
    }
  },
  clearName: function () { // 编辑时清空name;
    this.setState({
      selectName: ''
    });
  },
  setReload: function (fun) { // 重置Tree数据;
    if (this.props.setReloaData) {
      this.props.setReloaData(fun);
    }
  },
  render: function () {
    return (
      <div className="pull-left dropdown-box">
        <div className="pull-left organization">
          <label className="pull-left">{ this.props.name }</label>
          <div className="pull-left organization-input">
            <section onClick={ this.closeDorpdown } className="closeDorpdown">
              <input className="first-child" type="text" disabled="disabled" value= {
                this.state.selectName === '' 
                ? this.props.replaceOrgName 
                  ? this.props.replaceOrgName
                  : this.props.replaceOrgName == null ? '' :
                    this.props.checkbox 
                    ? ''
                    : this.props.orgsOfTree && this.props.orgsOfTree.length 
                      ? this.props.orgsOfTree[0].name
                      : ''
                : this.state.selectName
              } placeholder="请选择" />
              <a className="btm" href="javascript: " onClick={this.test}><img src="../icon/arrow.png" /></a>
              <div className="clear"></div>
            </section>
            {
              <div className={ this.state.dorpdownState  ? "dorpdown-content" : "dorpdown-content active"}>
                {/* <JobTree checkbox={this.props.checkbox} orgs={ this.props.orgsOfTree } newTreeDatas={ this.newTreeData }/> */}
                { this.props.orgsOfTree && this.props.orgsOfTree.length ?
                  <Tree setReload={this.setReload} initData={ this.props.orgsOfTree } clearState={ this.props.saveState } treeRadioCheckbox={ this.props.checkbox ? '2' : '1' } openRetract={false} children="children" isChooseSubset={false} displaySub={this.props.checkbox} displaySearch={this.props.displaySearch} isDisplayBox={this.props.isDisplayBox} activesData={this.newTreeData} activeClick={this.radioActive} />
                  :
                  ''
                }
                
              </div>
            }
          </div>
          <div className="clear"></div>
        </div>
      </div>
    )
  }
});

var Position = React.createClass({ // 职位组件;
  getInitialState: function () {
    return {
      dorpdownState: false, // 下拉框的状态;
      selectName: '' // 选中的name;
    }
  },
  clearName: function () { // 清空name;
    this.setState({
      selectName: ''
    });
  },
  closeDorpdown: function () {
    if (!this.state.dorpdownState) {
      // if (this.props.checkbox) {
      //   this.props.clearSearchPostionData();
      // };
      this.clickOtherClose();
    } else {
      $('body').off('click');
    };

    this.setState({
      dorpdownState: this.state.dorpdownState ? false : true
    });
  },
  clickOtherClose: function () { // 点击其他关闭下拉;
    var _this = this;

    $('body').on('click', function (event) {
      if ($(event.target).parents().hasClass('dorpdown-content') || $(event.target).hasClass('dorpdown-content')) {
        
      } else if ($(event.target).parents().hasClass('closeDorpdown') || $(event.target).hasClass('closeDorpdown')) {

      } else {
        _this.setState({
          dorpdownState: false
        });
        
        $(this).off('click');
      };
    });
  }, 
  activeData: function (data) { // 选中的数据;
    this.setState({
      selectName: data.name,
      dorpdownState: false
    });
    this.props.radioActive(data);
  },
  render: function () {
    var _this = this;

    return (
      <div className="pull-left dropdown-box">
        <div className="pull-left organization">
          <label className="pull-left">{ this.props.name }</label>
          <div className="pull-left organization-input">
            <section onClick={ this.closeDorpdown } className="closeDorpdown">
              <input className="first-child" type="text" disabled="disabled" value= {
                this.props.saveState === 1 ?
                  this.state.selectName === '' 
                  ? !this.props.replaceOrgName
                    ? this.props.orgsOfTree && this.props.orgsOfTree.length
                      ? this.props.orgsOfTree[0].name : ''
                    : this.props.replaceOrgName
                  : this.state.selectName
                :
                  this.state.selectName === '' 
                  ? !this.props.replaceOrgName
                    ? ''
                    : this.props.replaceOrgName
                  : this.state.selectName
              } placeholder="请选择" />
              <a className="btm" href="javascript: "><img src="../icon/arrow.png" /></a>
              <div className="clear"></div>
            </section>
            {
              <div className={ this.state.dorpdownState  ? "dorpdown-content" : "dorpdown-content active"}>
                <ul>
                  {
                    this.props.orgsOfTree && this.props.orgsOfTree.length ?
                    this.props.orgsOfTree.map(function (item) {
                      return (
                        <li onClick={_this.activeData.bind(this, item)}>
                            <a href="javascript: ">{ item.name }</a>
                        </li>
                      )
                    })
                    : <li>
                          <a href="javascript: ">无数据</a>
                      </li>
                  }
                </ul>
              </div>
            }
          </div>
          <div className="clear"></div>
        </div>
      </div>
    )
  }
});

// openRetract 是否默认打开树形菜单true/false;
// treeRadioCheckbox 是否多选或者单选1/2;
// isChooseSubset 为多选是否勾选子集true/false;
// initData 初始化数据;
// activeClick 当前选中的数据;
// activesData 已经选中的的数据
// children 子集字段名称
// displaySub 显示不含下级操作true/false;
// displaySearch 是否显示搜索框;
// isDisplayBox 是否显示选择框;
// clearState 还原初始数据;

var Tree = React.createClass({
  getInitialState: function () {
    return {
      retract: this.props.openRetract, // 是否展开菜单;
      treeData: [], // 数据;
      initData: [], // 初始化数据;
      chooseSubset: this.props.isChooseSubset === undefined ? true : this.props.isChooseSubset, // 是否勾选子集;
      treeRadioCheck: this.props.treeRadioCheckbox ? this.props.treeRadioCheckbox : 2, // 单选还是多选;
      oneArray: [], // 一维数据;
      displaySub: this.props.displaySub === undefined ? true : this.props.displaySub, // 是否显示不含下级操作;
      typeStatus: this.props.clearState // 类型状态;
    }
  },
  componentDidMount: function () {
    this.setState({
      treeData: this.processingData(JSON.parse(JSON.stringify(this.props.initData))),
      initData: this.processingData(JSON.parse(JSON.stringify(this.props.initData))),
      onArray: this.oneDimensionalArray(this.processingData(JSON.parse(JSON.stringify(this.props.initData))))
    });
    this.props.setReload(this.initTreeData);
  },
  initTreeData: function () { // 重置数据;
    this.setState({
      treeData: JSON.parse(JSON.stringify(this.state.initData))
    });
    this.refs.treeSearchInput.value = "";
  },
  processingData: function (data) {
    var _this = this;

    var loop = function (data, idx) { // 递归加层级;
      data.forEach(function(item, index) {
        if (!idx) {
          item.index = index + 1;
          item.selected = false;
          item.expend = _this.state.retract;
          if (item[_this.props.children] && item[_this.props.children].length) {
            loop(item[_this.props.children], item.index);
          }
        } else {
          item.index = idx + '-' + (index + 1);
          item.selected = false;
          item.expend = _this.state.retract;
          if (item[_this.props.children] && item[_this.props.children].length) {
            loop(item[_this.props.children], item.index);
          }
        }
      });
    };
    loop(data);
    return data;
  },
  oneDimensionalArray: function (data) {
    var handleData = [];
    var _this = this;
    var id = 0;

    function recursive(data, iNow) {
      var pid = iNow;
      data.forEach(function (item) {
        item.lid = ++id;

        if (pid) {
          item.pid = pid;
        }

        handleData.push(item);

        if (item[_this.props.children] && item[_this.props.children].length) {
          // 递归调用
          recursive(item[_this.props.children], id);
        }
      });
    };

    recursive(data);
    return handleData;
  },
  selectProcessingData: function (data) { // 处理单选还是多选数据 (type => 1 单选；=>2 多选);
    var initDatas = JSON.parse(JSON.stringify(this.state.initData));
    var treeDatas = this.state.treeData;
    var _this = this;
    var type = this.state.treeRadioCheck;

    if (type == 1) {
      replaceRadioData(initDatas, data);
      this.setState({
        treeData: initDatas
      });
    } else if (type == 2) {
      replaceCheckData(treeDatas, data);
      this.setState({
        treeData: treeDatas
      });
    };

    function replaceCheckData (d, targetData) { // 多选替换数据;
      d.forEach(function (item) {
        if (item.index === targetData.index) {
          if (_this.state.chooseSubset) {
            item = targetData;
          }	else {
            item.selected = targetData.selected;
          };
        } else {
          if (item[_this.props.children]) {
            replaceCheckData(item[_this.props.children], targetData);
          }
        }
      });	
    };

    function replaceRadioData (d, targetData) {
      d.forEach(function (item) {
        if (item.index === targetData.index) {
          item.selected = targetData.selected;
        } else {
          if (item[_this.props.children]) {
            replaceRadioData(item[_this.props.children], targetData);
          }
        }
      });
    };
  },
  openRetractData: function (data) { // 替换扩展数据;
    var treeDatas = this.state.treeData;
    var _this = this;
    replaceData(treeDatas, data);

    this.setState({
      treeData: treeDatas
    });

    function replaceData (d, targetData) { // 扩展替换数据;
      d.forEach(function (item) {
        if (item.index === targetData.index) {
          item = targetData
        } else {
          if (item[_this.props.children]) {
            replaceData(item[_this.props.children], targetData);
          }
        }
      });	
    };
  },
  searchInput: function (event) { // 监听搜索内容;
    var val = event.target.value.trim();
    var oneData = JSON.parse(JSON.stringify(this.state.onArray));
    var _this = this;
    var searchData = [];

    if (val) {
      oneData.forEach(function(item){
        if (item.name.indexOf(val) > -1) {
          item.display = 1;
          loop(oneData, item.pid, 1);
        } else {
          item.display = 0;
        }
      });
      this.setState({
        retract: false
      });
      expend(oneData, 1);
    } else {
      this.setState({
        retract: this.state.retract
      });
      expend(oneData, this.state.retract ? 2 : 1);
    }

    this.rotationTree(oneData);

    function loop (data, pid, type) {
      data.forEach(function(item) {
        if (item.lid == pid) {
          item.display = 1;
          loop(data, item.pid);
        }
      });
    };

    function expend (data, type) {
      data.forEach(function(item) {
        item.expend = type == 1 ? false : true;
      });
    };
  },
  rotationTree: function (data) { // 将一维转树形菜单;
    var _this = this;
    var ret = [];
    toTreeData(data, ret);

    this.setState({
      treeData: ret
    });

    function toTreeData(source, arr, pid){
      for (var i=0; i<source.length; i++) {
        var item = source[i];

        if (!pid) {
          if (item.lid == 1) {
            item[_this.props.children] = [];
            arr.push(item);
            toTreeData(source, arr[arr.length - 1][_this.props.children], item.lid);
          }
        } else {
          if (item.pid == pid) {
            if (item[_this.props.children] && item[_this.props.children].length) {
              item[_this.props.children] = [];
              arr.push(item);
              toTreeData(source, arr[arr.length - 1][_this.props.children], item.lid);
            } else {
              arr.push(item);
            }
          }
        };
      };
    };
  },
  switchChooseSubset: function () { // 切换是否选中子集;
    this.setState({
      chooseSubset: this.state.chooseSubset ? false : true
    });
  },
  returnData: function (data) { // 退出数据
    var arr = [];
    var _this = this;

    if (this.props.activeClick) {
      this.props.activeClick(data);
    };

    if (this.props.activesData) {
      loop(this.state.treeData);
      this.props.activesData(arr);
    };

    function loop (data) { // 筛选选中的数据;
      data.forEach(function (item) {
        if (item.selected) {
          arr.push(item);
          if (item[_this.props.children] && item[_this.props.children].length) {
            loop(item[_this.props.children]);
          }
        } else {
          if (item[_this.props.children] && item[_this.props.children].length) {
            loop(item[_this.props.children]);
          }
        }
      });
    };
  },
  render: function () {
    return (
      <section className={ this.state.retract ? 'tree-box retract-box' : 'tree-box' }>
        {
          this.props.displaySearch ?
            <div className="search-input-group">
              <input onKeyUp={this.searchInput.bind(this)} className="pull-left search-input" type="text" placeholder="请输入内容" ref="treeSearchInput" />
                {
                  this.state.displaySub ? 
                    this.state.chooseSubset ? 
                      <a className="pull-left choose-subset" href="javascript: " onClick={this.switchChooseSubset}>
                        <img src="../icon/icon-checked-active.svg" />
                        <span className="subset-name active">包含下级</span>
                        <div className="clear"></div>
                      </a>
                      :
                      <a className="pull-left choose-subset" href="javascript: " onClick={this.switchChooseSubset}>
                        <img src="../icon/icon-checked-unchecked.svg" />
                        <span className="subset-name">包含下级</span>
                        <div className="clear"></div>
                      </a>
                  :
                  ''
                }
              <div className="clear"></div>
            </div>
          :
            ''
        }
        
        <div className="tree-group">
          <TreeNode data={ this.state.treeData } child={ this.props.children } processing={ this.selectProcessingData } treeRadioCheck={this.state.treeRadioCheck} chooseSubset={this.state.chooseSubset} openRetractData={this.openRetractData} returnData={this.returnData} isDisplayBox={this.props.isDisplayBox} />
        </div>
      </section>
    )
  }
});

var TreeNode = React.createClass({ // 递归成节点;
  onSelected: function (data, event) { // 选中当前级;
    event.stopPropagation();
    var _this = this;
    var type = this.props.treeRadioCheck;
    var selectState = data.selected ? false : true;
    data.selected = selectState;

    if (type == 2) {
      loop(data[_this.props.child], type, _this.props.chooseSubset);
    };

    this.props.returnData(data)
    this.props.processing(data);

    function loop (d, type, chooseSubset) {
      if (d) {
        d.forEach(function (item) {
          if (chooseSubset) {
            item.selected = selectState;
            if (item[_this.props.child]) {
              loop(item[_this.props.child], type, chooseSubset);
            }
          }
        });
      };
    };
  },
  onRetract: function (data, event) { // 收扩;
    event.stopPropagation();

    if (data.expend) {
      data.expend = false;
      $(event.target).parent().parent().find('ul:first').stop(true).slideDown(200);
    } else {
      data.expend = true;
      $(event.target).parent().parent().find('ul:first').stop(true).slideUp(200);
    };

    this.props.openRetractData(data);
  },
  render: function () {
    var d = this.props.data;
    var _this = this;

    return (
      d
      ?
      <ul className="tree">	
        {
          d.map(function(item){
            return (
              item.display != 0 ? 
              <li>
                <a className="pull-left expanding" href="javascript: " onClick={ _this.onRetract.bind(this, item) }>
                  {
                    item[_this.props.child] && item[_this.props.child].length ?
                    !item.expend ? <img className="expend" src="../icon/icon-expend.svg" /> :
                    <img className="unexpend" src="../icon/icon-unexpend.svg" /> : ''
                  }
                </a>
                <a href="javascript: " className="pull-left check" onClick={ _this.onSelected.bind(this, item) } >
                  {
                    item.selected 
                    ? 
                    <div>
                      {
                        _this.props.isDisplayBox ?
                        <div>
                        <img className="pull-left" src="../icon/icon-checked-active.svg" />
                        <span className="pull-left name active active-marg">{ item.name }</span>
                        </div>
                        : 
                        <div>
                        <img className="pull-left" src="../icon/icon-checked-active.svg" />
                        <span className="pull-left name active">{ item.name }</span>
                        </div>
                      }
                      
                    </div>
                    :
                    <div>
                    {
                      _this.props.isDisplayBox ?
                      <div>
                      <img className="pull-left" src="../icon/icon-checked-unchecked.svg" />
                      <span className="pull-left name active-marg">{ item.name }</span>
                      </div>
                      : 
                      <div>
                      <img className="pull-left" src="../icon/icon-checked-unchecked.svg" />
                      <span className="pull-left name">{ item.name }</span>
                      </div>
                    }
                    </div>
                  }
                  
                  <div className="clear"></div>
                </a>
                <div className="clear"></div>
                {
                  item[_this.props.child] 
                  ? 
                  <TreeNode data={ item[_this.props.child] } child={ _this.props.child } processing={ _this.props.processing } openRetractData={_this.props.openRetractData} chooseSubset={_this.props.chooseSubset} treeRadioCheck={_this.props.treeRadioCheck} returnData={_this.props.returnData} isDisplayBox={_this.props.isDisplayBox} /> : ''
                }
              </li>
              : ''
            )
          })
        }
      </ul>
      :
      <div style={{ paddingLeft: '10px', fontSize: '14px', color: '#666' }}>无数据</div>
    )
  }
});

ReactDOM.render(<Content />, document.getElementById("content"));
