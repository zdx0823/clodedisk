const PREFIX = 'http://localhost:89'

const NEW_FOLDER = `${PREFIX}/api/clodedisk/folder`
const LIST_BY_PATH = `${PREFIX}/api/clodedisk/list`
const DEL = `${PREFIX}/api/clodedisk`
const RENAME_FOLDER = `${PREFIX}/api/clodedisk/folder/name`
const RENAME_FILE = `${PREFIX}/api/clodedisk/file/name`
const PASET = `${PREFIX}/api/clodedisk/resource/copy`
const PASET_CUT = `${PREFIX}/api/clodedisk/resource/cut`
const UPLOAD = `${PREFIX}/api/clodedisk/upload`
const LOGOUT = `${PREFIX}/api/clodedisk/logout`
const LOGOUT_SSO = `http://localhost:90/logout/sso`

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
}