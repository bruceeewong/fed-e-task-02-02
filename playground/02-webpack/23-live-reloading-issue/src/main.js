import createEditor from "./editor";
import background from "./better.png";
import "./global.css";

const editor = createEditor();
document.body.appendChild(editor);

const img = new Image();
img.src = background;
document.body.appendChild(img);

if (module.hot) {
  module.hot.accept("./editor", () => {
    console.log("editor 模块更新了, 需要手动处理热替换逻辑");
    // -------------------
    // 热替换逻辑
    // 保存原有editor的值, 移除原有的editor, 创建新的editor并赋值, 最后挂在上dom
    const val = editor.innerHTML;
    const newEditor = createEditor();
    newEditor.innerHTML = val;
    document.body.removeChild(editor);
    document.body.appendChild(newEditor);
  });
}

// if (module.hot) {
//   let hotEditor = editor
//   module.hot.accept('./editor.js', () => {
//     const value = hotEditor.innerHTML
//     document.body.removeChild(hotEditor)
//     hotEditor = createEditor()
//     hotEditor.innerHTML = value
//     document.body.appendChild(hotEditor)
//   })
// }

// if (module.hot) {
//   module.hot.accept('./better.png', () => {
//     img.src = background
//     console.log(1)
//   })
// }
