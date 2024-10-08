//library.js

var a = 10;
var b = 20;

var c = 30;

// export default a; 
export {a, b};

export default c; // 하나만 쓸 때 // import 하는 곳에서 이름 재정의 가능