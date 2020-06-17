(function ($) {
  var name = "moduleA";
  function method1() {
    console.log("method1");
    $("body").animate({ margin: "200px" });
  }
  function method2() {
    console.log("method2");
  }

  // 挂在window全局对象，导出
  window.moduleA = {
    name: name,
    method1: method1,
    method2: method2,
  };
})(jQuery);
