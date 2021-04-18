/* eslint-disable no-empty */
import $ from 'jquery'
function deJson (res) {

  if (typeof res === 'object') return res

  let data = {
    status: -1,
    msg: '服务错误，请重试'
  }
  try {
    data = JSON.parse(res)
  } catch (error) {
    data = {
      status: -1,
      msg: res
    }
  }

  return data
}

function notify (vm) {

  return {
    succ (msg) {
      vm.$notify.success({
        title: '成功',
        message: msg,
        duration: 1000
      })
    },
    info (msg) {
      vm.$notify({
        title: '提示',
        message: msg,
        duration: 1000
      })
    },
    error (msg) {
      vm.$notify.error({
        title: '警告',
        message: msg,
        duration: 1000
      })
    }
  }

}

// function dragSelect (container, item, selectedClassName = 'selected') {
function dragSelect (params, callbacks) {

  const { container, item, selectedClassName = 'selected' } = params
  const {
    mouseUpFn = () => {},
    mouseDownFn = () => {},
    mouseMoveFn = () => {},
    selectedFn = () => {}
  } = callbacks

  let carshTest = throttle(dragSelect_crash_test, 200)
  let mouseMoveFn2 = throttle(mouseMoveFn, 200)

  let $containerEl = $(`${container}`)
  let $itemEl = $containerEl.find(`${item}`)
  let $parent = $containerEl.parent()
  let $selectBox = $parent.find('.selectBox')

  let offsetLeft = $parent.offset().left
  let offsetTop = $parent.offset().top

  let downX = 0
  let downY = 0

  $containerEl.css('user-select', 'none')
  $parent.css('user-select', 'none')


  $(document).on('mousedown', (event) => {
    if ($selectBox.length === 0) {
      $parent.append('<div class="selectBox"></div>')
      $selectBox = $parent.find('.selectBox')
    }

    mouseDownFn()

    downX = event.clientX - offsetLeft
    downY = event.clientY - offsetTop + $parent.scrollTop()

    $itemEl = $containerEl.find(`${item}`)
    $itemEl.css('user-select', 'none')
    $itemEl.removeClass(selectedClassName)
    $itemEl.each((index, item) => $(item).data('index', index))

    $selectBox.css({
      top: downY,
      left: downX,
      width: 0,
      height: 0,
      display: 'block'
    })

    $(document).on('mousemove', (event) => {

      let privateL = event.clientX - offsetLeft
      let privateT = event.clientY - offsetTop

      privateL = privateL <= 0 ? 0 : privateL
      privateT = privateT <= 0 ? 0 : privateT


      privateL = privateL >= ($parent.innerWidth() - 2) ? ($parent.innerWidth() - 2) : privateL
      privateT = privateT >= ($parent.height() - 2) ? ($parent.height() - 2) : privateT

      let w = privateL - downX
      let h = privateT - downY + $parent.scrollTop()

      let left = w < 0 ? downX + w : downX
      let top = h < 0 ? downY + h : downY

      $selectBox.css({
        width: Math.abs(w),
        height: Math.abs(h),
        left,
        top
      })

      mouseMoveFn2()
      carshTest({
        $elList: $itemEl,
        $selectBox,
        $parent
      }, function (elsArr) {
        $itemEl.removeClass(selectedClassName)
        $(elsArr).addClass(selectedClassName)
        selectedFn(elsArr)
      })
      
    })

  })


  $(document).mouseup(() => {
    $selectBox.css({
      display: 'none',
      width: 0,
      height: 0
    })
    $(document).off('mousemove')
    mouseUpFn()
  })

}

// 碰撞检测
function dragSelect_crash_test (config, callback = () => {}) {
  const { $elList, $selectBox, $parent} = config

  let $res = []
  $elList.each((index, item) => {

    let $el = $(item)

    let leftLine = $el.position().left
    let topLine = $el.position().top
    let rightLine = leftLine + $el.outerWidth()
    let bottomLine = topLine + $el.outerHeight()


    let boxL = $selectBox.position().left
    let boxR = boxL + $selectBox.outerWidth()
    let boxT = $selectBox.position().top + $parent.scrollTop()
    let boxB = boxT + $selectBox.outerHeight()

    if ( boxL < rightLine && boxT < bottomLine && boxB > topLine && boxR > leftLine) {
      $res.push($el[0])
    }
  })

  callback($res)
}

// 节流
function throttle (fn,delay){
  let valid = true
  return function() {
     if(!valid){
         //休息时间 暂不接客
         return false 
     }
     // 工作时间，执行函数并且在间隔期内把状态位设为无效
      valid = false
      setTimeout(() => {
          fn.apply(null, arguments)
          valid = true;
      }, delay)
  }
}


export {
  deJson,
  notify,
  dragSelect,
  throttle
}