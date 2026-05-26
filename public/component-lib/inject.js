(function() {
  'use strict';

  var PORT = 5001;
  var BTN_ID = 'component-lib-btn';
  var PANEL_ID = 'component-lib-panel';
  var API_BASE = 'http://localhost:' + PORT;

  function loadStyles() {
    var style = document.createElement('style');
    var css = [
      '#' + BTN_ID + '{position:fixed;bottom:74px;left:24px;z-index:99999;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none;padding:10px 16px;border-radius:6px;font-size:13px;font-weight:500;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.15);display:flex;align-items:center;gap:6px;transition:transform .2s,box-shadow .2s}',
      '#' + BTN_ID + ':hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(0,0,0,.2)}',
      '#' + BTN_ID + ' svg{width:16px;height:16px}',
      // 下拉菜单
      '.cl-dropdown-btn{display:flex;align-items:center;gap:6px}',
      '.cl-dropdown-btn .cl-arrow{font-size:10px;transition:transform .2s}',
      '#cl-dropdown-menu{position:fixed;bottom:120px;left:24px;width:160px;background:white;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.15);z-index:999999;opacity:0;pointer-events:none;transform:translateY(10px);transition:opacity .2s,transform .2s}',
      '#cl-dropdown-menu.open{opacity:1;pointer-events:auto;transform:translateY(0)}',
      '.cl-dropdown-item{display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;font-size:13px;color:#333;border-radius:6px;margin:2px 6px}',
      '.cl-dropdown-item:hover{background:#f0f1ff}',
      '.cl-dropdown-item svg{flex-shrink:0;color:#666}',
      '.cl-dropdown-item[data-action="selector"] svg{color:#1890ff}',
      // 元素选择高亮层
      '#cl-highlight-layer{position:fixed;pointer-events:none;z-index:99997;border:2px solid #ff6600;background:rgba(255,102,0,0.1);transition:all .1s;display:none}',
      // 选择模式提示
      '#cl-selector-hint{position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#333;color:white;padding:10px 20px;border-radius:6px;font-size:14px;z-index:999999;display:flex;align-items:center;gap:12px}',
      '#cl-selector-hint .cl-hint-text{flex:1}',
      // 元素信息面板
      '#cl-selector-panel{position:fixed;top:0;right:0;width:360px;height:100vh;background:#fff;box-shadow:-4px 0 24px rgba(0,0,0,.1);z-index:99998;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .3s ease}',
      '#cl-selector-panel.open{transform:translateX(0)}',
      '#cl-selector-panel .cl-sel-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #eee;background:linear-gradient(135deg,#f8f9fa 0%,#e9ecef 100%)}',
      '#cl-selector-panel .cl-sel-header h3{margin:0;font-size:16px;font-weight:600}',
      '#cl-selector-panel .cl-sel-body{flex:1;overflow-y:auto;padding:16px}',
      '#cl-selector-panel .cl-sel-info{background:#f5f5f5;padding:12px;border-radius:6px;margin-bottom:16px}',
      '#cl-selector-panel .cl-sel-info-row{display:flex;justify-content:space-between;padding:4px 0;font-size:13px}',
      '#cl-selector-panel .cl-sel-info-label{color:#666}',
      '#cl-selector-panel .cl-sel-info-value{color:#333;font-weight:500}',
      '#cl-selector-panel .cl-style-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
      '#cl-selector-panel .cl-style-row{display:flex;align-items:center;gap:8px;padding:6px 0}',
      '#cl-selector-panel .cl-style-label{width:60px;font-size:12px;color:#666;flex-shrink:0}',
      '#cl-selector-panel .cl-style-input{flex:1;padding:6px 8px;border:1px solid #ddd;border-radius:4px;font-size:12px}',
      '#cl-selector-panel .cl-class-list{display:flex;flex-wrap:wrap;gap:4px;max-height:100px;overflow-y:auto}',
      '#cl-selector-panel .cl-class-tag{padding:2px 8px;background:#eef0ff;color:#667eea;border-radius:4px;font-size:11px}',
      '#cl-selector-panel .cl-action-row{display:flex;gap:8px;margin-top:16px}',
      '#cl-selector-panel .cl-action-btn{flex:1;padding:10px 16px;border:none;border-radius:6px;font-size:13px;cursor:pointer;font-weight:500}',
      '#cl-selector-panel .cl-action-btn.primary{background:#1890ff;color:white}',
      '#cl-selector-panel .cl-action-btn.secondary{background:#f4f4f5;color:#666}',
      // 批量替换弹窗
      '#cl-batch-dialog{position:fixed;top:0;left:0;right:0;bottom:0;z-index:999999;display:flex;align-items:center;justify-content:center}',
      '#cl-batch-dialog .cl-batch-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.4)}',
      '#cl-batch-dialog .cl-batch-content{position:relative;background:white;padding:24px;border-radius:12px;width:400px;max-width:90%}',
      '#cl-batch-dialog .cl-batch-content h3{margin:0 0 16px;font-size:16px}',
      '#cl-batch-dialog .cl-batch-select{width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;margin-bottom:16px}',
      '#cl-batch-dialog .cl-batch-actions{display:flex;gap:8px;justify-content:flex-end}',
      '#' + PANEL_ID + '{position:fixed;top:0;right:0;width:950px;height:100vh;background:#fff;box-shadow:-4px 0 24px rgba(0,0,0,.1);z-index:99998;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .3s ease}',
      '#' + PANEL_ID + '.open{transform:translateX(0)}',
      '.cl-panel-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #eee;background:linear-gradient(135deg,#f8f9fa 0%,#e9ecef 100%)}',
      '.cl-panel-header h2{margin:0;font-size:16px;font-weight:600;color:#333}',
      '.cl-panel-header button{background:none;border:none;cursor:pointer;padding:4px;color:#666}',
      '.cl-panel-body{display:flex;flex:1;overflow:hidden;min-height:0}',
      '.cl-component-list{flex:0 0 180px;border-right:1px solid #eee;overflow-y:auto;padding:12px;min-height:0}',
      '.cl-component-item{padding:10px 12px;border-radius:6px;cursor:pointer;margin-bottom:4px;font-size:13px;color:#333}',
      '.cl-component-item:hover{background:#f0f1ff}',
      '.cl-component-item.active{background:#eef0ff;border:1px solid #667eea}',
      '.cl-preview-area{flex:1;padding:16px;overflow:auto;min-width:0;min-height:0}',
      '.cl-detail-panel{flex:0 0 320px;border-left:1px solid #eee;overflow-y:auto;padding:16px}',
      '.cl-section{margin-bottom:16px}',
      '.cl-section h3{font-size:14px;font-weight:600;color:#333;margin:0 0 10px;padding-bottom:8px;border-bottom:1px solid #eee}',
      '.cl-variant-item{padding:10px;background:#f8f9fa;border-radius:6px;margin-bottom:6px;cursor:pointer}',
      '.cl-variant-item:hover{background:#f0f1ff}',
      '.cl-variant-item.active{border:1px solid #667eea;background:#eef0ff}',
      '.cl-variant-name{font-weight:500;font-size:13px;color:#333;margin-bottom:4px}',
      '.cl-variant-code{font-size:11px;color:#666;font-family:monospace;word-break:break-all;background:white;padding:6px;border-radius:4px}',
      '.cl-size-item{padding:8px;background:#f8f9fa;border-radius:6px;margin-bottom:4px}',
      '.cl-size-name{font-weight:500;font-size:12px;color:#333;margin-bottom:4px}',
      '.cl-size-code{font-size:11px;color:#666;font-family:monospace;word-break:break-all;background:white;padding:6px;border-radius:4px}',
      '.cl-ref-item{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:#f8f9fa;border-radius:4px;margin-bottom:4px}',
      '.cl-ref-file{font-size:12px;color:#666;flex:1}',
      '.cl-replace-select{padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:11px;margin-left:8px}',
      '.cl-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.3);z-index:99997;opacity:0;pointer-events:none;transition:opacity .3s}',
      '.cl-overlay.open{opacity:1;pointer-events:auto}',
      '.cl-empty{text-align:center;color:#999;padding:30px}',
      '.cl-group-title{font-size:12px;font-weight:600;color:#666;margin:0 0 8px;text-transform:uppercase}'
    ].join('');
    style.textContent = css;
    document.head.appendChild(style);
  }

  var gSelectorMode = false;
  var gHoveredElement = null;
  var gSelectedElement = null;
  var gSelectorHighlight = null;
  var gSelectorHint = null;
  var gSelectorPanel = null;

  function createButton() {
    var btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.className = 'cl-dropdown-btn';
    btn.innerHTML = '组件库 <span class="cl-arrow">▼</span>';

    // 创建下拉菜单
    var dropdown = document.createElement('div');
    dropdown.id = 'cl-dropdown-menu';
    dropdown.innerHTML = [
      '<div class="cl-dropdown-item" data-action="panel">',
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
        '<span>组件库</span>',
      '</div>',
      '<div class="cl-dropdown-item" data-action="selector">',
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3l14 9-7 2-3 6z"/><circle cx="18" cy="6" r="3"/></svg>',
        '<span>选择元素</span>',
      '</div>'
    ].join('');

    document.body.appendChild(dropdown);

    // 默认展开下拉菜单
    dropdown.classList.add('open');
    btn.querySelector('.cl-arrow').textContent = '▲';

    // 按钮点击展开/收起
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.contains('open');
      dropdown.classList.toggle('open');
      btn.querySelector('.cl-arrow').textContent = isOpen ? '▼' : '▲';
    });

    // 菜单项点击
    dropdown.querySelectorAll('.cl-dropdown-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var action = item.dataset.action;
        dropdown.classList.remove('open');
        btn.querySelector('.cl-arrow').textContent = '▼';

        if (action === 'panel') {
          openComponentPanel();
        } else if (action === 'selector') {
          toggleElementSelector(true);
        }
      });
    });

    // 点击外部关闭
    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target) && e.target !== btn) {
        dropdown.classList.remove('open');
        btn.querySelector('.cl-arrow').textContent = '▼';
      }
    });

    return btn;
  }

  function openComponentPanel() {
    document.getElementById(PANEL_ID).classList.add('open');
    document.querySelector('.cl-overlay').classList.add('open');

    loadComponents().then(function(data) {
      gComponents = data;
      gActiveComponent = null;
      gActiveVariant = null;
      renderComponentList();
      document.getElementById('cl-detail-panel').innerHTML = '<div class="cl-empty">选择一个组件</div>';
    });
  }

  // ==================== 元素选择模式 ====================

  function toggleElementSelector(enable) {
    gSelectorMode = enable;

    if (enable) {
      // 关闭组件面板
      document.getElementById(PANEL_ID).classList.remove('open');
      document.querySelector('.cl-overlay').classList.remove('open');

      // 改变鼠标样式
      document.body.style.cursor = 'crosshair';

      // 创建高亮层
      if (!gSelectorHighlight) {
        gSelectorHighlight = document.createElement('div');
        gSelectorHighlight.id = 'cl-highlight-layer';
        document.body.appendChild(gSelectorHighlight);
      }

      // 显示提示
      showSelectorHint();

      // 启用悬停和点击
      document.addEventListener('mouseover', onSelectorMouseOver, true);
      document.addEventListener('mouseout', onSelectorMouseOut, true);
      document.addEventListener('click', onSelectorClick, true);
    } else {
      // 恢复鼠标样式
      document.body.style.cursor = 'default';

      // 隐藏高亮层
      if (gSelectorHighlight) {
        gSelectorHighlight.style.display = 'none';
      }

      // 移除事件监听
      document.removeEventListener('mouseover', onSelectorMouseOver, true);
      document.removeEventListener('mouseout', onSelectorMouseOut, true);
      document.removeEventListener('click', onSelectorClick, true);

      // 移除提示
      if (gSelectorHint) {
        gSelectorHint.remove();
        gSelectorHint = null;
      }
    }
  }

  function onSelectorMouseOver(e) {
    if (!gSelectorMode) return;
    // 忽略自身 UI 元素
    if (e.target.closest('#cl-selector-panel') || e.target.closest('#' + BTN_ID) ||
        e.target.closest('#cl-dropdown-menu') || e.target.closest('#cl-selector-hint') ||
        e.target.closest('#cl-batch-dialog')) return;

    gHoveredElement = e.target;
    var rect = e.target.getBoundingClientRect();
    gSelectorHighlight.style.display = 'block';
    gSelectorHighlight.style.left = (rect.left - 2) + 'px';
    gSelectorHighlight.style.top = (rect.top - 2) + 'px';
    gSelectorHighlight.style.width = (rect.width - 4) + 'px';
    gSelectorHighlight.style.height = (rect.height - 4) + 'px';
  }

  function onSelectorMouseOut(e) {
    if (!gSelectorMode) return;
    gSelectorHighlight.style.display = 'none';
    gHoveredElement = null;
  }

  function onSelectorClick(e) {
    if (!gSelectorMode) return;
    // 忽略自身 UI 元素
    if (e.target.closest('#cl-selector-panel') || e.target.closest('#' + BTN_ID) ||
        e.target.closest('#cl-dropdown-menu') || e.target.closest('#cl-selector-hint') ||
        e.target.closest('#cl-batch-dialog')) return;

    e.preventDefault();
    e.stopPropagation();

    // 优先使用悬停时记录的元素
    var clickedElement = gHoveredElement;

    // 如果没有悬停记录，使用 elementFromPoint 获取
    if (!clickedElement) {
      clickedElement = document.elementFromPoint(e.clientX, e.clientY);
    }

    // 确保不是根元素
    if (!clickedElement || clickedElement === document.documentElement || clickedElement === document.body) {
      // 遍历找到更具体的元素
      var allElements = document.querySelectorAll('#root *');
      var bestElement = null;
      var bestArea = Infinity;

      allElements.forEach(function(el) {
        var rect = el.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
          var area = rect.width * rect.height;
          if (area < bestArea) {
            bestArea = area;
            bestElement = el;
          }
        }
      });

      if (bestElement) clickedElement = bestElement;
    }

    if (!clickedElement || clickedElement === document.documentElement) {
      alert('无法确定点击的元素，请尝试悬停后再点击');
      return;
    }

    gSelectedElement = clickedElement;
    console.log('[Selector] Clicked element:', gSelectedElement);
    console.log('[Selector] Tag:', gSelectedElement.tagName, 'Class:', gSelectedElement.className);

    toggleElementSelector(false);
    showElementInfoPanel(clickedElement);
  }

  function showSelectorHint() {
    gSelectorHint = document.createElement('div');
    gSelectorHint.id = 'cl-selector-hint';
    gSelectorHint.innerHTML = [
      '<span class="cl-hint-text">🔍 点击页面元素查看信息，按 ESC 退出</span>',
      '<button id="cl-exit-selector" style="background:#666;color:white;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:13px">退出</button>'
    ].join('');
    document.body.appendChild(gSelectorHint);

    document.getElementById('cl-exit-selector').addEventListener('click', function() {
      toggleElementSelector(false);
    });
  }

  function identifyComponentType(element) {
    var info = {
      component: null,
      variant: 'default',
      classList: []
    };

    // 1. 检查 data-* 属性
    if (element.dataset.component) {
      info.component = element.dataset.component;
      info.variant = element.dataset.variant || 'default';
    }

    // 2. 检查 classList 中的组件标识
    var componentPatterns = {
      'button': /^btn/i,
      'card': /^card/i,
      'dialog': /^dialog|modal/i,
      'table': /^table/i,
      'badge': /badge/i,
      'input': /input|form-input/i,
      'select': /^select/i,
      'checkbox': /checkbox/i,
      'tabs': /tab/i,
      'menu': /menu/i,
      'breadcrumb': /breadcrumb/i,
      'pagination': /pagination|pager/i,
      'alert': /alert/i,
      'search': /search/i,
      'dropdown': /dropdown/i,
      'sheet': /sheet|drawer/i,
      'toast': /toast/i,
      'sidebar': /sidebar/i,
      'header': /header/i,
      'footer': /footer/i
    };

    for (var i = 0; i < element.classList.length; i++) {
      var cls = element.classList[i];
      info.classList.push(cls);

      if (!info.component) {
        for (var type in componentPatterns) {
          if (componentPatterns[type].test(cls)) {
            info.component = type;
            break;
          }
        }
      }
    }

    // 3. 检查父元素
    if (!info.component) {
      var parent = element.parentElement;
      while (parent && parent !== document.body) {
        for (var type in componentPatterns) {
          if (componentPatterns[type].test(parent.className)) {
            info.component = type;
            break;
          }
        }
        if (info.component) break;
        parent = parent.parentElement;
      }
    }

    // 4. 检查标签名
    if (!info.component) {
      var tagName = element.tagName.toLowerCase();
      if (tagName === 'button') info.component = 'button';
      else if (tagName === 'input') info.component = 'input';
      else if (tagName === 'select') info.component = 'select';
      else if (tagName === 'table') info.component = 'table';
      else if (tagName === 'a') info.component = 'link';
    }

    return info;
  }

  function getElementStyles(element) {
    var computed = window.getComputedStyle(element);
    return {
      backgroundColor: computed.backgroundColor,
      color: computed.color,
      fontSize: computed.fontSize,
      fontFamily: computed.fontFamily,
      fontWeight: computed.fontWeight,
      padding: computed.paddingTop + ' ' + computed.paddingRight + ' ' + computed.paddingBottom + ' ' + computed.paddingLeft,
      margin: computed.marginTop + ' ' + computed.marginRight + ' ' + computed.marginBottom + ' ' + computed.marginLeft,
      border: computed.borderWidth + ' ' + computed.borderStyle + ' ' + computed.borderColor,
      borderRadius: computed.borderRadius,
      boxShadow: computed.boxShadow,
      width: computed.width,
      height: computed.height,
      lineHeight: computed.lineHeight,
      textAlign: computed.textAlign
    };
  }

  function showElementInfoPanel(element) {
    // 移除已有的面板
    var existing = document.getElementById('cl-selector-panel');
    if (existing) existing.remove();

    console.log('[Selector] showElementInfoPanel called with:', element);

    var info = identifyComponentType(element);
    var styles = getElementStyles(element);

    console.log('[Selector] Component info:', info);
    console.log('[Selector] Styles:', styles);

    gSelectorPanel = document.createElement('div');
    gSelectorPanel.id = 'cl-selector-panel';
    gSelectorPanel.innerHTML = [
      '<div class="cl-sel-header">',
        '<h3>🎯 元素信息</h3>',
        '<button id="cl-close-selector-panel" style="background:none;border:none;font-size:20px;cursor:pointer;color:#666">×</button>',
      '</div>',
      '<div class="cl-sel-body">',
        // 组件信息
        '<div class="cl-section">',
          '<h3>组件信息</h3>',
          '<div class="cl-sel-info">',
            '<div class="cl-sel-info-row"><span class="cl-sel-info-label">标签</span><span class="cl-sel-info-value">' + element.tagName.toLowerCase() + '</span></div>',
            '<div class="cl-sel-info-row"><span class="cl-sel-info-label">组件</span><span class="cl-sel-info-value">' + (info.component || '未知') + '</span></div>',
            '<div class="cl-sel-info-row"><span class="cl-sel-info-label">变体</span><span class="cl-sel-info-value">' + info.variant + '</span></div>',
          '</div>',
        '</div>',
        // 样式编辑
        '<div class="cl-section">',
          '<h3>样式编辑</h3>',
          '<div class="cl-style-row">',
            '<label class="cl-style-label">背景色</label>',
            '<input type="color" class="cl-style-input" id="cl-sel-bg" value="' + normalizeColor(styles.backgroundColor) + '">',
            '<input type="text" class="cl-style-input" id="cl-sel-bg-text" value="' + styles.backgroundColor + '" style="flex:1">',
          '</div>',
          '<div class="cl-style-row">',
            '<label class="cl-style-label">文字色</label>',
            '<input type="color" class="cl-style-input" id="cl-sel-color" value="' + normalizeColor(styles.color) + '">',
            '<input type="text" class="cl-style-input" id="cl-sel-color-text" value="' + styles.color + '" style="flex:1">',
          '</div>',
          '<div class="cl-style-row">',
            '<label class="cl-style-label">字号</label>',
            '<input type="text" class="cl-style-input" id="cl-sel-fontSize" value="' + styles.fontSize + '">',
          '</div>',
          '<div class="cl-style-row">',
            '<label class="cl-style-label">字重</label>',
            '<select class="cl-style-input" id="cl-sel-fontWeight">',
              '<option value="400"' + (styles.fontWeight === '400' ? ' selected' : '') + '>正常 (400)</option>',
              '<option value="500"' + (styles.fontWeight === '500' ? ' selected' : '') + '>中等 (500)</option>',
              '<option value="600"' + (styles.fontWeight === '600' ? ' selected' : '') + '>偏粗 (600)</option>',
              '<option value="700"' + (styles.fontWeight === '700' ? ' selected' : '') + '>粗体 (700)</option>',
            '</select>',
          '</div>',
          '<div class="cl-style-row">',
            '<label class="cl-style-label">内边距</label>',
            '<input type="text" class="cl-style-input" id="cl-sel-padding" value="' + styles.padding + '">',
          '</div>',
          '<div class="cl-style-row">',
            '<label class="cl-style-label">圆角</label>',
            '<input type="text" class="cl-style-input" id="cl-sel-borderRadius" value="' + styles.borderRadius + '">',
          '</div>',
          '<div class="cl-style-row">',
            '<label class="cl-style-label">阴影</label>',
            '<input type="text" class="cl-style-input" id="cl-sel-boxShadow" value="' + (styles.boxShadow || 'none') + '">',
          '</div>',
        '</div>',
        // CSS 类名
        '<div class="cl-section">',
          '<h3>CSS 类名</h3>',
          '<div class="cl-class-list">',
            info.classList.map(function(c) { return '<span class="cl-class-tag">' + c + '</span>'; }).join(''),
          '</div>',
        '</div>',
        // 操作按钮
        '<div class="cl-action-row">',
          '<button id="cl-sel-apply" class="cl-action-btn primary">应用样式</button>',
          '<button id="cl-sel-batch" class="cl-action-btn secondary">批量替换同类</button>',
        '</div>',
        '<div class="cl-action-row">',
          '<button id="cl-sel-reset" class="cl-action-btn secondary">重置样式</button>',
          '<button id="cl-sel-continues" class="cl-action-btn secondary">继续选择</button>',
        '</div>',
      '</div>'
    ].join('');

    document.body.appendChild(gSelectorPanel);
    gSelectorPanel.classList.add('open');

    // 绑定事件
    document.getElementById('cl-close-selector-panel').addEventListener('click', closeSelectorPanel);
    document.getElementById('cl-sel-reset').addEventListener('click', function() {
      gSelectedElement.removeAttribute('style');
      showElementInfoPanel(gSelectedElement);
    });
    document.getElementById('cl-sel-continues').addEventListener('click', function() {
      closeSelectorPanel();
      toggleElementSelector(true);
    });
    document.getElementById('cl-sel-batch').addEventListener('click', function() {
      showBatchReplaceDialog(info.component, info.variant);
    });

    // 样式编辑联动
    bindSelectorStyleEvents();
  }

  function bindSelectorStyleEvents() {
    var fields = [
      { color: 'bg', prop: 'backgroundColor' },
      { color: 'color', prop: 'color' },
      { text: 'fontSize', prop: 'fontSize' },
      { select: 'fontWeight', prop: 'fontWeight' },
      { text: 'padding', prop: 'padding' },
      { text: 'borderRadius', prop: 'borderRadius' },
      { text: 'boxShadow', prop: 'boxShadow' }
    ];

    fields.forEach(function(field) {
      var input = document.getElementById('cl-sel-' + field.color);
      if (!input) input = document.getElementById('cl-sel-' + field.text);
      if (!input) input = document.getElementById('cl-sel-' + field.select);
      if (!input) return;

      input.addEventListener('change', function() {
        if (gSelectedElement) {
          gSelectedElement.style[field.prop] = input.value;
          // 同步文本框
          if (field.color && document.getElementById('cl-sel-' + field.color + '-text')) {
            document.getElementById('cl-sel-' + field.color + '-text').value = input.value;
          }
        }
      });

      if (field.color) {
        var textInput = document.getElementById('cl-sel-' + field.color + '-text');
        if (textInput) {
          textInput.addEventListener('change', function() {
            if (gSelectedElement) {
              gSelectedElement.style[field.prop] = textInput.value;
              input.value = textInput.value;
            }
          });
        }
      }
    });
  }

  function closeSelectorPanel() {
    if (gSelectorPanel) {
      gSelectorPanel.classList.remove('open');
      setTimeout(function() {
        if (gSelectorPanel) {
          gSelectorPanel.remove();
          gSelectorPanel = null;
        }
      }, 300);
    }
    gSelectedElement = null;
  }

  function showBatchReplaceDialog(component, currentVariant) {
    var dialog = document.createElement('div');
    dialog.id = 'cl-batch-dialog';
    dialog.innerHTML = [
      '<div class="cl-batch-overlay"></div>',
      '<div class="cl-batch-content">',
        '<h3>批量替换 ' + (component || '未知组件') + '</h3>',
        '<p style="color:#666;font-size:13px;margin-bottom:12px">将页面所有同类组件的样式替换为：</p>',
        '<select id="cl-batch-target-variant" class="cl-batch-select">',
          '<option value="default">default - 默认</option>',
          '<option value="primary">primary - 主要</option>',
          '<option value="secondary">secondary - 次要</option>',
          '<option value="destructive">destructive - 危险</option>',
          '<option value="outline">outline - 描边</option>',
          '<option value="ghost">ghost - 幽灵</option>',
        '</select>',
        '<div class="cl-batch-actions">',
          '<button id="cl-batch-cancel" class="cl-action-btn secondary">取消</button>',
          '<button id="cl-batch-confirm" class="cl-action-btn primary">确认替换</button>',
        '</div>',
      '</div>'
    ].join('');

    document.body.appendChild(dialog);

    dialog.querySelector('.cl-batch-overlay').addEventListener('click', function() {
      dialog.remove();
    });
    document.getElementById('cl-batch-cancel').addEventListener('click', function() {
      dialog.remove();
    });
    document.getElementById('cl-batch-confirm').addEventListener('click', function() {
      var newVariant = document.getElementById('cl-batch-target-variant').value;
      batchReplaceSameType(component, newVariant);
      dialog.remove();
    });
  }

  function batchReplaceSameType(component, newVariant) {
    if (!component) {
      alert('无法识别组件类型，无法批量替换');
      return;
    }

    var count = 0;
    var selector = '[data-component="' + component + '"], [class*="' + component + '"]';

    document.querySelectorAll(selector).forEach(function(el) {
      el.dataset.variant = newVariant;
      count++;
    });

    if (count === 0) {
      alert('未找到同类组件');
    } else {
      alert('已在 ' + count + ' 个元素上应用 ' + newVariant + ' 变体');
    }
  }

  function createPanel() {
    var panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.innerHTML = [
      '<div class="cl-panel-header">',
        '<h2>组件库</h2>',
        '<div>',
          '<button id="cl-refresh-btn" title="刷新" style="margin-right:8px;padding:6px 12px;border:1px solid #ddd;border-radius:4px;font-size:12px;cursor:pointer">刷新</button>',
          '<button id="cl-close-btn" title="关闭"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>',
        '</div>',
      '</div>',
      '<div class="cl-panel-body">',
        '<div class="cl-component-list" id="cl-component-list"></div>',
        '<div class="cl-preview-area" id="cl-preview-area">',
          '<div id="cl-preview-content"></div>',
        '</div>',
        '<div id="cl-detail-panel" class="cl-detail-panel"></div>',
      '</div>'
    ].join('');
    return panel;
  }

  function createOverlay() {
    var overlay = document.createElement('div');
    overlay.className = 'cl-overlay';
    return overlay;
  }

  var gComponents = null;
  var gActiveComponent = null;
  var gActiveVariant = null;
  var gActiveRegion = null; // 当前选中的区域
  var gStyleConfig = {}; // 存储选中组件的样式配置
  var gRegionStyles = {}; // 存储各区域的样式配置

  // 组件区域配置表 - 定义每种组件包含的区域
  var componentRegions = {
    'button': [
      { id: 'container', name: '容器', desc: '按钮整体容器' },
      { id: 'text', name: '文字', desc: '按钮文字' }
    ],
    'table': [
      { id: 'tableContainer', name: '表格容器', desc: '表格整体容器' },
      { id: 'tableHeader', name: '表头', desc: '表格列标题' },
      { id: 'tableRow', name: '表格行', desc: '表格数据行' },
      { id: 'tableCell', name: '单元格', desc: '数据单元格' },
      { id: 'tableButton', name: '操作按钮', desc: '行内操作按钮' }
    ],
    'dialog': [
      { id: 'dialogContainer', name: '对话框容器', desc: '弹窗整体' },
      { id: 'dialogHeader', name: '标题区', desc: '弹窗标题栏' },
      { id: 'dialogContent', name: '内容区', desc: '弹窗内容' },
      { id: 'dialogFooter', name: '底部按钮区', desc: '确认/取消按钮' }
    ],
    'sheet': [
      { id: 'sheetContainer', name: '侧边栏容器', desc: '侧边抽屉整体' },
      { id: 'sheetHeader', name: '标题区', desc: '侧边栏标题栏' },
      { id: 'sheetContent', name: '内容区', desc: '侧边栏内容' },
      { id: 'sheetFooter', name: '底部按钮区', desc: '底部按钮' }
    ],
    'tabs': [
      { id: 'tabsContainer', name: '标签栏容器', desc: '标签整体' },
      { id: 'tabItem', name: '标签项', desc: '单个标签' },
      { id: 'tabActive', name: '激活标签', desc: '当前激活标签' }
    ],
    'pagination': [
      { id: 'paginationContainer', name: '分页器容器', desc: '分页器整体' },
      { id: 'pageButton', name: '页码按钮', desc: '数字页码' },
      { id: 'pageButtonActive', name: '当前页码', desc: '当前页码' },
      { id: 'navButton', name: '翻页按钮', desc: '上一页/下一页' }
    ],
    'menu': [
      { id: 'menuContainer', name: '菜单容器', desc: '菜单整体' },
      { id: 'menuItem', name: '菜单项', desc: '单个菜单项' },
      { id: 'menuItemActive', name: '激活菜单项', desc: '当前激活菜单' }
    ],
    'breadcrumb': [
      { id: 'breadcrumbContainer', name: '面包屑容器', desc: '面包屑整体' },
      { id: 'breadcrumbItem', name: '链接项', desc: '可点击链接' },
      { id: 'breadcrumbCurrent', name: '当前项', desc: '当前页面' }
    ],
    'card': [
      { id: 'cardContainer', name: '卡片容器', desc: '卡片整体' },
      { id: 'cardImage', name: '卡片图片', desc: '卡片顶部图片' },
      { id: 'cardTitle', name: '卡片标题', desc: '卡片标题文字' },
      { id: 'cardContent', name: '卡片内容', desc: '卡片描述文字' }
    ],
    'badge': [
      { id: 'badgeContainer', name: '徽章容器', desc: '徽章整体' },
      { id: 'badgeText', name: '徽章文字', desc: '徽章文字' }
    ],
    'alert': [
      { id: 'alertContainer', name: '提示框容器', desc: '提示框整体' },
      { id: 'alertContent', name: '提示内容', desc: '提示文字内容' }
    ],
    'search': [
      { id: 'searchContainer', name: '搜索面板', desc: '搜索条件区' },
      { id: 'searchInput', name: '输入框', desc: '搜索输入框' },
      { id: 'searchSelect', name: '下拉选择', desc: '筛选下拉框' },
      { id: 'searchButton', name: '搜索按钮', desc: '搜索/重置按钮' }
    ],
    'form': [
      { id: 'formContainer', name: '表单容器', desc: '表单整体' },
      { id: 'formLabel', name: '表单标签', desc: '字段标签文字' },
      { id: 'formInput', name: '表单输入', desc: '输入控件' },
      { id: 'formButton', name: '表单按钮', desc: '提交/重置按钮' }
    ],
    'input': [
      { id: 'inputContainer', name: '输入框容器', desc: '输入框整体' },
      { id: 'inputText', name: '输入文字', desc: 'placeholder/输入文字' }
    ],
    'select': [
      { id: 'selectContainer', name: '选择器容器', desc: '选择器整体' },
      { id: 'selectText', name: '选择文字', desc: '选中项文字' }
    ],
    'checkbox': [
      { id: 'checkboxContainer', name: '复选框容器', desc: '复选框整体' },
      { id: 'checkboxLabel', name: '复选框标签', desc: '关联文字' }
    ],
    'accordion': [
      { id: 'accordionContainer', name: '折叠面板容器', desc: '折叠面板整体' },
      { id: 'accordionHeader', name: '折叠标题', desc: '可点击标题' },
      { id: 'accordionContent', name: '折叠内容', desc: '展开内容' }
    ],
    'sidebar': [
      { id: 'sidebarContainer', name: '侧边栏容器', desc: '侧边栏整体' },
      { id: 'sidebarItem', name: '菜单项', desc: '侧边栏菜单项' },
      { id: 'sidebarItemActive', name: '激活项', desc: '当前选中菜单' }
    ],
    'toast': [
      { id: 'toastContainer', name: '提示容器', desc: '提示消息整体' },
      { id: 'toastContent', name: '提示文字', desc: '提示内容文字' }
    ],
    'popover': [
      { id: 'popoverContainer', name: '弹出框容器', desc: '弹出框整体' },
      { id: 'popoverContent', name: '弹出内容', desc: '弹出内容文字' }
    ],
    'default': [
      { id: 'container', name: '容器', desc: '组件整体容器' },
      { id: 'content', name: '内容', desc: '组件内容' }
    ]
  };

  // 区域样式配置 - 定义每个区域可配置的样式属性
  var regionStyleFields = {
    'container': ['bg', 'color', 'borderColor', 'borderWidth', 'borderStyle', 'borderRadius', 'boxShadow', 'opacity', 'padding', 'margin'],
    'content': ['color', 'fontSize', 'fontWeight', 'textAlign'],
    'text': ['color', 'fontSize', 'fontWeight', 'textAlign'],
    'image': ['borderRadius', 'opacity'],
    'header': ['bg', 'color', 'fontSize', 'fontWeight', 'padding'],
    'footer': ['bg', 'color', 'padding'],
    'button': ['bg', 'color', 'borderColor', 'borderWidth', 'borderRadius', 'padding', 'fontSize', 'fontWeight'],
    'input': ['bg', 'color', 'borderColor', 'borderWidth', 'borderRadius', 'padding', 'fontSize'],
    'select': ['bg', 'color', 'borderColor', 'borderWidth', 'borderRadius', 'padding', 'fontSize'],
    'row': ['bg', 'borderColor', 'borderWidth'],
    'cell': ['color', 'fontSize', 'padding', 'borderColor', 'borderWidth', 'textAlign']
  };

  // 转换颜色值为 #rrggbb 格式
  function normalizeColor(color) {
    if (!color) return '#000000';
    if (color.startsWith('#')) return color.toLowerCase();
    if (color === 'white') return '#ffffff';
    if (color === 'black') return '#000000';
    // rgb 转 #rrggbb
    var match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      var r = parseInt(match[1]).toString(16).padStart(2, '0');
      var g = parseInt(match[2]).toString(16).padStart(2, '0');
      var b = parseInt(match[3]).toString(16).padStart(2, '0');
      return '#' + r + g + b;
    }
    return '#000000';
  }

  async function loadComponents() {
    try {
      var res = await fetch(API_BASE + '/api/components');
      if (!res.ok) throw new Error('Failed to fetch');
      var data = await res.json();
      return data;
    } catch (e) {
      console.error('[Component-Lib] Failed to load:', e);
      return null;
    }
  }

  async function loadReferences(componentName) {
    try {
      var res = await fetch(API_BASE + '/api/components/' + componentName + '/references');
      if (!res.ok) throw new Error('Failed to fetch');
      return await res.json();
    } catch (e) {
      console.error('[Component-Lib] Failed to load references:', e);
      return [];
    }
  }

  async function replaceVariant(componentName, from, to) {
    try {
      var res = await fetch(API_BASE + '/api/components/' + componentName + '/replace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: from, to: to })
      });
      return await res.json();
    } catch (e) {
      console.error('[Component-Lib] Replace failed:', e);
      return { success: false };
    }
  }

  async function refreshData() {
    try {
      await fetch(API_BASE + '/api/refresh');
      location.reload();
    } catch (e) {
      console.error('[Component-Lib] Refresh failed:', e);
    }
  }

  function renderComponentList() {
    var list = document.getElementById('cl-component-list');
    if (!list || !gComponents) return;

    list.innerHTML = '';

    var title = document.createElement('div');
    title.className = 'cl-group-title';
    title.textContent = '组件 Components';
    list.appendChild(title);

    gComponents.components.forEach(function(comp) {
      var item = document.createElement('div');
      item.className = 'cl-component-item' + (gActiveComponent === comp.name ? ' active' : '');
      item.innerHTML = '<span style="font-weight:500">' + (comp.label || comp.name) + '</span><span style="font-size:11px;color:#999;margin-left:4px">' + comp.name + '</span>';
      item.title = comp.type + ': ' + (comp.label || comp.name);
      item.addEventListener('click', function() {
        selectComponent(comp.name);
      });
      list.appendChild(item);
    });
  }

  function selectComponent(name) {
    if (!gComponents || !name) return;
    gActiveComponent = name;
    gActiveVariant = null;
    renderComponentList();
    renderDetail();
    renderPreview();
  }

  function renderPreview() {
    var previewArea = document.getElementById('cl-preview-area');
    if (!previewArea || !gComponents || !gActiveComponent) {
      if (previewArea) previewArea.innerHTML = '<div style="padding:40px;color:#999">选择一个组件查看预览</div>';
      return;
    }

    var comp = null;
    for (var i = 0; i < gComponents.components.length; i++) {
      if (gComponents.components[i].name === gActiveComponent) {
        comp = gComponents.components[i];
        break;
      }
    }

    if (!comp) {
      previewArea.innerHTML = '<div style="padding:40px;color:#999">组件未找到</div>';
      return;
    }

    // 直接渲染预览内容
    var html = '<div style="padding:16px">';
    html += '<div style="background:white;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 1px 3px rgba(0,0,0,0.1)">';
    html += '<h3 style="margin:0 0 16px;font-size:16px;color:#1a1a1a;border-bottom:2px solid #1890ff;padding-bottom:8px">' + (comp.label || comp.name) + ' <span style="font-size:11px;color:#999;font-weight:normal">(' + (comp.type || 'unknown') + ')</span></h3>';

    // 获取组件区域配置
    var regions = componentRegions[comp.type] || componentRegions['default'];
    var activeRegions = gActiveVariant ? [gActiveRegion || 'container'] : regions.map(function(r) { return r.id; });

    // 区域标签页 - 仅在选中组件实例时显示
    if (gActiveVariant && regions.length > 1) {
      html += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #eee">';
      html += '<span style="font-size:12px;color:#666;line-height:28px">区域:</span>';
      regions.forEach(function(r) {
        var isActive = gActiveRegion === r.id || (!gActiveRegion && r.id === 'container');
        html += '<button class="cl-region-btn" data-region="' + r.id + '" style="padding:4px 12px;border-radius:16px;font-size:12px;cursor:pointer;border:1px solid ' + (isActive ? '#667eea' : '#ddd') + ';background:' + (isActive ? '#eef0ff' : 'white') + ';color:' + (isActive ? '#667eea' : '#666') + ';font-weight:' + (isActive ? '500' : '400') + '">' + r.name + '</button>';
      });
      html += '</div>';
    } else if (regions.length > 1) {
      html += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #eee">';
      html += '<span style="font-size:12px;color:#666;line-height:28px">区域:</span>';
      regions.forEach(function(r) {
        html += '<span style="padding:4px 12px;border-radius:16px;font-size:12px;background:#f5f5f5;color:#999">' + r.name + '</span>';
      });
      html += '</div>';
    }

    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px">';

    // 获取组件实际的变体和尺寸数据
    var actualVariants = (comp.variants && comp.variants.variant) ? comp.variants.variant : [];
    var actualSizes = (comp.variants && comp.variants.size) ? comp.variants.size : [];
    var compName = comp.name;
    var compType = comp.type || '';

    // 根据组件类型选择默认预览样式
    var defaultBg = '#1890ff';
    var defaultColor = 'white';
    var hasBorder = false;

    // 根据 className 判断实际样式
    if (actualVariants.length > 0) {
      actualVariants.forEach(function(v) {
        if (v.className && v.className.includes('#1890ff')) { defaultBg = '#1890ff'; defaultColor = 'white'; }
        else if (v.className && v.className.includes('#10b981')) { defaultBg = '#10b981'; defaultColor = 'white'; }
        else if (v.className && v.className.includes('#d4183d')) { defaultBg = '#d4183d'; defaultColor = 'white'; }
        else if (v.className && v.className.includes('#f59e0b')) { defaultBg = '#f59e0b'; defaultColor = 'white'; }
        else if (v.className && v.className.includes('#0891b2')) { defaultBg = '#0891b2'; defaultColor = 'white'; }
        else if (v.className && v.className.includes('primary')) { defaultBg = '#1890ff'; defaultColor = 'white'; }
        else if (v.className && v.className.includes('destructive')) { defaultBg = '#d4183d'; defaultColor = 'white'; }
        else if (v.className && v.className.includes('outline')) { defaultBg = 'white'; defaultColor = '#333'; hasBorder = true; }
        else if (v.className && v.className.includes('secondary')) { defaultBg = '#f4f4f5'; defaultColor = '#666'; }
      });
    }

    // 获取 CSS 变量
    function getCssVar(name, fallback) {
      try {
        var val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        return val || fallback;
      } catch(e) {
        return fallback;
      }
    }

    // 读取全局 CSS 变量
    var cssPrimary = getCssVar('--primary', '#1890ff');
    var cssPrimaryFg = getCssVar('--primary-foreground', 'white');
    var cssBorder = getCssVar('--border', 'rgba(0,0,0,0.05)');

    // 根据组件类型渲染不同的预览样式
    if (comp.type === 'button') {
      // Button 组件 - 渲染按钮样式，每个 variant 显示不同尺寸
      var btnVariants = [
        { name: 'default', bg: cssPrimary, color: cssPrimaryFg },
        { name: 'destructive', bg: '#d4183d', color: 'white' },
        { name: 'outline', bg: 'white', color: '#333', border: '1px solid ' + cssBorder },
        { name: 'secondary', bg: '#f4f4f5', color: '#666' },
        { name: 'ghost', bg: 'transparent', color: '#333' },
        { name: 'link', bg: 'transparent', color: '#1890ff', textDecoration: 'underline' },
        { name: 'warning', bg: '#f59e0b', color: 'white' },
        { name: 'success', bg: '#10b981', color: 'white' },
        { name: 'cyan', bg: '#0891b2', color: 'white' }
      ];

      var btnSizes = [
        { name: 'sm', padding: '4px 12px', fontSize: '12px' },
        { name: 'default', padding: '8px 16px', fontSize: '14px' },
        { name: 'lg', padding: '12px 24px', fontSize: '16px' }
      ];

      // 渲染每个 variant 及其尺寸
      var instanceId = 0;
      btnVariants.forEach(function(v) {
        html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
        html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">' + v.name + '</span>';
        html += '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">';

        btnSizes.forEach(function(s) {
          var isActive = gActiveVariant === v.name + '-' + s.name;
          var activeStyle = isActive ? 'box-shadow:0 0 0 2px #667eea;' : '';
          var thisInstanceId = 'btn-' + instanceId++;
          // 如果当前实例被选中且有保存的样式，使用保存的样式
          var savedStyle = (isActive && gStyleConfig.instanceId === thisInstanceId) ? gStyleConfig : null;
          var bg = savedStyle ? savedStyle.backgroundColor : v.bg;
          var color = savedStyle ? savedStyle.color : v.color;
          var fontSize = savedStyle ? savedStyle.fontSize : s.fontSize;
          var padding = savedStyle ? savedStyle.padding : s.padding;
          var border = savedStyle ? (savedStyle.borderWidth + ' ' + savedStyle.borderStyle + ' ' + savedStyle.borderColor) : (v.border || '');
          html += '<button class="cl-preview-btn" data-variant="' + v.name + '" data-size="' + s.name + '" data-instance="' + thisInstanceId + '" style="padding:' + padding + ';border-radius:6px;font-size:' + fontSize + ';font-weight:500;cursor:pointer;border:none;background:' + bg + ';color:' + color + ';' + (border ? 'border:' + border + ';' : '') + activeStyle + '">' + s.name + '</button>';
        });

        html += '</div></div>';
      });

    } else if (comp.type === 'badge') {
      // Badge 组件 - 渲染徽章样式
      var badgeVariants = [
        { name: 'default', bg: '#1890ff', color: 'white' },
        { name: 'secondary', bg: '#f4f4f5', color: '#666' },
        { name: 'destructive', bg: '#d4183d', color: 'white' },
        { name: 'outline', bg: 'transparent', color: '#333', border: '1px solid #d9d9d9' }
      ];
      instanceId = 0;
      badgeVariants.forEach(function(v) {
        var isActive = gActiveVariant === v.name;
        var activeStyle = isActive ? 'box-shadow:0 0 0 2px #667eea;' : '';
        html += '<div class="cl-preview-btn" data-variant="' + v.name + '" data-instance="badge-' + instanceId++ + '" style="padding:12px;background:#fafafa;border-radius:8px;text-align:center;cursor:pointer;' + activeStyle + '">';
        html += '<span style="font-size:12px;color:#666;display:block;margin-bottom:8px">' + v.name + '</span>';
        html += '<span style="padding:2px 8px;border-radius:10px;font-size:12px;font-weight:500;display:inline-block;background:' + v.bg + ';color:' + v.color + ';' + (v.border ? 'border:' + v.border + ';' : '') + '">' + v.name + '</span>';
        html += '</div>';
      });

    } else if (comp.type === 'alert') {
      // Alert 组件 - 渲染警告框样式
      var alertVariants = [
        { name: 'default', bg: 'white', color: '#333', border: '1px solid #e8e8e8', icon: 'ℹ' },
        { name: 'info', bg: '#e6f7ff', color: '#1890ff', border: '1px solid #91d5ff', icon: 'ℹ' },
        { name: 'success', bg: '#f6ffed', color: '#52c41a', border: '1px solid #b7eb8f', icon: '✓' },
        { name: 'warning', bg: '#fffbe6', color: '#faad14', border: '1px solid #ffe58f', icon: '⚠' },
        { name: 'destructive', bg: '#fff2f0', color: '#ff4d4f', border: '1px solid #ffccc7', icon: '✕' }
      ];
      instanceId = 0;
      alertVariants.forEach(function(v) {
        var isActive = gActiveVariant === v.name;
        var activeStyle = isActive ? 'box-shadow:0 0 0 2px #667eea;' : '';
        html += '<div class="cl-preview-btn" data-variant="' + v.name + '" data-instance="alert-' + instanceId++ + '" style="padding:12px;background:#fafafa;border-radius:8px;grid-column:span 2;cursor:pointer;' + activeStyle + '">';
        html += '<span style="font-size:12px;color:#666;display:block;margin-bottom:8px">' + v.name + '</span>';
        html += '<div style="padding:12px 16px;border-radius:8px;background:' + v.bg + ';color:' + v.color + ';border:' + v.border + ';display:flex;align-items:center;gap:12px">';
        html += '<span>' + v.icon + '</span><span>' + v.name + ' 提示信息</span>';
        html += '</div></div>';
      });

    } else {
      // 其他组件 - 根据类型渲染对应的预览样式
      if (actualVariants.length > 0) {

        if (compType === 'input' || compType === 'textarea') {
          // 输入框样式 - 使用 CSS 变量
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          var inputIdx = 0;
          actualVariants.forEach(function(v) {
            var isActive = gActiveVariant === v.name;
            var activeStyle = isActive ? 'box-shadow:0 0 0 2px #667eea;' : '';
            var disabledStyle = v.name === 'disabled' || v.name === 'readonly' ? 'opacity:0.5;' : '';
            html += '<div class="cl-preview-btn" data-variant="' + v.name + '" data-instance="input-' + inputIdx++ + '" style="margin-bottom:12px;cursor:pointer;padding:8px;border-radius:6px;' + activeStyle + '">';
            html += '<span style="font-size:12px;color:#999;display:block;margin-bottom:4px">' + v.name + '</span>';
            html += '<input type="text" placeholder="请输入..." style="width:200px;padding:8px 12px;border:1px solid var(--border, #d9d9d9);border-radius:6px;font-size:14px;background:var(--input-background, white);color:var(--foreground, #333);' + disabledStyle + '"' + (v.name === 'disabled' ? ' disabled' : '') + '>';
            html += '</div>';
          });
          html += '</div>';

        } else if (compType === 'select') {
          // 选择器样式 - 使用 CSS 变量
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          var selectIdx = 0;
          actualVariants.forEach(function(v) {
            var isActive = gActiveVariant === v.name;
            var activeStyle = isActive ? 'box-shadow:0 0 0 2px #667eea;' : '';
            html += '<div class="cl-preview-btn" data-variant="' + v.name + '" data-instance="select-' + selectIdx++ + '" style="margin-bottom:12px;cursor:pointer;padding:8px;border-radius:6px;' + activeStyle + '">';
            html += '<span style="font-size:12px;color:#999;display:block;margin-bottom:4px">' + v.name + '</span>';
            html += '<select style="width:200px;padding:8px 12px;border:1px solid var(--border, #d9d9d9);border-radius:6px;font-size:14px;background:white"><option>选项 1</option><option>选项 2</option></select>';
            html += '</div>';
          });
          html += '</div>';

        } else if (compType === 'checkbox' || compType === 'switch' || compType === 'radio') {
          // 复选框/开关/单选样式 - 使用 CSS 变量
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div style="display:flex;flex-direction:column;gap:12px">';
          var checkboxIdx = 0;
          actualVariants.forEach(function(v) {
            var isActive = gActiveVariant === v.name;
            var activeStyle = isActive ? 'box-shadow:0 0 0 2px #667eea;border-radius:4px;padding:4px;' : '';
            var inputType = compType === 'radio' ? 'radio' : 'checkbox';
            html += '<label class="cl-preview-btn" data-variant="' + v.name + '" data-instance="checkbox-' + checkboxIdx++ + '" style="display:flex;align-items:center;gap:8px;cursor:pointer;' + activeStyle + '">';
            html += '<input type="' + inputType + '"' + (v.name === 'checked' || v.name === 'default' ? ' checked' : '') + '>';
            html += '<span>' + v.name + '</span>';
            html += '</label>';
          });
          html += '</div></div>';

        } else if (compType === 'dialog' || compType === 'drawer') {
          // 对话框/抽屉样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px;grid-column:span 2">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div style="background:white;border:1px solid #e8e8e8;border-radius:8px;max-width:300px">';
          html += '<div style="padding:16px;border-bottom:1px solid #e8e8e8;font-weight:600">标题</div>';
          html += '<div style="padding:16px">内容区域</div>';
          html += '<div style="padding:16px;border-top:1px solid #e8e8e8;display:flex;justify-content:flex-end;gap:8px">';
          html += '<button style="padding:8px 16px;background:#f4f4f5;color:#333;border:none;border-radius:6px;font-size:14px">取消</button>';
          html += '<button style="padding:8px 16px;background:#1890ff;color:white;border:none;border-radius:6px;font-size:14px">确定</button>';
          html += '</div></div></div>';

        } else if (compType === 'table') {
          // 表格样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px;grid-column:span 3">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div class="cl-preview-btn" data-variant="default" data-instance="table-0" style="cursor:pointer;border-radius:6px;padding:8px;margin-bottom:8px">';
          html += '<div style="background:white;border:1px solid #e8e8e8;border-radius:8px;overflow:hidden">';
          html += '<table style="width:100%;border-collapse:collapse">';
          html += '<thead style="background:#fafafa"><tr><th style="padding:12px 16px;text-align:left;border-bottom:1px solid #e8e8e8;font-weight:500">列1</th><th style="padding:12px 16px;text-align:left;border-bottom:1px solid #e8e8e8;font-weight:500">列2</th><th style="padding:12px 16px;text-align:left;border-bottom:1px solid #e8e8e8;font-weight:500">操作</th></tr></thead>';
          html += '<tbody><tr><td style="padding:12px 16px;border-bottom:1px solid #e8e8e8">数据1</td><td style="padding:12px 16px;border-bottom:1px solid #e8e8e8">数据2</td><td style="padding:12px 16px;border-bottom:1px solid #e8e8e8"><button style="padding:4px 12px;background:#1890ff;color:white;border:none;border-radius:4px;font-size:12px">编辑</button></td></tr></tbody>';
          html += '</table></div></div></div>';

        } else if (compType === 'search') {
          // 搜索面板样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px;grid-column:span 3">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div class="cl-preview-btn" data-variant="default" data-instance="search-0" style="cursor:pointer;border-radius:6px;padding:8px;margin-bottom:8px">';
          html += '<div style="background:white;border:1px solid #e8e8e8;border-radius:8px;padding:16px">';
          html += '<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end">';
          html += '<div><label style="font-size:12px;color:#666;display:block;margin-bottom:4px">关键词</label><input type="text" style="height:32px;padding:0 12px;border:1px solid #d9d9d9;border-radius:6px;font-size:14px;width:160px" placeholder="搜索..."></div>';
          html += '<div><label style="font-size:12px;color:#666;display:block;margin-bottom:4px">状态</label><select style="height:32px;padding:0 12px;border:1px solid #d9d9d9;border-radius:6px;font-size:14px"><option>全部</option><option>启用</option><option>禁用</option></select></div>';
          html += '<button style="height:32px;padding:0 16px;background:#1890ff;color:white;border:none;border-radius:6px;font-size:14px">搜索</button>';
          html += '<button style="height:32px;padding:0 16px;background:#f4f4f5;color:#333;border:none;border-radius:6px;font-size:14px">重置</button>';
          html += '</div></div></div></div>';

        } else if (compType === 'form') {
          // 表单样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px;grid-column:span 2">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div class="cl-preview-btn" data-variant="default" data-instance="form-0" style="cursor:pointer;border-radius:6px;padding:8px;margin-bottom:8px">';
          html += '<div style="background:white;padding:24px;border:1px solid #e8e8e8;border-radius:8px">';
          html += '<div style="margin-bottom:16px"><label style="display:block;margin-bottom:6px;font-size:14px;font-weight:500">输入框</label><input type="text" style="width:100%;padding:8px 12px;border:1px solid #d9d9d9;border-radius:6px;font-size:14px"></div>';
          html += '<div style="display:flex;gap:8px;justify-content:flex-end"><button style="padding:8px 16px;background:#f4f4f5;color:#333;border:none;border-radius:6px;font-size:14px">重置</button><button style="padding:8px 16px;background:#1890ff;color:white;border:none;border-radius:6px;font-size:14px">提交</button></div>';
          html += '</div></div></div>';

        } else if (compType === 'tabs') {
          // 标签页样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div class="cl-preview-btn" data-variant="default" data-instance="tabs-0" style="cursor:pointer;border-radius:6px;padding:8px;margin-bottom:8px">';
          html += '<div style="display:flex;border-bottom:1px solid #e8e8e8">';
          html += '<div style="padding:12px 16px;color:#1890ff;border-bottom:2px solid #1890ff;font-weight:500">标签1</div>';
          html += '<div style="padding:12px 16px;color:#666">标签2</div>';
          html += '<div style="padding:12px 16px;color:#666">标签3</div>';
          html += '</div></div>';

        } else if (compType === 'breadcrumb') {
          // 面包屑样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div class="cl-preview-btn" data-variant="default" data-instance="breadcrumb-0" style="cursor:pointer;border-radius:6px;padding:8px;margin-bottom:8px">';
          html += '<div style="display:flex;align-items:center;gap:8px;font-size:14px">';
          html += '<span style="color:#1890ff;cursor:pointer">首页</span>';
          html += '<span style="color:#999">/</span>';
          html += '<span style="color:#1890ff;cursor:pointer">分类</span>';
          html += '<span style="color:#999">/</span>';
          html += '<span style="color:#333">当前页面</span>';
          html += '</div></div>';

        } else if (compType === 'pagination') {
          // 分页样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div class="cl-preview-btn" data-variant="default" data-instance="pagination-0" style="cursor:pointer;border-radius:6px;padding:8px;margin-bottom:8px">';
          html += '<div style="display:flex;gap:4px">';
          html += '<button style="padding:8px 12px;background:#f4f4f5;border:none;border-radius:6px;cursor:pointer">«</button>';
          html += '<button style="padding:8px 12px;background:#f4f4f5;border:none;border-radius:6px;cursor:pointer">‹</button>';
          html += '<button style="padding:8px 12px;background:#1890ff;color:white;border:none;border-radius:6px;cursor:pointer">1</button>';
          html += '<button style="padding:8px 12px;background:#f4f4f5;border:none;border-radius:6px;cursor:pointer">2</button>';
          html += '<button style="padding:8px 12px;background:#f4f4f5;border:none;border-radius:6px;cursor:pointer">›</button>';
          html += '<button style="padding:8px 12px;background:#f4f4f5;border:none;border-radius:6px;cursor:pointer">»</button>';
          html += '</div></div>';

        } else if (compType === 'progress') {
          // 进度条样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div style="height:8px;background:#f0f0f0;border-radius:4px;overflow:hidden;margin-bottom:8px"><div style="width:60%;height:100%;background:#1890ff"></div></div>';
          html += '<div style="height:8px;background:#f0f0f0;border-radius:4px;overflow:hidden;margin-bottom:8px"><div style="width:30%;height:100%;background:#52c41a"></div></div>';
          html += '<div style="height:8px;background:#f0f0f0;border-radius:4px;overflow:hidden"><div style="width:80%;height:100%;background:#faad14"></div></div>';
          html += '</div>';

        } else if (compType === 'slider') {
          // 滑块样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div style="height:6px;background:#f0f0f0;border-radius:3px;position:relative;margin:20px 0">';
          html += '<div style="position:absolute;left:30%;top:-6px;width:18px;height:18px;background:#1890ff;border-radius:50%;cursor:pointer"></div>';
          html += '</div></div>';

        } else if (compType === 'tooltip') {
          // 文字提示样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px;position:relative">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div style="display:inline-block;padding:6px 12px;background:#333;color:white;border-radius:6px;font-size:12px;position:relative">';
          html += '<div style="position:absolute;top:100%;left:50%;transform:translateX(-50%);border:6px solid transparent;border-top-color:#333"></div>';
          html += '提示文字</div>';
          html += '</div>';

        } else if (compType === 'avatar') {
          // 头像样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div style="display:flex;gap:12px;align-items:center">';
          html += '<div style="width:32px;height:32px;background:#1890ff;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:14px">A</div>';
          html += '<div style="width:40px;height:40px;background:#52c41a;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:16px">B</div>';
          html += '<div style="width:48px;height:48px;background:#faad14;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:18px">C</div>';
          html += '</div></div>';

        } else if (compType === 'skeleton') {
          // 骨架屏样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div style="display:flex;gap:12px;align-items:center">';
          html += '<div style="width:40px;height:40px;background:#f0f0f0;border-radius:50%;animation:skeleton-pulse 1.5s infinite"></div>';
          html += '<div style="flex:1"><div style="height:12px;background:#f0f0f0;border-radius:4px;margin-bottom:8px;animation:skeleton-pulse 1.5s infinite"></div><div style="height:12px;width:60%;background:#f0f0f0;border-radius:4px;animation:skeleton-pulse 1.5s infinite"></div></div>';
          html += '</div></div>';

        } else if (compType === 'separator') {
          // 分隔线样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div style="height:1px;background:#e8e8e8;margin:12px 0"></div>';
          html += '<div style="border-top:1px dashed #e8e8e8;margin:12px 0"></div>';
          html += '</div>';

        } else if (compType === 'label') {
          // 标签样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div style="font-size:14px;font-weight:500;margin-bottom:8px">标签文本</div>';
          html += '<div style="font-size:12px;color:#666">次要标签</div>';
          html += '</div>';

        } else if (compType === 'accordion' || compName === 'Accordion' || compName === 'Collapsible') {
          // 折叠面板样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          var accIdx = 0;
          actualVariants.forEach(function(v) {
            var isActive = gActiveVariant === v.name;
            var activeStyle = isActive ? 'box-shadow:0 0 0 2px #667eea;' : '';
            html += '<div class="cl-preview-btn" data-variant="' + v.name + '" data-instance="accordion-' + accIdx++ + '" style="background:white;border:1px solid #e8e8e8;border-radius:8px;margin-bottom:8px;overflow:hidden;cursor:pointer;' + activeStyle + '">';
            html += '<div style="padding:12px 16px;background:#fafafa;font-weight:500;display:flex;justify-content:space-between;align-items:center">';
            html += '<span>标题</span><span style="font-size:12px;color:#999">›</span>';
            html += '</div>';
            html += '<div style="padding:12px 16px;border-top:1px solid #e8e8e8">内容区域</div>';
            html += '</div>';
          });
          html += '</div>';

        } else if (compType === 'aspect' || compName === 'AspectRatio') {
          // 宽高比样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div class="cl-preview-btn" data-variant="default" data-instance="aspect-0" style="display:flex;gap:16px;cursor:pointer">';
          html += '<div style="width:80px;aspect-ratio:1/1;background:#1890ff;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-size:12px">1:1</div>';
          html += '<div style="width:120px;aspect-ratio:16/9;background:#52c41a;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-size:12px">16:9</div>';
          html += '<div style="width:100px;aspect-ratio:4/3;background:#faad14;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-size:12px">4:3</div>';
          html += '</div></div>';

        } else if (compType === 'datepicker' || compName === 'Calendar' || compName === 'DatePicker') {
          // 日期选择器样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div class="cl-preview-btn" data-variant="default" data-instance="datepicker-0" style="background:white;border:1px solid #e8e8e8;border-radius:8px;padding:16px;cursor:pointer;max-width:280px">';
          html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">';
          html += '<span style="font-weight:500">2024年1月</span>';
          html += '<div style="display:flex;gap:4px">';
          html += '<button style="padding:4px 8px;border:1px solid #e8e8e8;background:white;border-radius:4px;cursor:pointer">‹</button>';
          html += '<button style="padding:4px 8px;border:1px solid #e8e8e8;background:white;border-radius:4px;cursor:pointer">›</button>';
          html += '</div></div>';
          html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center;font-size:12px">';
          html += '<span style="color:#999">日</span><span style="color:#999">一</span><span style="color:#999">二</span><span style="color:#999">三</span><span style="color:#999">四</span><span style="color:#999">五</span><span style="color:#999">六</span>';
          for (var di = 1; di <= 31; di++) {
            var isToday = di === 15 ? 'background:#1890ff;color:white;border-radius:4px' : '';
            html += '<span style="padding:4px;' + isToday + '">' + di + '</span>';
          }
          html += '</div></div></div>';

        } else if (compType === 'card' || compName === 'Card' || compName === 'HoverCard') {
          // 卡片样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">';
          var cardIdx = 0;
          actualVariants.forEach(function(v) {
            var isActive = gActiveVariant === v.name;
            var activeStyle = isActive ? 'box-shadow:0 0 0 2px #667eea;' : '';
            html += '<div class="cl-preview-btn" data-variant="' + v.name + '" data-instance="card-' + cardIdx++ + '" style="background:white;border:1px solid #e8e8e8;border-radius:12px;padding:16px;cursor:pointer;' + activeStyle + '">';
            html += '<div style="height:80px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:8px;margin-bottom:12px"></div>';
            html += '<div style="font-weight:500;margin-bottom:4px">卡片标题</div>';
            html += '<div style="font-size:12px;color:#666">卡片内容描述</div>';
            html += '</div>';
          });
          html += '</div></div>';

        } else if (compType === 'carousel' || compName === 'Carousel') {
          // 轮播样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div class="cl-preview-btn" data-variant="default" data-instance="carousel-0" style="background:white;border:1px solid #e8e8e8;border-radius:8px;overflow:hidden;cursor:pointer">';
          html += '<div style="height:120px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);display:flex;align-items:center;justify-content:center;color:white;font-size:18px">轮播图 1/3</div>';
          html += '<div style="padding:12px;display:flex;justify-content:center;gap:8px">';
          html += '<span style="width:24px;height:4px;background:#1890ff;border-radius:2px"></span>';
          html += '<span style="width:8px;height:4px;background:#e8e8e8;border-radius:2px"></span>';
          html += '<span style="width:8px;height:4px;background:#e8e8e8;border-radius:2px"></span>';
          html += '</div></div></div>';

        } else if (compType === 'chart' || compName === 'Chart') {
          // 图表样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div class="cl-preview-btn" data-variant="default" data-instance="chart-0" style="background:white;border:1px solid #e8e8e8;border-radius:8px;padding:16px;cursor:pointer">';
          html += '<div style="height:120px;display:flex;align-items:flex-end;gap:16px;padding:0 20px">';
          html += '<div style="flex:1;height:60%;background:#1890ff;border-radius:4px 4px 0 0"></div>';
          html += '<div style="flex:1;height:80%;background:#52c41a;border-radius:4px 4px 0 0"></div>';
          html += '<div style="flex:1;height:40%;background:#faad14;border-radius:4px 4px 0 0"></div>';
          html += '<div style="flex:1;height:90%;background:#722ed1;border-radius:4px 4px 0 0"></div>';
          html += '<div style="flex:1;height:50%;background:#eb2f96;border-radius:4px 4px 0 0"></div>';
          html += '</div></div></div>';

        } else if (compType === 'command' || compName === 'Command') {
          // 命令菜单样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div class="cl-preview-btn" data-variant="default" data-instance="command-0" style="background:white;border:1px solid #e8e8e8;border-radius:8px;padding:8px;cursor:pointer;max-width:280px">';
          html += '<div style="padding:8px 12px;display:flex;align-items:center;gap:8px;color:#666;font-size:13px">';
          html += '<span>🔍</span><span>搜索命令...</span>';
          html += '</div>';
          html += '<div style="border-top:1px solid #e8e8e8;margin-top:8px">';
          html += '<div style="padding:8px 12px;display:flex;justify-content:space-between;align-items:center;font-size:13px"><span>设置</span><span style="color:#999;font-size:12px">⌘,</span></div>';
          html += '<div style="padding:8px 12px;display:flex;justify-content:space-between;align-items:center;font-size:13px"><span>帮助</span><span style="color:#999;font-size:12px">⌘?</span></div>';
          html += '</div></div></div>';

        } else if (compType === 'menu' || compName === 'Menubar' || compName === 'NavigationMenu' || compName === 'ContextMenu') {
          // 菜单样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div class="cl-preview-btn" data-variant="default" data-instance="menu-0" style="background:white;border:1px solid #e8e8e8;border-radius:8px;padding:8px;cursor:pointer">';
          html += '<div style="display:flex;gap:4px">';
          html += '<button style="padding:6px 12px;background:#1890ff;color:white;border:none;border-radius:4px;font-size:13px">菜单1</button>';
          html += '<button style="padding:6px 12px;background:transparent;color:#333;border:none;border-radius:4px;font-size:13px">菜单2</button>';
          html += '<button style="padding:6px 12px;background:transparent;color:#333;border:none;border-radius:4px;font-size:13px">菜单3</button>';
          html += '</div></div></div>';

        } else if (compType === 'dropdown' || compName === 'DropdownMenu') {
          // 下拉菜单样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div class="cl-preview-btn" data-variant="default" data-instance="dropdown-0" style="background:white;border:1px solid #e8e8e8;border-radius:8px;padding:8px;cursor:pointer;position:relative">';
          html += '<button style="padding:8px 16px;background:#1890ff;color:white;border:none;border-radius:6px;font-size:14px;display:flex;align-items:center;gap:8px">';
          html += '操作 <span style="font-size:12px">▾</span>';
          html += '</button>';
          html += '<div style="position:absolute;top:100%;left:0;margin-top:4px;background:white;border:1px solid #e8e8e8;border-radius:8px;min-width:160px;box-shadow:0 4px 12px rgba(0,0,0,0.1);padding:4px;z-index:10">';
          html += '<div style="padding:8px 12px;font-size:13px;border-radius:4px;cursor:pointer">编辑</div>';
          html += '<div style="padding:8px 12px;font-size:13px;border-radius:4px;cursor:pointer">复制</div>';
          html += '<div style="border-top:1px solid #e8e8e8;margin:4px 0"></div>';
          html += '<div style="padding:8px 12px;font-size:13px;color:#d4183d;border-radius:4px;cursor:pointer">删除</div>';
          html += '</div></div></div>';

        } else if (compName === 'InputOTP' || compName === 'input-otp' || compType === 'otp') {
          // 一次性密码样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div class="cl-preview-btn" data-variant="default" data-instance="otp-0" style="background:white;border:1px solid #e8e8e8;border-radius:8px;padding:16px;cursor:pointer">';
          html += '<div style="display:flex;gap:8px;justify-content:center">';
          for (var oi = 1; oi <= 6; oi++) {
            html += '<input type="text" maxlength="1" style="width:40px;height:48px;text-align:center;font-size:20px;border:1px solid #d9d9d9;border-radius:6px" value="' + (oi <= 3 ? oi : '') + '">';
          }
          html += '</div></div></div>';

        } else if (compType === 'popover' || compName === 'Popover') {
          // 弹出框样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div class="cl-preview-btn" data-variant="default" data-instance="popover-0" style="background:white;border:1px solid #e8e8e8;border-radius:8px;padding:16px;cursor:pointer;position:relative">';
          html += '<button style="padding:8px 16px;background:#1890ff;color:white;border:none;border-radius:6px;font-size:14px">点击我</button>';
          html += '<div style="position:absolute;top:100%;left:16px;margin-top:8px;background:#333;color:white;padding:8px 12px;border-radius:6px;font-size:13px;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.2)">';
          html += '弹出提示内容';
          html += '<div style="position:absolute;top:-6px;left:20px;border:6px solid transparent;border-bottom-color:#333"></div>';
          html += '</div></div></div>';

        } else if (compType === 'resizable' || compName === 'Resizable') {
          // 可调整大小样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div class="cl-preview-btn" data-variant="default" data-instance="resizable-0" style="background:white;border:1px solid #e8e8e8;border-radius:8px;padding:16px;cursor:pointer;display:flex;gap:16px">';
          html += '<div style="width:150px;height:100px;background:#fafafa;border:1px solid #d9d9d9;position:relative">';
          html += '<div style="position:absolute;right:-4px;bottom:-4px;width:12px;height:12px;background:#1890ff;border-radius:2px;cursor:se-resize"></div>';
          html += '</div>';
          html += '<div style="width:100px;height:60px;background:#fafafa;border:1px solid #d9d9d9;position:relative">';
          html += '<div style="position:absolute;right:-4px;bottom:-4px;width:12px;height:12px;background:#1890ff;border-radius:2px;cursor:se-resize"></div>';
          html += '</div></div></div>';

        } else if (compType === 'scrollarea' || compName === 'ScrollArea') {
          // 滚动区域样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div class="cl-preview-btn" data-variant="default" data-instance="scrollarea-0" style="background:white;border:1px solid #e8e8e8;border-radius:8px;padding:16px;cursor:pointer;max-height:120px;overflow:auto;position:relative">';
          html += '<div style="padding-right:20px">';
          for (var si = 1; si <= 10; si++) {
            html += '<div style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px">列表项 ' + si + '</div>';
          }
          html += '</div>';
          html += '<div style="position:absolute;right:4px;top:16px;bottom:16px;width:6px;background:#e8e8e8;border-radius:3px"><div style="position:absolute;top:20%;height:40%;left:0;right:0;background:#999;border-radius:3px"></div></div>';
          html += '</div></div>';

        } else if (compType === 'sheet' || compName === 'Sheet') {
          // Sheet 侧边抽屉样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div class="cl-preview-btn" data-variant="default" data-instance="sheet-0" style="background:white;border:1px solid #e8e8e8;border-radius:8px;cursor:pointer;overflow:hidden">';
          html += '<div style="padding:16px;border-bottom:1px solid #e8e8e8;display:flex;justify-content:space-between;align-items:center">';
          html += '<span style="font-weight:500">抽屉标题</span><button style="background:none;border:none;cursor:pointer;font-size:18px;color:#999">×</button>';
          html += '</div>';
          html += '<div style="padding:16px">抽屉内容区域</div>';
          html += '<div style="padding:16px;border-top:1px solid #e8e8e8;display:flex;justify-content:flex-end;gap:8px">';
          html += '<button style="padding:8px 16px;background:#f4f4f5;color:#333;border:none;border-radius:6px;font-size:14px">取消</button>';
          html += '<button style="padding:8px 16px;background:#1890ff;color:white;border:none;border-radius:6px;font-size:14px">确认</button>';
          html += '</div></div></div>';

        } else if (compType === 'sidebar' || compName === 'Sidebar') {
          // 侧边栏样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div class="cl-preview-btn" data-variant="default" data-instance="sidebar-0" style="background:white;border:1px solid #e8e8e8;border-radius:8px;cursor:pointer;overflow:hidden;display:flex">';
          html += '<div style="width:180px;background:#1a1a1a;min-height:150px;padding:12px">';
          html += '<div style="padding:10px 12px;color:white;font-size:14px;font-weight:500;background:rgba(255,255,255,0.1);border-radius:6px;margin-bottom:8px">菜单1</div>';
          html += '<div style="padding:10px 12px;color:rgba(255,255,255,0.6);font-size:14px;margin-bottom:4px">菜单2</div>';
          html += '<div style="padding:10px 12px;color:rgba(255,255,255,0.6);font-size:14px;margin-bottom:4px">菜单3</div>';
          html += '</div>';
          html += '<div style="flex:1;padding:16px">内容区域</div>';
          html += '</div></div>';

        } else if (compType === 'toast' || compName === 'Sonner') {
          // 轻提示样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div class="cl-preview-btn" data-variant="default" data-instance="toast-0" style="display:flex;flex-direction:column;gap:8px;cursor:pointer">';
          html += '<div style="background:white;border:1px solid #e8e8e8;border-radius:8px;padding:12px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1)">';
          html += '<span style="color:#52c41a;font-size:18px">✓</span><span style="font-size:14px">操作成功</span>';
          html += '</div>';
          html += '<div style="background:white;border:1px solid #e8e8e8;border-radius:8px;padding:12px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1)">';
          html += '<span style="color:#faad14;font-size:18px">⚠</span><span style="font-size:14px">警告信息</span>';
          html += '</div>';
          html += '<div style="background:white;border:1px solid #e8e8e8;border-radius:8px;padding:12px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1)">';
          html += '<span style="color:#ff4d4f;font-size:18px">✕</span><span style="font-size:14px">错误信息</span>';
          html += '</div>';
          html += '</div></div>';

        } else if (compType === 'statusbadge' || compName === 'StatusBadge') {
          // 状态徽章样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div style="display:flex;flex-wrap:wrap;gap:12px">';
          var sbIdx = 0;
          actualVariants.forEach(function(v) {
            var isActive = gActiveVariant === v.name;
            var activeStyle = isActive ? 'box-shadow:0 0 0 2px #667eea;' : '';
            html += '<div class="cl-preview-btn" data-variant="' + v.name + '" data-instance="statusbadge-' + sbIdx++ + '" style="padding:12px;background:#fafafa;border-radius:8px;cursor:pointer;' + activeStyle + '">';
            html += '<span style="font-size:12px;color:#666;display:block;margin-bottom:8px">' + v.name + '</span>';
            html += '<span style="padding:4px 10px;border-radius:12px;font-size:12px;font-weight:500;display:inline-flex;align-items:center;gap:6px;background:#52c41a;color:white">' + (v.name === 'success' || v.name === 'active' ? '✓' : '') + ' ' + v.name + '</span>';
            html += '</div>';
          });
          html += '</div></div>';

        } else if (compType === 'toggle' || compType === 'toggle-group' || compName === 'Toggle' || compName === 'ToggleGroup') {
          // 开关样式
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
          html += '<div class="cl-preview-btn" data-variant="default" data-instance="toggle-0" style="background:white;border:1px solid #e8e8e8;border-radius:8px;padding:16px;cursor:pointer">';
          html += '<div style="display:flex;flex-direction:column;gap:12px">';
          html += '<label style="display:flex;align-items:center;gap:12px;cursor:pointer">';
          html += '<div style="width:44px;height:24px;background:#1890ff;border-radius:12px;position:relative"><div style="position:absolute;top:2px;left:22px;width:20px;height:20px;background:white;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,0.2)"></div></div>';
          html += '<span style="font-size:14px">开启状态</span>';
          html += '</label>';
          html += '<label style="display:flex;align-items:center;gap:12px;cursor:pointer">';
          html += '<div style="width:44px;height:24px;background:#d9d9d9;border-radius:12px;position:relative"><div style="position:absolute;top:2px;left:2px;width:20px;height:20px;background:white;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,0.2)"></div></div>';
          html += '<span style="font-size:14px">关闭状态</span>';
          html += '</label>';
          html += '</div></div></div>';

        } else {
          // 默认：渲染变体列表作为按钮
          html += '<div style="padding:12px;background:#fafafa;border-radius:8px;grid-column:span 2">';
          html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants (' + actualVariants.length + ')</span>';
          html += '<div style="display:flex;flex-wrap:wrap;gap:8px">';

          actualVariants.forEach(function(v) {
            var bg = defaultBg;
            var color = defaultColor;
            var border = hasBorder ? '1px solid #d9d9d9' : '';
            var fontSize = '14px';
            var padding = '8px 16px';

            // 如果当前实例被选中且有保存的样式，使用保存的样式
            var instanceKey = 'default-' + v.name;
            var savedStyle = (gStyleConfig.instanceId === instanceKey) ? gStyleConfig : null;
            if (savedStyle) {
              bg = savedStyle.backgroundColor || bg;
              color = savedStyle.color || color;
              fontSize = savedStyle.fontSize || fontSize;
              padding = savedStyle.padding || padding;
              border = (savedStyle.borderWidth + ' ' + savedStyle.borderStyle + ' ' + savedStyle.borderColor).trim() || border;
            }

            if (v.className && !savedStyle) {
              if (v.className.includes('#1890ff') || v.name === 'default') { bg = '#1890ff'; color = 'white'; border = ''; }
              else if (v.className.includes('#10b981') || v.name === 'success') { bg = '#10b981'; color = 'white'; }
              else if (v.className.includes('#d4183d') || v.name === 'destructive') { bg = '#d4183d'; color = 'white'; }
              else if (v.className.includes('#f59e0b') || v.name === 'warning') { bg = '#f59e0b'; color = 'white'; }
              else if (v.className.includes('#0891b2') || v.name === 'cyan') { bg = '#0891b2'; color = 'white'; }
              else if (v.className.includes('outline')) { bg = 'white'; color = '#333'; border = '1px solid #d9d9d9'; }
              else if (v.className.includes('secondary') || v.name === 'secondary') { bg = '#f4f4f5'; color = '#666'; border = ''; }
            }

            var isActive = gActiveVariant === v.name;
            var activeStyle = isActive ? 'box-shadow:0 0 0 2px #667eea;' : '';
            html += '<button class="cl-preview-btn" data-variant="' + v.name + '" data-instance="default-' + v.name + '" style="padding:' + padding + ';border-radius:6px;font-size:' + fontSize + ';font-weight:500;cursor:pointer;border:none;background:' + bg + ';color:' + color + ';' + (border ? 'border:' + border + ';' : '') + activeStyle + '">' + v.name + '</button>';
          });

          html += '</div></div>';
        }
      }
    }

    // 渲染尺寸（如果组件有尺寸数据）
    if (actualSizes.length > 0 && comp.type === 'button') {
      // Button 的尺寸已经在每个 variant 下渲染过了，跳过
    } else if (actualSizes.length > 0) {
      html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
      html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">尺寸 Sizes</span>';
      html += '<div style="display:flex;flex-wrap:wrap;gap:8px">';
      actualSizes.forEach(function(s) {
        var sizeStyle = 'padding:8px 16px;background:' + defaultBg + ';color:' + defaultColor + ';border:none;border-radius:6px;font-size:14px;cursor:pointer;';
        if (s.name === 'sm') sizeStyle = 'padding:4px 12px;background:' + defaultBg + ';color:' + defaultColor + ';border:none;border-radius:6px;font-size:12px;cursor:pointer;';
        if (s.name === 'lg') sizeStyle = 'padding:12px 24px;background:' + defaultBg + ';color:' + defaultColor + ';border:none;border-radius:6px;font-size:16px;cursor:pointer;';
        html += '<button style="' + sizeStyle + '">' + s.name + '</button>';
      });
      html += '</div></div>';
    }

    html += '</div></div></div>';
    previewArea.innerHTML = html;

    // 绑定按钮点击事件（支持 variant 和 size 选择）
    previewArea.querySelectorAll('.cl-preview-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var variant = btn.dataset.variant;
        var size = btn.dataset.size;
        var instanceId = btn.dataset.instance || '';
        var regionId = btn.dataset.region || 'container';
        var fullKey = variant + (size ? '-' + size : '');

        // 切换选中状态（同时考虑区域）
        if (gActiveVariant === fullKey && (gActiveRegion === regionId || (!gActiveRegion && regionId === 'container'))) {
          gActiveVariant = null;
          gActiveRegion = null;
          gStyleConfig = {};
          gRegionStyles = {};
        } else {
          gActiveVariant = fullKey;
          gActiveRegion = regionId;

          // 初始化或更新区域样式配置
          var styleKey = fullKey + '-' + regionId;
          if (!gRegionStyles[styleKey]) {
            var computedStyle = window.getComputedStyle(btn);
            gRegionStyles[styleKey] = {
              instanceId: instanceId,
              regionId: regionId,
              backgroundColor: btn.style.backgroundColor || computedStyle.backgroundColor || '#1890ff',
              width: btn.style.width || 'auto',
              height: btn.style.height || 'auto',
              fontSize: btn.style.fontSize || computedStyle.fontSize || '14px',
              color: btn.style.color || computedStyle.color || 'white',
              padding: btn.style.padding || computedStyle.padding || '8px 16px',
              margin: btn.style.margin || '0',
              borderColor: computedStyle.borderColor || '#d9d9d9',
              borderWidth: computedStyle.borderWidth || '0px',
              borderStyle: computedStyle.borderStyle || 'none',
              borderRadius: btn.style.borderRadius || '6px',
              opacity: btn.style.opacity || '1',
              fontWeight: btn.style.fontWeight || '500',
              textAlign: btn.style.textAlign || 'center',
              boxShadow: btn.style.boxShadow || 'none'
            };
          }
          gStyleConfig = gRegionStyles[styleKey];
        }
        renderDetail();
        renderPreview();
        bindStyleEditorEvents();
      });
    });

    // 绑定区域按钮点击
    previewArea.querySelectorAll('.cl-region-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var regionId = btn.dataset.region;
        if (!regionId) return;

        gActiveRegion = regionId;
        if (gActiveVariant && !gRegionStyles[gActiveVariant + '-' + regionId]) {
          gRegionStyles[gActiveVariant + '-' + regionId] = {
            regionId: regionId,
            backgroundColor: '#1890ff',
            color: 'white',
            fontSize: '14px',
            padding: '8px 16px',
            borderColor: '#d9d9d9',
            borderWidth: '0px',
            borderStyle: 'none'
          };
        }
        gStyleConfig = gRegionStyles[gActiveVariant + '-' + regionId] || {};
        renderDetail();
        renderPreview();
        bindStyleEditorEvents();
      });
    });
  }

  // 绑定样式编辑器事件
  function bindStyleEditorEvents() {
    var styleFields = ['bg', 'color', 'fontSize', 'padding', 'margin', 'borderColor', 'borderWidth', 'borderStyle', 'width', 'height'];

    styleFields.forEach(function(field) {
      var colorInput = document.getElementById('cl-style-' + field);
      var textInput = document.getElementById('cl-style-' + field + '-text');
      var rangeInput = document.getElementById('cl-style-' + field + '-range');

      if (colorInput && textInput) {
        colorInput.addEventListener('input', function() {
          textInput.value = colorInput.value;
          // 直接更新 gStyleConfig
          if (field === 'bg') {
            gStyleConfig.backgroundColor = colorInput.value;
          } else {
            gStyleConfig[field] = colorInput.value;
          }
          updatePreviewStyle(field, colorInput.value);
        });
        colorInput.addEventListener('change', function() {
          textInput.value = colorInput.value;
          if (field === 'bg') {
            gStyleConfig.backgroundColor = colorInput.value;
          } else {
            gStyleConfig[field] = colorInput.value;
          }
          updatePreviewStyle(field, colorInput.value);
        });
      }

      if (rangeInput && textInput) {
        rangeInput.addEventListener('input', function() {
          var value = rangeInput.value + 'px';
          textInput.value = value;
          gStyleConfig.fontSize = value;
          updatePreviewStyle(field, value);
        });
      }

      if (textInput && !rangeInput) {
        textInput.addEventListener('change', function() {
          if (field === 'bg') {
            gStyleConfig.backgroundColor = textInput.value;
          } else {
            gStyleConfig[field] = textInput.value;
          }
          updatePreviewStyle(field, textInput.value);
          // 同步 color picker
          var colorInput = document.getElementById('cl-style-' + field);
          if (colorInput && colorInput.type === 'color') {
            colorInput.value = textInput.value;
          }
        });
      }
    });

    // 边框样式 select
    var borderStyleSelect = document.getElementById('cl-style-borderStyle');
    if (borderStyleSelect) {
      borderStyleSelect.addEventListener('change', function() {
        gStyleConfig.borderStyle = borderStyleSelect.value;
        updatePreviewStyle('borderStyle', borderStyleSelect.value);
      });
    }

    // 透明度 range
    var opacityRange = document.getElementById('cl-style-opacity-range');
    var opacityText = document.getElementById('cl-style-opacity-text');
    if (opacityRange && opacityText) {
      opacityRange.addEventListener('input', function() {
        var value = (opacityRange.value / 100).toFixed(2);
        opacityText.value = value;
        gStyleConfig.opacity = value;
        updatePreviewStyle('opacity', value);
      });
    }

    // 圆角
    var borderRadiusInput = document.getElementById('cl-style-borderRadius');
    if (borderRadiusInput) {
      borderRadiusInput.addEventListener('change', function() {
        gStyleConfig.borderRadius = borderRadiusInput.value;
        updatePreviewStyle('borderRadius', borderRadiusInput.value);
      });
    }

    // 字重 select
    var fontWeightSelect = document.getElementById('cl-style-fontWeight');
    if (fontWeightSelect) {
      fontWeightSelect.addEventListener('change', function() {
        gStyleConfig.fontWeight = fontWeightSelect.value;
        updatePreviewStyle('fontWeight', fontWeightSelect.value);
      });
    }

    // 对齐 select
    var textAlignSelect = document.getElementById('cl-style-textAlign');
    if (textAlignSelect) {
      textAlignSelect.addEventListener('change', function() {
        gStyleConfig.textAlign = textAlignSelect.value;
        updatePreviewStyle('textAlign', textAlignSelect.value);
      });
    }

    // 阴影
    var boxShadowInput = document.getElementById('cl-style-boxShadow');
    if (boxShadowInput) {
      boxShadowInput.addEventListener('change', function() {
        gStyleConfig.boxShadow = boxShadowInput.value;
        updatePreviewStyle('boxShadow', boxShadowInput.value);
      });
    }
  }

  // 更新预览样式
  function updatePreviewStyle(field, value) {
    // 找到当前选中的实例并更新样式
    var previewArea = document.getElementById('cl-preview-area');
    if (!previewArea) return;

    var selectedBtn = previewArea.querySelector('.cl-preview-btn[style*="box-shadow:0 0 0 2px"]');
    if (!selectedBtn) return;

    var cssMap = {
      'bg': 'backgroundColor',
      'color': 'color',
      'fontSize': 'fontSize',
      'padding': 'padding',
      'margin': 'margin',
      'borderColor': 'borderColor',
      'borderWidth': 'borderWidth',
      'borderStyle': 'borderStyle',
      'width': 'width',
      'height': 'height',
      'borderRadius': 'borderRadius',
      'opacity': 'opacity',
      'fontWeight': 'fontWeight',
      'textAlign': 'textAlign',
      'boxShadow': 'boxShadow'
    };

    var cssProp = cssMap[field] || field;

    // 直接更新样式
    selectedBtn.style[cssProp] = value;

    // 更新内存配置
    if (field === 'bg') {
      gStyleConfig.backgroundColor = value;
    } else if (field === 'borderRadius' || field === 'opacity' || field === 'fontWeight' || field === 'textAlign' || field === 'boxShadow') {
      gStyleConfig[field] = value;
    }
  }

  // 保存当前样式
  function saveCurrentStyle() {
    if (!gActiveComponent || !gActiveVariant || !gStyleConfig) {
      alert('请先选择一个组件实例');
      return;
    }

    // 收集所有区域的样式配置
    var allStyles = {};
    Object.keys(gRegionStyles).forEach(function(key) {
      var style = gRegionStyles[key];
      allStyles[style.regionId] = {
        backgroundColor: style.backgroundColor || '',
        color: style.color || '',
        fontSize: style.fontSize || '',
        padding: style.padding || '',
        margin: style.margin || '',
        borderColor: style.borderColor || '',
        borderWidth: style.borderWidth || '',
        borderStyle: style.borderStyle || '',
        width: style.width || '',
        height: style.height || '',
        borderRadius: style.borderRadius || '',
        opacity: style.opacity || '',
        fontWeight: style.fontWeight || '',
        textAlign: style.textAlign || '',
        boxShadow: style.boxShadow || ''
      };
    });

    var styleData = {
      component: gActiveComponent,
      variant: gActiveVariant,
      region: gActiveRegion || 'container',
      instanceId: gStyleConfig.instanceId || '',
      styles: allStyles
    };

    // 发送到后端保存
    fetch(API_BASE + '/api/styles/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(styleData)
    }).then(function(res) {
      return res.json();
    }).then(function(result) {
      if (result.success) {
        alert('样式保存成功！\n\n组件: ' + gActiveComponent + '\n变体: ' + gActiveVariant + '\n区域: ' + (gActiveRegion || 'container'));
        renderPreview();
      } else {
        alert('样式保存失败: ' + (result.error || '未知错误'));
      }
    }).catch(function(err) {
      console.error('保存样式失败:', err);
      alert('样式已更新（本地预览）\n\n组件: ' + gActiveComponent + '\n变体: ' + gActiveVariant + '\n区域: ' + (gActiveRegion || 'container'));
    });
  }

  // 读取 CSS 变量并应用样式到预览按钮
  function applyCssVariablesToPreview() {
    // 直接重新渲染预览，这样会读取最新的 CSS 变量
    renderPreview();
  }

  // 重置样式
  function resetStyle() {
    var previewArea = document.getElementById('cl-preview-area');
    var selectedBtn = previewArea ? previewArea.querySelector('.cl-preview-btn[style*="box-shadow:0 0 0 2px"]') : null;

    if (selectedBtn) {
      // 重置为默认样式
      selectedBtn.style.backgroundColor = '#1890ff';
      selectedBtn.style.color = 'white';
      selectedBtn.style.fontSize = '14px';
      selectedBtn.style.padding = '8px 16px';
      selectedBtn.style.margin = '0';
      selectedBtn.style.border = 'none';
      selectedBtn.style.width = 'auto';
      selectedBtn.style.height = 'auto';

      // 重置内存配置
      gStyleConfig = {
        backgroundColor: '#1890ff',
        color: 'white',
        fontSize: '14px',
        padding: '8px 16px',
        margin: '0',
        borderColor: '',
        borderWidth: '',
        borderStyle: 'none',
        width: 'auto',
        height: 'auto'
      };

      // 重新渲染详情面板以更新输入框
      renderDetail();
    }
  }

  function renderDetail() {
    var detail = document.getElementById('cl-detail-panel');
    if (!detail) return;
    if (!gComponents || !gActiveComponent) {
      detail.innerHTML = '<div class="cl-empty">选择一个组件</div>';
      return;
    }

    var comp = null;
    for (var i = 0; i < gComponents.components.length; i++) {
      if (gComponents.components[i].name === gActiveComponent) {
        comp = gComponents.components[i];
        break;
      }
    }

    if (!comp) {
      detail.innerHTML = '<div class="cl-empty">组件未找到</div>';
      return;
    }

    var html = '';

    // 从组件数据中获取全部变体和尺寸
    var allVariants = comp.variants && comp.variants.variant ? comp.variants.variant : [];
    var allSizes = comp.variants && comp.variants.size ? comp.variants.size : [];

    // 如果选中了 variant，只显示该 variant；否则显示全部
    var showVariants = gActiveVariant ? allVariants.filter(function(v) { return v.name === gActiveVariant; }) : allVariants;

    // Variants 变体
    html += '<div class="cl-section">';
    html += '<h3>🎨 变体 Variants (' + showVariants.length + ')</h3>';
    if (showVariants.length === 0) {
      html += '<div style="color:#999;font-size:12px">未找到</div>';
    } else {
      showVariants.forEach(function(v) {
        var isActive = gActiveVariant === v.name;
        html += '<div class="cl-variant-item' + (isActive ? ' active' : '') + '" data-variant="' + v.name + '">';
        html += '<div class="cl-variant-name">' + v.name + '</div>';
        html += '<div class="cl-variant-code">' + v.className + '</div>';
        html += '</div>';
      });
    }
    html += '</div>';

    // Sizes 尺寸 - 显示全部（因为 size 通常不因 variant 变化）
    html += '<div class="cl-section">';
    html += '<h3>📐 尺寸 Sizes (' + allSizes.length + ')</h3>';
    if (allSizes.length === 0) {
      html += '<div style="color:#999;font-size:12px">无尺寸</div>';
    } else {
      allSizes.forEach(function(s) {
        html += '<div class="cl-size-item">';
        html += '<div class="cl-size-name">' + s.name + '</div>';
        html += '<div class="cl-size-code">' + s.className + '</div>';
        html += '</div>';
      });
    }
    html += '</div>';

    // 样式编辑面板 - 仅在选中组件实例时显示
    if (gActiveVariant && gStyleConfig) {
      // 获取当前组件的区域配置
      var regions = componentRegions[comp.type] || componentRegions['default'];
      var currentRegionName = gActiveRegion ? (regions.find(function(r) { return r.id === gActiveRegion; }) || { name: gActiveRegion }).name : '容器';

      html += '<div class="cl-section">';
      html += '<h3>🎛️ 样式编辑 Style</h3>';
      html += '<div style="font-size:12px;color:#666;margin-bottom:8px;padding:8px;background:#f5f5f5;border-radius:6px">';
      html += '<div>组件: ' + (comp.label || comp.name) + '</div>';
      html += '<div>变体: ' + gActiveVariant + '</div>';
      html += '<div>区域: <span style="color:#1890ff;font-weight:500">' + currentRegionName + '</span></div>';
      html += '</div>';
      html += '<div style="display:flex;flex-direction:column;gap:8px">';

      // 背景颜色
      html += '<div style="display:flex;align-items:center;gap:8px">';
      html += '<label style="width:70px;font-size:12px;color:#666">背景色</label>';
      html += '<input type="color" id="cl-style-bg" value="' + normalizeColor(gStyleConfig.backgroundColor) + '" style="width:36px;height:28px;border:1px solid #ddd;border-radius:4px;cursor:pointer;padding:2px">';
      html += '<input type="text" id="cl-style-bg-text" value="' + (gStyleConfig.backgroundColor || '#1890ff') + '" style="flex:1;padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:12px">';
      html += '</div>';

      // 文字颜色
      html += '<div style="display:flex;align-items:center;gap:8px">';
      html += '<label style="width:70px;font-size:12px;color:#666">文字颜色</label>';
      html += '<input type="color" id="cl-style-color" value="' + normalizeColor(gStyleConfig.color) + '" style="width:36px;height:28px;border:1px solid #ddd;border-radius:4px;cursor:pointer;padding:2px">';
      html += '<input type="text" id="cl-style-color-text" value="' + (gStyleConfig.color || 'white') + '" style="flex:1;padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:12px">';
      html += '</div>';

      // 文字大小
      html += '<div style="display:flex;align-items:center;gap:8px">';
      html += '<label style="width:70px;font-size:12px;color:#666">文字大小</label>';
      html += '<input type="range" id="cl-style-fontSize-range" min="10" max="24" value="' + parseInt(gStyleConfig.fontSize || '14') + '" style="flex:1">';
      html += '<input type="text" id="cl-style-fontSize-text" value="' + (gStyleConfig.fontSize || '14px') + '" style="width:60px;padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:12px">';
      html += '</div>';

      // 内边距
      html += '<div style="display:flex;align-items:center;gap:8px">';
      html += '<label style="width:70px;font-size:12px;color:#666">内边距</label>';
      html += '<input type="text" id="cl-style-padding" value="' + (gStyleConfig.padding || '8px 16px') + '" style="flex:1;padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:12px">';
      html += '</div>';

      // 外边距
      html += '<div style="display:flex;align-items:center;gap:8px">';
      html += '<label style="width:70px;font-size:12px;color:#666">外边距</label>';
      html += '<input type="text" id="cl-style-margin" value="' + (gStyleConfig.margin || '0') + '" style="flex:1;padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:12px">';
      html += '</div>';

      // 边框颜色
      html += '<div style="display:flex;align-items:center;gap:8px">';
      html += '<label style="width:70px;font-size:12px;color:#666">边框颜色</label>';
      html += '<input type="color" id="cl-style-borderColor" value="' + normalizeColor(gStyleConfig.borderColor) + '" style="width:36px;height:28px;border:1px solid #ddd;border-radius:4px;cursor:pointer;padding:2px">';
      html += '<input type="text" id="cl-style-borderColor-text" value="' + (gStyleConfig.borderColor || '#d9d9d9') + '" style="flex:1;padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:12px">';
      html += '</div>';

      // 边框粗细
      html += '<div style="display:flex;align-items:center;gap:8px">';
      html += '<label style="width:70px;font-size:12px;color:#666">边框粗细</label>';
      html += '<input type="text" id="cl-style-borderWidth" value="' + (gStyleConfig.borderWidth || '1px') + '" style="flex:1;padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:12px">';
      html += '</div>';

      // 边框样式
      html += '<div style="display:flex;align-items:center;gap:8px">';
      html += '<label style="width:70px;font-size:12px;color:#666">边框样式</label>';
      html += '<select id="cl-style-borderStyle" style="flex:1;padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:12px">';
      html += '<option value="none"' + (gStyleConfig.borderStyle === 'none' ? ' selected' : '') + '>无</option>';
      html += '<option value="solid"' + (gStyleConfig.borderStyle === 'solid' ? ' selected' : '') + '>实线</option>';
      html += '<option value="dashed"' + (gStyleConfig.borderStyle === 'dashed' ? ' selected' : '') + '>虚线</option>';
      html += '<option value="dotted"' + (gStyleConfig.borderStyle === 'dotted' ? ' selected' : '') + '>点线</option>';
      html += '</select>';
      html += '</div>';

      // 宽度
      html += '<div style="display:flex;align-items:center;gap:8px">';
      html += '<label style="width:70px;font-size:12px;color:#666">宽度</label>';
      html += '<input type="text" id="cl-style-width" value="' + (gStyleConfig.width || 'auto') + '" style="flex:1;padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:12px">';
      html += '</div>';

      // 高度
      html += '<div style="display:flex;align-items:center;gap:8px">';
      html += '<label style="width:70px;font-size:12px;color:#666">高度</label>';
      html += '<input type="text" id="cl-style-height" value="' + (gStyleConfig.height || 'auto') + '" style="flex:1;padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:12px">';
      html += '</div>';

      // 透明度
      html += '<div style="display:flex;align-items:center;gap:8px">';
      html += '<label style="width:70px;font-size:12px;color:#666">透明度</label>';
      html += '<input type="range" id="cl-style-opacity-range" min="0" max="100" value="' + Math.round((parseFloat(gStyleConfig.opacity) || 1) * 100) + '" style="flex:1">';
      html += '<input type="text" id="cl-style-opacity-text" value="' + (gStyleConfig.opacity || '1') + '" style="width:60px;padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:12px">';
      html += '</div>';

      // 圆角
      html += '<div style="display:flex;align-items:center;gap:8px">';
      html += '<label style="width:70px;font-size:12px;color:#666">圆角</label>';
      html += '<input type="text" id="cl-style-borderRadius" value="' + (gStyleConfig.borderRadius || '6px') + '" style="flex:1;padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:12px">';
      html += '</div>';

      // 字重
      html += '<div style="display:flex;align-items:center;gap:8px">';
      html += '<label style="width:70px;font-size:12px;color:#666">字重</label>';
      html += '<select id="cl-style-fontWeight" style="flex:1;padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:12px">';
      html += '<option value="400"' + (gStyleConfig.fontWeight === '400' ? ' selected' : '') + '>正常</option>';
      html += '<option value="500"' + (gStyleConfig.fontWeight === '500' ? ' selected' : '') + '>中等</option>';
      html += '<option value="600"' + (gStyleConfig.fontWeight === '600' ? ' selected' : '') + '>偏粗</option>';
      html += '<option value="700"' + (gStyleConfig.fontWeight === '700' ? ' selected' : '') + '>粗体</option>';
      html += '</select>';
      html += '</div>';

      // 对齐
      html += '<div style="display:flex;align-items:center;gap:8px">';
      html += '<label style="width:70px;font-size:12px;color:#666">对齐</label>';
      html += '<select id="cl-style-textAlign" style="flex:1;padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:12px">';
      html += '<option value="left"' + (gStyleConfig.textAlign === 'left' ? ' selected' : '') + '>左对齐</option>';
      html += '<option value="center"' + (gStyleConfig.textAlign === 'center' ? ' selected' : '') + '>居中</option>';
      html += '<option value="right"' + (gStyleConfig.textAlign === 'right' ? ' selected' : '') + '>右对齐</option>';
      html += '</select>';
      html += '</div>';

      // 阴影
      html += '<div style="display:flex;align-items:center;gap:8px">';
      html += '<label style="width:70px;font-size:12px;color:#666">阴影</label>';
      html += '<input type="text" id="cl-style-boxShadow" value="' + (gStyleConfig.boxShadow || 'none') + '" style="flex:1;padding:4px 8px;border:1px solid #ddd;border-radius:4px;font-size:12px" placeholder="0 2px 8px rgba(0,0,0,0.1)">';
      html += '</div>';

      html += '</div>'; // end style inputs

      // 保存按钮
      html += '<div style="margin-top:12px;display:flex;gap:8px">';
      html += '<button id="cl-save-style-btn" style="flex:1;padding:8px 16px;background:#1890ff;color:white;border:none;border-radius:6px;font-size:13px;cursor:pointer;font-weight:500">保存样式</button>';
      html += '<button id="cl-reset-style-btn" style="padding:8px 16px;background:#f4f4f5;color:#666;border:none;border-radius:6px;font-size:13px;cursor:pointer">重置</button>';
      html += '</div>';

      html += '</div>'; // end cl-section
    }

    // References 引用页面
    html += '<div class="cl-section">';
    html += '<h3>📁 引用页面 References</h3>';
    html += '<div id="cl-refs-list">加载中...</div>';
    html += '</div>';

    // 变体替换
    if (comp.variants && comp.variants.variant && comp.variants.variant.length > 1) {
      html += '<div class="cl-section">';
      html += '<h3>🔄 批量替换 Replace All</h3>';
      html += '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">';
      html += '<select id="cl-replace-from" class="cl-replace-select" style="flex:1;min-width:80px">';
      html += '<option value="">从...</option>';
      comp.variants.variant.forEach(function(v) {
        html += '<option value="' + v.name + '">' + v.name + '</option>';
      });
      html += '</select>';
      html += '<span style="color:#999">→</span>';
      html += '<select id="cl-replace-to" class="cl-replace-select" style="flex:1;min-width:80px">';
      html += '<option value="">到...</option>';
      comp.variants.variant.forEach(function(v) {
        html += '<option value="' + v.name + '">' + v.name + '</option>';
      });
      html += '</select>';
      html += '<button id="cl-replace-all-btn" style="padding:6px 12px;background:#1890ff;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px">替换</button>';
      html += '</div>';
      html += '</div>';
    }

    detail.innerHTML = html;

    // 绑定样式编辑事件
    bindStyleEditorEvents();

    // 绑定保存按钮
    var saveBtn = document.getElementById('cl-save-style-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', function() {
        saveCurrentStyle();
      });
    }

    // 绑定重置按钮
    var resetBtn = document.getElementById('cl-reset-style-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        resetStyle();
      });
    }

    // 绑定 variant 点击
    detail.querySelectorAll('.cl-variant-item[data-variant]').forEach(function(item) {
      item.addEventListener('click', function() {
        gActiveVariant = item.dataset.variant;
        renderDetail();
        renderPreview();
      });
    });

    // 绑定批量替换按钮
    var replaceAllBtn = document.getElementById('cl-replace-all-btn');
    if (replaceAllBtn) {
      replaceAllBtn.addEventListener('click', function() {
        var fromSelect = document.getElementById('cl-replace-from');
        var toSelect = document.getElementById('cl-replace-to');
        var fromVariant = fromSelect ? fromSelect.value : '';
        var toVariant = toSelect ? toSelect.value : '';

        if (!fromVariant || !toVariant) {
          alert('请选择源变体和目标变体');
          return;
        }

        if (fromVariant === toVariant) {
          alert('源变体和目标变体不能相同');
          return;
        }

        if (confirm('确定要将所有 \"' + fromVariant + '\" 替换为 \"' + toVariant + '\" 吗？')) {
          replaceVariant(gActiveComponent, fromVariant, toVariant).then(function(result) {
            if (result.success) {
              alert('已替换 ' + result.results.length + ' 处');
              refreshData();
            }
          });
        }
      });
    }

    // 异步加载引用
    loadReferences(gActiveComponent).then(function(refs) {
      var refsList = document.getElementById('cl-refs-list');
      if (!refsList) return;

      if (!refs || refs.length === 0) {
        refsList.innerHTML = '<div style="color:#999;font-size:12px">暂无引用</div>';
        return;
      }

      // 如果有选中的 variant，过滤只显示使用该 variant 的页面
      var filteredRefs = refs;
      if (gActiveVariant) {
        // 去掉 size 部分，只保留 variant 名称
        var variantOnly = gActiveVariant.split('-')[0];
        filteredRefs = refs.filter(function(ref) {
          return ref.usages && ref.usages.some(function(u) {
            return u.content && (u.content.includes('variant="' + gActiveVariant + '"') || u.content.includes('variant="' + variantOnly + '"'));
          });
        });
      }

      var refsHtml = '';
      for (var idx = 0; idx < filteredRefs.length; idx++) {
        var refFile = filteredRefs[idx].file;
        refsHtml += '<div class="cl-ref-item" style="cursor:pointer" data-file="' + refFile + '">';
        refsHtml += '<span class="cl-ref-file" style="cursor:pointer;color:#1890ff">' + refFile + '</span>';

        // 显示使用的 variant
        if (filteredRefs[idx].usages && filteredRefs[idx].usages.length > 0) {
          var variantCounts = {};
          filteredRefs[idx].usages.forEach(function(u) {
            var match = u.content.match(/variant="([^"]+)"/);
            if (match) {
              variantCounts[match[1]] = (variantCounts[match[1]] || 0) + 1;
            }
          });
          var variantInfo = Object.keys(variantCounts).map(function(v) {
            return v + '(' + variantCounts[v] + ')';
          }).join(', ');
          if (variantInfo) {
            refsHtml += '<span style="font-size:11px;color:#999;margin-left:8px">' + variantInfo + '</span>';
          }
        }

        refsHtml += '<select class="cl-replace-select">';
        refsHtml += '<option value="">替换...</option>';

        if (comp.variants && comp.variants.variant) {
          comp.variants.variant.forEach(function(v) {
            refsHtml += '<option value="' + v.name + '">' + v.name + '</option>';
          });
        }

        refsHtml += '</select></div>';
      }
      refsList.innerHTML = refsHtml || '<div style="color:#999;font-size:12px">暂无引用</div>';

      // 绑定引用页面点击跳转
      refsList.querySelectorAll('.cl-ref-item[data-file]').forEach(function(item) {
        item.addEventListener('click', function(e) {
          // 不触发 select 的 change
          if (e.target.tagName === 'SELECT') return;
          var file = item.dataset.file;
          if (file) {
            // 转换文件路径为组件名（从 src/app/components/xxx.tsx 提取 xxx）
            var componentName = file.replace(/^.*components[\\\/]/, '').replace(/\.tsx$/, '');
            console.log('[Component-Lib] 跳转页面:', componentName);
            // 通过自定义事件通知 App 切换页面（不刷新，不关闭弹窗）
            var event = new CustomEvent('switch-page', { detail: { component: componentName } });
            window.dispatchEvent(event);
          }
        });
      });

      // 绑定替换事件
      refsList.querySelectorAll('.cl-replace-select').forEach(function(sel) {
        sel.addEventListener('change', function(e) {
          var newVariant = e.target.value;
          if (!newVariant) return;

          replaceVariant(gActiveComponent, gActiveVariant || 'default', newVariant).then(function(result) {
            if (result.success) {
              alert('已替换 ' + result.results.length + ' 处');
              refreshData();
            }
          });
        });
      });
    });
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    loadStyles();

    var btn = createButton();
    var panel = createPanel();
    var overlay = createOverlay();

    document.body.appendChild(btn);
    document.body.appendChild(panel);
    document.body.appendChild(overlay);

    // ESC 快捷键退出选择模式
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        if (gSelectorMode) {
          toggleElementSelector(false);
        } else if (gSelectorPanel) {
          closeSelectorPanel();
        } else {
          // 关闭组件面板
          panel.classList.remove('open');
          overlay.classList.remove('open');
        }
      }
    });

    // 监听 iframe 消息（保留用于 iframe 模式）
    window.addEventListener('message', function(event) {
      if (event.data && event.data.type === 'variant-click') {
        if (gActiveVariant === event.data.variant) {
          gActiveVariant = null;
        } else {
          gActiveVariant = event.data.variant;
        }
        renderDetail();
        renderPreview();
      }
    });

    document.getElementById('cl-close-btn').addEventListener('click', function() {
      panel.classList.remove('open');
      overlay.classList.remove('open');
    });

    overlay.addEventListener('click', function() {
      panel.classList.remove('open');
      overlay.classList.remove('open');
    });

    var refreshBtn = document.getElementById('cl-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', refreshData);
    }
  }

  init();
})();