import "./editor.css";

export default () => {
  const editorElement = document.createElement("div");

  editorElement.contentEditable = true;
  editorElement.className = "editor";
  editorElement.id = "editor12";

  console.log("editor init completed~~~~~");

  return editorElement;
};
