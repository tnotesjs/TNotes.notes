// ==UserScript==
// @name         微信读书帮助脚本
// @namespace    http://tampermonkey.net/
// @version      2025-04-10
// @description  try to take over the world!
// @author       You
// @match        https://weread.qq.com/web/reader/*
// @icon         https://weread.qq.com/
// @grant        none
// ==/UserScript==

;(function () {
  'use strict'

  console.log('weread script called')

  // 初始化脚本
  document.onmouseup = initializeToolbar

  /**
   * 初始化工具栏事件监听
   */
  function initializeToolbar() {
    const toolbarContainer = document.querySelector('.reader_toolbar_container')
    if (!toolbarContainer) return // 工具栏未出现时退出

    // 绑定键盘事件
    document.onkeydown = handleKeyDown
  }

  /**
   * 处理键盘按下事件
   * @param {KeyboardEvent} e - 键盘事件对象
   */
  function handleKeyDown(e) {
    const { metaKey, ctrlKey, keyCode } = e
    console.log(metaKey, ctrlKey, keyCode)

    // 定义按键与操作的映射关系
    const keyActions = {
      49: () => handleClick('.toolbarItem.wr_copy', '复制'), // 1
      50: () => handleClick('.toolbarItem.underlineBg', '马克笔'), // 2
      51: () => handleClick('.toolbarItem.underlineHandWrite', '波浪线'), // 3
      52: () => handleClick('.toolbarItem.underlineStraight', '直线'), // 4
      53: () => handleClick('.toolbarItem.review', '写想法', true, e), // 5
      54: () => handleClick('.toolbarItem.query', '查询', true, e), // 6
      8: handleBackspace, // backspace
      13: () => (metaKey || ctrlKey) && handleSubmitIdea(), // enter
      27: handleCloseReviewPanel, // esc
    }

    // 检查是否需要执行对应操作
    const action = keyActions[keyCode]
    if (action) {
      action()
    }
  }

  /**
   * 点击指定按钮
   * @param {string} selector - 按钮选择器
   * @param {string} logMessage - 日志信息
   * @param {boolean} preventDefault - 是否阻止默认行为
   */
  function handleClick(selector, logMessage, preventDefault = false, e) {
    if (isVisible_ReaderWriteReviewPanel()) return
    const button = document.querySelector(selector)
    if (button) {
      console.log(`按下 ${logMessage}`)
      button.click()
      if (preventDefault) e.preventDefault()
    }
  }

  /**
   * 处理 Backspace 按键
   */
  function handleBackspace() {
    console.log('按下 backspace 删除记录（包括想法的删除和下划线的删除）')
    document.querySelector('.toolbarItem.removeUnderline')?.click()

    // 单栏删除想法
    document
      .querySelectorAll('.readerReviewDetail_item .actions .actionItem')
      .forEach((btn) => btn.click())

    // ! 暂时不处理多栏删除想法
  }

  /**
   * 提交想法
   */
  function handleSubmitIdea() {
    if (!isVisible_ReaderWriteReviewPanel()) return
    console.log('按下 cmd + enter | ctrl + enter 提交想法')
    const submitButton = document.querySelector(
      '.wr_btn.wr_btn_Big:not([disabled])'
    )
    submitButton && submitButton.click()
  }

  /**
   * 关闭想法记录窗口
   */
  function handleCloseReviewPanel() {
    console.log('按下 esc 关闭想法记录窗口')
    document
      .querySelectorAll('.closeButton, .reader_float_panel_header_closeBtn')
      .forEach((btn) => btn.click())
  }

  /**
   * 判断记录想法的弹窗是否可见
   * @returns {boolean}
   */
  function isVisible_ReaderWriteReviewPanel() {
    const isSingleColumn = document.querySelector(
      '.readerControls_item.isNormalReader'
    )
    if (isSingleColumn) {
      const panel = document.querySelector('.readerWriteReviewPanel')
      return !!panel && panel.style.display !== 'none'
    } else {
      return [
        ...document.querySelectorAll('.float_panel_position_wrapper'),
      ].some((wrapper) => wrapper.offsetWidth > 0)
    }
  }
})()
