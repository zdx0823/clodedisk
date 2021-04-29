// const PREFIX = 'http://localhost:89'
const PREFIX = '/ppd233'
const BASE = 'http://localhost:8080'

const NEW_FOLDER = `${PREFIX}/api/clodedisk/folder`
const LIST_BY_PATH = `${PREFIX}/api/clodedisk/list`
const DEL = `${PREFIX}/api/clodedisk`
const RENAME_FOLDER = `${PREFIX}/api/clodedisk/folder/name`
const RENAME_FILE = `${PREFIX}/api/clodedisk/file/name`
const PASET = `${PREFIX}/api/clodedisk/resource/copy`
const PASET_CUT = `${PREFIX}/api/clodedisk/resource/cut`
const UPLOAD = `${PREFIX}/api/clodedisk/upload`

// 会话相关
const LOGOUT = `${PREFIX}/logout`
const LOGOUT_SSO = `http://localhost:90/logout/sso`

const LOGIN_SSO = `http://localhost:90/login`
const CHECK_ST = `${PREFIX}/login/check_st`
const CHECK_LOGIN = `${PREFIX}/login/check_login`
const HAS_LOGGED_TOKEN = `${PREFIX}/login/has_logged_token`
const SEND_CODE = `${PREFIX}/login/comfirm/send_code`
const CONFIRM_CODE = `${PREFIX}/login/comfirm/confirm`


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
  HAS_LOGGED_TOKEN,
  CHECK_ST,
  CHECK_LOGIN,
  SEND_CODE,
  CONFIRM_CODE,
  LOGIN_SSO,
}