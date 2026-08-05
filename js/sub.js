// ===== 子页面通用脚本 =====

// 表单提交（本地演示）：显示成功提示
function handleDeclarationSubmit(event) {
    event.preventDefault();
    var box = document.getElementById('successBox');
    if (box) {
        box.classList.add('show');
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return false;
}

// 重置表单并隐藏成功提示
function resetDeclaration() {
    var form = document.getElementById('declareForm');
    if (form) form.reset();
    var box = document.getElementById('successBox');
    if (box) box.classList.remove('show');
}
