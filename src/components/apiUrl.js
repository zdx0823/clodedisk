// const PREFIX = 'http://localhost:89'
const PREFIX = '/ppd233'
const BASE = 'http://localhost:8080'

// 云盘数据操作接口
const NEW_FOLDER = `${PREFIX}/api/clodedisk/folder`
const LIST_BY_PATH = `${PREFIX}/api/clodedisk/list`
const DEL = `${PREFIX}/api/clodedisk`
const RENAME_FOLDER = `${PREFIX}/api/clodedisk/folder/name`
const RENAME_FILE = `${PREFIX}/api/clodedisk/file/name`
const PASET = `${PREFIX}/api/clodedisk/resource/copy`
const PASET_CUT = `${PREFIX}/api/clodedisk/resource/cut`
const UPLOAD = `${PREFIX}/api/clodedisk/upload`


// 登出
const LOGOUT = `${PREFIX}/logout`


// 单点登出
const LOGOUT_SSO = `http://localhost:90/logout/sso`
const LOGIN_SSO = `http://localhost:90/login`


// 检查是否登录，全局路由前置守卫用到
const CHECK_ST = `${PREFIX}/login/check_st`
const CHECK_LOGIN = `${PREFIX}/login/check_login`


// 二次认证，管理员认证
const SEND_CODE = `${PREFIX}/login/confirm/send_code`
const CONFIRM_CODE = `${PREFIX}/login/confirm/confirm`

// 是否需要二次验证
const IS_NEED_CONFIRM = `${PREFIX}/login/confirm/is_need`

export default {
  NEW_FOLDER,
  LIST_BY_PATH,
  DEL,
  RENAME_FOLDER,
  RENAME_FILE,
  PASET,
  PASET_CUT,
  PREFIX,
  UPLOAD,
  LOGOUT,
  LOGOUT_SSO,
  BASE,
  CHECK_ST,
  CHECK_LOGIN,
  SEND_CODE,
  CONFIRM_CODE,
  LOGIN_SSO,
  IS_NEED_CONFIRM,
}