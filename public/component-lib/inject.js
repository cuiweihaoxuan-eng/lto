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

  function createButton() {
    var btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.innerHTML = '组件库';
    return btn;
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
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px">';

    // 获取组件实际的变体和尺寸数据
    var actualVariants = (comp.variants && comp.variants.variant) ? comp.variants.variant : [];
    var actualSizes = (comp.variants && comp.variants.size) ? comp.variants.size : [];

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

    // 根据组件类型渲染不同的预览样式
    if (comp.type === 'button') {
      // Button 组件 - 渲染按钮样式
      html += '<div style="padding:12px;background:#fafafa;border-radius:8px;grid-column:span 3">';
      html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
      html += '<div style="display:flex;flex-wrap:wrap;gap:8px">';

      var btnVariants = [
        { name: 'default', bg: '#1890ff', color: 'white' },
        { name: 'destructive', bg: '#d4183d', color: 'white' },
        { name: 'outline', bg: 'white', color: '#333', border: '1px solid #d9d9d9' },
        { name: 'secondary', bg: '#f4f4f5', color: '#666' },
        { name: 'ghost', bg: 'transparent', color: '#333' },
        { name: 'link', bg: 'transparent', color: '#1890ff', textDecoration: 'underline' },
        { name: 'warning', bg: '#f59e0b', color: 'white' },
        { name: 'success', bg: '#10b981', color: 'white' },
        { name: 'cyan', bg: '#0891b2', color: 'white' }
      ];

      btnVariants.forEach(function(v) {
        var isActive = gActiveVariant === v.name;
        var activeStyle = isActive ? 'box-shadow:0 0 0 2px #667eea;' : '';
        html += '<button class="cl-preview-btn" data-variant="' + v.name + '" style="padding:8px 16px;border-radius:6px;font-size:14px;font-weight:500;cursor:pointer;border:none;background:' + v.bg + ';color:' + v.color + ';' + (v.border ? 'border:' + v.border + ';' : '') + (v.textDecoration ? 'text-decoration:' + v.textDecoration + ';' : '') + activeStyle + '">' + v.name + '</button>';
      });

      html += '</div></div>';

      html += '<div style="padding:12px;background:#fafafa;border-radius:8px">';
      html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">尺寸 Sizes</span>';
      html += '<div style="display:flex;flex-wrap:wrap;gap:8px">';
      html += '<button style="padding:4px 12px;background:#1890ff;color:white;border:none;border-radius:6px;font-size:12px;cursor:pointer">sm</button>';
      html += '<button style="padding:8px 16px;background:#1890ff;color:white;border:none;border-radius:6px;font-size:14px;cursor:pointer">default</button>';
      html += '<button style="padding:12px 24px;background:#1890ff;color:white;border:none;border-radius:6px;font-size:16px;cursor:pointer">lg</button>';
      html += '</div></div>';

    } else if (comp.type === 'badge') {
      // Badge 组件 - 渲染徽章样式
      var badgeVariants = [
        { name: 'default', bg: '#1890ff', color: 'white' },
        { name: 'secondary', bg: '#f4f4f5', color: '#666' },
        { name: 'destructive', bg: '#d4183d', color: 'white' },
        { name: 'outline', bg: 'transparent', color: '#333', border: '1px solid #d9d9d9' }
      ];
      badgeVariants.forEach(function(v) {
        html += '<div style="padding:12px;background:#fafafa;border-radius:8px;text-align:center">';
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
      alertVariants.forEach(function(v) {
        html += '<div style="padding:12px;background:#fafafa;border-radius:8px;grid-column:span 2">';
        html += '<span style="font-size:12px;color:#666;display:block;margin-bottom:8px">' + v.name + '</span>';
        html += '<div style="padding:12px 16px;border-radius:8px;background:' + v.bg + ';color:' + v.color + ';border:' + v.border + ';display:flex;align-items:center;gap:12px">';
        html += '<span>' + v.icon + '</span><span>' + v.name + ' 提示信息</span>';
        html += '</div></div>';
      });

    } else {
      // 其他组件 - 渲染变体按钮
      if (actualVariants.length > 0) {
        html += '<div style="padding:12px;background:#fafafa;border-radius:8px;grid-column:span 2">';
        html += '<span style="font-size:12px;color:#666;font-weight:500;margin-bottom:8px;display:block">变体 Variants</span>';
        html += '<div style="display:flex;flex-wrap:wrap;gap:8px">';

        actualVariants.forEach(function(v) {
          var bg = defaultBg;
          var color = defaultColor;
          var border = hasBorder ? '1px solid #d9d9d9' : '';

          if (v.className) {
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
          html += '<button class="cl-preview-btn" data-variant="' + v.name + '" style="padding:8px 16px;border-radius:6px;font-size:14px;font-weight:500;cursor:pointer;border:none;background:' + bg + ';color:' + color + ';' + (border ? 'border:' + border + ';' : '') + activeStyle + '">' + v.name + '</button>';
        });

        html += '</div></div>';
      }
    }

    // 渲染尺寸（如果组件有尺寸数据）
    if (actualSizes.length > 0 && comp.type === 'button') {
      // Button 的尺寸已经渲染过了，跳过
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

    // 绑定按钮点击事件
    previewArea.querySelectorAll('.cl-preview-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var variant = btn.dataset.variant;
        // 如果点击的是已选中的变体，则取消选中；否则选中
        if (gActiveVariant === variant) {
          gActiveVariant = null;
        } else {
          gActiveVariant = variant;
        }
        renderDetail();
        renderPreview();
      });
    });
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
        filteredRefs = refs.filter(function(ref) {
          return ref.usages && ref.usages.some(function(u) {
            return u.content && u.content.includes('variant="' + gActiveVariant + '"');
          });
        });
      }

      var refsHtml = '';
      for (var idx = 0; idx < filteredRefs.length; idx++) {
        refsHtml += '<div class="cl-ref-item">';
        refsHtml += '<span class="cl-ref-file">' + filteredRefs[idx].file + '</span>';

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

    btn.addEventListener('click', function() {
      panel.classList.add('open');
      overlay.classList.add('open');

      loadComponents().then(function(data) {
        gComponents = data;
        gActiveComponent = null;
        gActiveVariant = null;
        renderComponentList();
        document.getElementById('cl-detail-panel').innerHTML = '<div class="cl-empty">选择一个组件</div>';
      });
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