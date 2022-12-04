var d, k;
var l;
l || (l = typeof Module !== 'undefined' ? Module : {});
if ("undefined" !== typeof self || "undefined" !== typeof window) {
  l.print = function(a) {
    self.postMessage(JSON.stringify({command:"stdout", contents:a}));
  }, l.printErr = function(a) {
    self.postMessage(JSON.stringify({command:"stderr", contents:a}));
  };
}
l.thisProgram = "pdflatex";
l.arguments = [];
l.noInitialRun = !0;
l.preInit = function() {
  l.FS_root = function() {
    return q.root.Ha;
  };
};
function aa(a, b, c, e, f, g) {
  var h = new XMLHttpRequest;
  h.open("GET", c, !1);
  h.responseType = "text";
  h.onload = function() {
    var c = this.response.split("\n"), h;
    for (h in c) {
      var p = c[h].lastIndexOf("/");
      var r = c[h].slice(p + 1);
      p = c[h].slice(0, p);
      "." === r ? q.Fc("/", b + p, f, g) : 0 < r.length && q.Ec(b + p, r, e + p + "/" + r, f, g);
    }
    self.postMessage(JSON.stringify({command:"result", result:0, msg_id:a}));
  };
  h.send();
}
function ba() {
  if ("egd-pool" in q.root.Ha.dev.Ha) {
    var a = 0, b = new Uint8Array(q.root.Ha.dev.Ha["egd-pool"].Ha);
    q.cb("/dev", "urandom", function() {
      a++;
      if (a >= b.length) {
        throw l.print("Out of entropy!"), Error("Out of entropy");
      }
      return b[a - 1];
    });
    q.cb("/dev", "random", function() {
      a++;
      if (a >= b.length) {
        throw l.print("Out of entropy!"), Error("Out of entropy");
      }
      return b[a - 1];
    });
  }
}
self.onmessage = function(a) {
  var b = JSON.parse(a.data), c = b.arguments;
  c = [].concat(c);
  a = void 0;
  switch(b.command) {
    case "run":
      l.arguments.splice(0, l.arguments.length);
      Array.prototype.push.apply(l.arguments, c);
      ea = !0;
      q.Ob("/", "pdflatex", "Dummy file for kpathsea.", !0, !0, !0);
      ba();
      l.postRun = function() {
        self.postMessage(JSON.stringify({msg_id:b.msg_id, command:"success", result:null}));
      };
      try {
        a = l.run();
      } catch (f) {
        self.postMessage(JSON.stringify({msg_id:b.msg_id, command:"error", message:f.toString()}));
        return;
      }
      a = void 0;
      break;
    case "FS_createLazyFilesFromList":
      c.unshift(b.msg_id);
      a = aa.apply(this, c);
      break;
    case "FS_createDataFile":
      q.Ob.apply(q, c);
      a = !0;
      break;
    case "FS_createLazyFile":
      q.Ec.apply(q, c);
      a = !0;
      break;
    case "FS_createFolder":
      q.md.apply(q, c);
      a = !0;
      break;
    case "FS_createPath":
      q.Fc.apply(q, c);
      a = !0;
      break;
    case "FS_unlink":
      q.unlink.apply(q, c);
      a = !0;
      break;
    case "FS_readFile":
      c = q.readFile.apply(q, c);
      a = "";
      var e;
      for (e = 0; e < c.length / 8192; e++) {
        a += String.fromCharCode.apply(null, c.subarray(8192 * e, 8192 * (e + 1)));
      }
      a += String.fromCharCode.apply(null, c.subarray(8192 * e));
      break;
    case "set_TOTAL_MEMORY":
      l.$c = c[0], a = l.$c;
  }
  "undefined" !== typeof a && self.postMessage(JSON.stringify({command:"result", result:a, msg_id:b.msg_id}));
};
var fa = {}, t;
for (t in l) {
  l.hasOwnProperty(t) && (fa[t] = l[t]);
}
var ha = [], ia = "./this.program";
function ja(a, b) {
  throw b;
}
var u = !1, v = !1, w = !1, ka = !1, ma = !1;
u = "object" === typeof window;
v = "function" === typeof importScripts;
w = (ka = "object" === typeof process && "object" === typeof process.versions && "string" === typeof process.versions.node) && !u && !v;
ma = !u && !w && !v;
var y = "", na, oa;
if (w) {
  y = __dirname + "/";
  var pa, qa;
  na = function(a, b) {
    var c = ra(a);
    c || (pa || (pa = require("fs")), qa || (qa = require("path")), a = qa.normalize(a), c = pa.readFileSync(a));
    return b ? c : c.toString();
  };
  oa = function(a) {
    a = na(a, !0);
    a.buffer || (a = new Uint8Array(a));
    assert(a.buffer);
    return a;
  };
  1 < process.argv.length && (ia = process.argv[1].replace(/\\/g, "/"));
  ha = process.argv.slice(2);
  "undefined" !== typeof module && (module.exports = l);
  process.on("uncaughtException", function(a) {
    if (!(a instanceof sa)) {
      throw a;
    }
  });
  process.on("unhandledRejection", z);
  ja = function(a) {
    process.exit(a);
  };
  l.inspect = function() {
    return "[Emscripten Module object]";
  };
} else {
  if (ma) {
    "undefined" != typeof read && (na = function(a) {
      var b = ra(a);
      return b ? ta(b) : read(a);
    }), oa = function(a) {
      var b;
      if (b = ra(a)) {
        return b;
      }
      if ("function" === typeof readbuffer) {
        return new Uint8Array(readbuffer(a));
      }
      b = read(a, "binary");
      assert("object" === typeof b);
      return b;
    }, "undefined" != typeof scriptArgs ? ha = scriptArgs : "undefined" != typeof arguments && (ha = arguments), "function" === typeof quit && (ja = function(a) {
      quit(a);
    }), "undefined" !== typeof print && ("undefined" === typeof console && (console = {}), console.log = print, console.warn = console.error = "undefined" !== typeof printErr ? printErr : print);
  } else {
    if (u || v) {
      v ? y = self.location.href : document.currentScript && (y = document.currentScript.src), y = 0 !== y.indexOf("blob:") ? y.substr(0, y.lastIndexOf("/") + 1) : "", na = function(a) {
        try {
          var b = new XMLHttpRequest;
          b.open("GET", a, !1);
          b.send(null);
          return b.responseText;
        } catch (c) {
          if (a = ra(a)) {
            return ta(a);
          }
          throw c;
        }
      }, v && (oa = function(a) {
        try {
          var b = new XMLHttpRequest;
          b.open("GET", a, !1);
          b.responseType = "arraybuffer";
          b.send(null);
          return new Uint8Array(b.response);
        } catch (c) {
          if (a = ra(a)) {
            return a;
          }
          throw c;
        }
      });
    }
  }
}
var ua = l.print || console.log.bind(console), A = l.printErr || console.warn.bind(console);
for (t in fa) {
  fa.hasOwnProperty(t) && (l[t] = fa[t]);
}
fa = null;
l.arguments && (ha = l.arguments);
l.thisProgram && (ia = l.thisProgram);
l.quit && (ja = l.quit);
var va = 0, wa;
l.wasmBinary && (wa = l.wasmBinary);
var xa;
l.noExitRuntime && (xa = l.noExitRuntime);
"object" !== typeof WebAssembly && A("no native wasm support detected");
var ya, za = new WebAssembly.Table({initial:722, maximum:722, element:"anyfunc"}), Aa = !1;
function assert(a, b) {
  a || z("Assertion failed: " + b);
}
function Ca(a) {
  if ("number" === typeof a) {
    var b = !0;
    var c = a;
  } else {
    b = !1, c = a.length;
  }
  var e = Da(Math.max(c, 1));
  if (b) {
    a = e;
    assert(0 == (e & 3));
    for (b = e + (c & -4); a < b; a += 4) {
      C[a >> 2] = 0;
    }
    for (b = e + c; a < b;) {
      D[a++ >> 0] = 0;
    }
    return e;
  }
  a.subarray || a.slice ? E.set(a, e) : E.set(new Uint8Array(a), e);
  return e;
}
var Ea = "undefined" !== typeof TextDecoder ? new TextDecoder("utf8") : void 0;
function Fa(a, b, c) {
  var e = b + c;
  for (c = b; a[c] && !(c >= e);) {
    ++c;
  }
  if (16 < c - b && a.subarray && Ea) {
    return Ea.decode(a.subarray(b, c));
  }
  for (e = ""; b < c;) {
    var f = a[b++];
    if (f & 128) {
      var g = a[b++] & 63;
      if (192 == (f & 224)) {
        e += String.fromCharCode((f & 31) << 6 | g);
      } else {
        var h = a[b++] & 63;
        f = 224 == (f & 240) ? (f & 15) << 12 | g << 6 | h : (f & 7) << 18 | g << 12 | h << 6 | a[b++] & 63;
        65536 > f ? e += String.fromCharCode(f) : (f -= 65536, e += String.fromCharCode(55296 | f >> 10, 56320 | f & 1023));
      }
    } else {
      e += String.fromCharCode(f);
    }
  }
  return e;
}
function Ga(a) {
  return a ? Fa(E, a, void 0) : "";
}
function G(a, b, c, e) {
  if (!(0 < e)) {
    return 0;
  }
  var f = c;
  e = c + e - 1;
  for (var g = 0; g < a.length; ++g) {
    var h = a.charCodeAt(g);
    if (55296 <= h && 57343 >= h) {
      var m = a.charCodeAt(++g);
      h = 65536 + ((h & 1023) << 10) | m & 1023;
    }
    if (127 >= h) {
      if (c >= e) {
        break;
      }
      b[c++] = h;
    } else {
      if (2047 >= h) {
        if (c + 1 >= e) {
          break;
        }
        b[c++] = 192 | h >> 6;
      } else {
        if (65535 >= h) {
          if (c + 2 >= e) {
            break;
          }
          b[c++] = 224 | h >> 12;
        } else {
          if (c + 3 >= e) {
            break;
          }
          b[c++] = 240 | h >> 18;
          b[c++] = 128 | h >> 12 & 63;
        }
        b[c++] = 128 | h >> 6 & 63;
      }
      b[c++] = 128 | h & 63;
    }
  }
  b[c] = 0;
  return c - f;
}
function Ha(a) {
  for (var b = 0, c = 0; c < a.length; ++c) {
    var e = a.charCodeAt(c);
    55296 <= e && 57343 >= e && (e = 65536 + ((e & 1023) << 10) | a.charCodeAt(++c) & 1023);
    127 >= e ? ++b : b = 2047 >= e ? b + 2 : 65535 >= e ? b + 3 : b + 4;
  }
  return b;
}
"undefined" !== typeof TextDecoder && new TextDecoder("utf-16le");
function Ia(a) {
  var b = Ha(a) + 1, c = Ja(b);
  G(a, D, c, b);
  return c;
}
var buffer, D, E, Ka, La, C, Na = l.TOTAL_MEMORY || 134217728;
l.wasmMemory ? ya = l.wasmMemory : ya = new WebAssembly.Memory({initial:Na / 65536, maximum:Na / 65536});
ya && (buffer = ya.buffer);
Na = buffer.byteLength;
var I = buffer;
buffer = I;
l.HEAP8 = D = new Int8Array(I);
l.HEAP16 = Ka = new Int16Array(I);
l.HEAP32 = C = new Int32Array(I);
l.HEAPU8 = E = new Uint8Array(I);
l.HEAPU16 = La = new Uint16Array(I);
l.HEAPU32 = new Uint32Array(I);
l.HEAPF32 = new Float32Array(I);
l.HEAPF64 = new Float64Array(I);
C[248908] = 6238672;
function Oa(a) {
  for (; 0 < a.length;) {
    var b = a.shift();
    if ("function" == typeof b) {
      b();
    } else {
      var c = b.sd;
      "number" === typeof c ? void 0 === b.hc ? l.dynCall_v(c) : l.dynCall_vi(c, b.hc) : c(void 0 === b.hc ? null : b.hc);
    }
  }
}
var Pa = [], Qa = [], Ra = [], Sa = [];
function Ta() {
  var a = l.preRun.shift();
  Pa.unshift(a);
}
var Ua = Math.abs, Va = Math.ceil, Wa = Math.floor, Xa = Math.min, Ya = 0, Za = null, $a = null;
function ab() {
  Ya++;
  l.monitorRunDependencies && l.monitorRunDependencies(Ya);
}
function fb() {
  Ya--;
  l.monitorRunDependencies && l.monitorRunDependencies(Ya);
  if (0 == Ya && (null !== Za && (clearInterval(Za), Za = null), $a)) {
    var a = $a;
    $a = null;
    a();
  }
}
l.preloadedImages = {};
l.preloadedAudios = {};
function z(a) {
  if (l.onAbort) {
    l.onAbort(a);
  }
  ua(a);
  A(a);
  Aa = !0;
  throw new WebAssembly.RuntimeError("abort(" + a + "). Build with -s ASSERTIONS=1 for more info.");
}
var gb = "data:application/octet-stream;base64,";
function hb(a) {
  return String.prototype.startsWith ? a.startsWith(gb) : 0 === a.indexOf(gb);
}
if (!hb(J)) {
  var ib = J;
  J = l.locateFile ? l.locateFile(ib, y) : y + ib;
}
function jb() {
  try {
    if (wa) {
      return new Uint8Array(wa);
    }
    var a = ra(J);
    if (a) {
      return a;
    }
    if (oa) {
      return oa(J);
    }
    throw "both async and sync fetching of the wasm failed";
  } catch (b) {
    z(b);
  }
}
function kb() {
  return wa || !u && !v || "function" !== typeof fetch ? new Promise(function(a) {
    a(jb());
  }) : fetch(J, {credentials:"same-origin"}).then(function(a) {
    if (!a.ok) {
      throw "failed to load wasm binary file at '" + J + "'";
    }
    return a.arrayBuffer();
  }).catch(function() {
    return jb();
  });
}
var K, L;
Qa.push({sd:function() {
  lb();
}});
function mb(a) {
  return a.replace(/\b_Z[\w\d_]+/g, function(a) {
    return a === a ? a : a + " [" + a + "]";
  });
}
function nb(a, b) {
  for (var c = 0, e = a.length - 1; 0 <= e; e--) {
    var f = a[e];
    "." === f ? a.splice(e, 1) : ".." === f ? (a.splice(e, 1), c++) : c && (a.splice(e, 1), c--);
  }
  if (b) {
    for (; c; c--) {
      a.unshift("..");
    }
  }
  return a;
}
function ob(a) {
  var b = "/" === a.charAt(0), c = "/" === a.substr(-1);
  (a = nb(a.split("/").filter(function(a) {
    return !!a;
  }), !b).join("/")) || b || (a = ".");
  a && c && (a += "/");
  return (b ? "/" : "") + a;
}
function pb(a) {
  var b = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);
  a = b[0];
  b = b[1];
  if (!a && !b) {
    return ".";
  }
  b && (b = b.substr(0, b.length - 1));
  return a + b;
}
function M(a) {
  if ("/" === a) {
    return "/";
  }
  var b = a.lastIndexOf("/");
  return -1 === b ? a : a.substr(b + 1);
}
function qb() {
  var a = Array.prototype.slice.call(arguments, 0);
  return ob(a.join("/"));
}
function N(a, b) {
  return ob(a + "/" + b);
}
function O(a) {
  l.___errno_location && (C[l.___errno_location() >> 2] = a);
  return a;
}
function P() {
  for (var a = "", b = !1, c = arguments.length - 1; -1 <= c && !b; c--) {
    b = 0 <= c ? arguments[c] : q.cwd();
    if ("string" !== typeof b) {
      throw new TypeError("Arguments to path.resolve must be strings");
    }
    if (!b) {
      return "";
    }
    a = b + "/" + a;
    b = "/" === b.charAt(0);
  }
  a = nb(a.split("/").filter(function(a) {
    return !!a;
  }), !b).join("/");
  return (b ? "/" : "") + a || ".";
}
function rb(a, b) {
  function c(a) {
    for (var b = 0; b < a.length && "" === a[b]; b++) {
    }
    for (var c = a.length - 1; 0 <= c && "" === a[c]; c--) {
    }
    return b > c ? [] : a.slice(b, c - b + 1);
  }
  a = P(a).substr(1);
  b = P(b).substr(1);
  a = c(a.split("/"));
  b = c(b.split("/"));
  for (var e = Math.min(a.length, b.length), f = e, g = 0; g < e; g++) {
    if (a[g] !== b[g]) {
      f = g;
      break;
    }
  }
  e = [];
  for (g = f; g < a.length; g++) {
    e.push("..");
  }
  e = e.concat(b.slice(f));
  return e.join("/");
}
var sb = [];
function tb(a, b) {
  sb[a] = {input:[], output:[], vb:b};
  q.xc(a, ub);
}
var ub = {open:function(a) {
  var b = sb[a.node.rdev];
  if (!b) {
    throw new q.Ga(43);
  }
  a.tty = b;
  a.seekable = !1;
}, close:function(a) {
  a.tty.vb.flush(a.tty);
}, flush:function(a) {
  a.tty.vb.flush(a.tty);
}, read:function(a, b, c, e) {
  if (!a.tty || !a.tty.vb.Nc) {
    throw new q.Ga(60);
  }
  for (var f = 0, g = 0; g < e; g++) {
    try {
      var h = a.tty.vb.Nc(a.tty);
    } catch (m) {
      throw new q.Ga(29);
    }
    if (void 0 === h && 0 === f) {
      throw new q.Ga(6);
    }
    if (null === h || void 0 === h) {
      break;
    }
    f++;
    b[c + g] = h;
  }
  f && (a.node.timestamp = Date.now());
  return f;
}, write:function(a, b, c, e) {
  if (!a.tty || !a.tty.vb.tc) {
    throw new q.Ga(60);
  }
  try {
    for (var f = 0; f < e; f++) {
      a.tty.vb.tc(a.tty, b[c + f]);
    }
  } catch (g) {
    throw new q.Ga(29);
  }
  e && (a.node.timestamp = Date.now());
  return f;
}}, wb = {Nc:function(a) {
  if (!a.input.length) {
    var b = null;
    if (w) {
      var c = Buffer.cc ? Buffer.cc(256) : new Buffer(256), e = 0;
      try {
        e = pa.readSync(process.stdin.fd, c, 0, 256, null);
      } catch (f) {
        if (-1 != f.toString().indexOf("EOF")) {
          e = 0;
        } else {
          throw f;
        }
      }
      0 < e ? b = c.slice(0, e).toString("utf-8") : b = null;
    } else {
      "undefined" != typeof window && "function" == typeof window.prompt ? (b = window.prompt("Input: "), null !== b && (b += "\n")) : "function" == typeof readline && (b = readline(), null !== b && (b += "\n"));
    }
    if (!b) {
      return null;
    }
    a.input = vb(b, !0);
  }
  return a.input.shift();
}, tc:function(a, b) {
  null === b || 10 === b ? (ua(Fa(a.output, 0)), a.output = []) : 0 != b && a.output.push(b);
}, flush:function(a) {
  a.output && 0 < a.output.length && (ua(Fa(a.output, 0)), a.output = []);
}}, xb = {tc:function(a, b) {
  null === b || 10 === b ? (A(Fa(a.output, 0)), a.output = []) : 0 != b && a.output.push(b);
}, flush:function(a) {
  a.output && 0 < a.output.length && (A(Fa(a.output, 0)), a.output = []);
}}, Q = {jb:null, Na:function() {
  return Q.createNode(null, "/", 16895, 0);
}, createNode:function(a, b, c, e) {
  if (q.wd(c) || q.isFIFO(c)) {
    throw new q.Ga(63);
  }
  Q.jb || (Q.jb = {dir:{node:{fb:Q.Ja.fb, Ta:Q.Ja.Ta, lookup:Q.Ja.lookup, kb:Q.Ja.kb, rename:Q.Ja.rename, unlink:Q.Ja.unlink, rmdir:Q.Ja.rmdir, readdir:Q.Ja.readdir, symlink:Q.Ja.symlink}, stream:{Ya:Q.Ia.Ya}}, file:{node:{fb:Q.Ja.fb, Ta:Q.Ja.Ta}, stream:{Ya:Q.Ia.Ya, read:Q.Ia.read, write:Q.Ia.write, Ab:Q.Ia.Ab, Fb:Q.Ia.Fb, Ib:Q.Ia.Ib}}, link:{node:{fb:Q.Ja.fb, Ta:Q.Ja.Ta, readlink:Q.Ja.readlink}, stream:{}}, Dc:{node:{fb:Q.Ja.fb, Ta:Q.Ja.Ta}, stream:q.gd}});
  c = q.createNode(a, b, c, e);
  q.Qa(c.mode) ? (c.Ja = Q.jb.dir.node, c.Ia = Q.jb.dir.stream, c.Ha = {}) : q.isFile(c.mode) ? (c.Ja = Q.jb.file.node, c.Ia = Q.jb.file.stream, c.La = 0, c.Ha = null) : q.ub(c.mode) ? (c.Ja = Q.jb.link.node, c.Ia = Q.jb.link.stream) : q.Cb(c.mode) && (c.Ja = Q.jb.Dc.node, c.Ia = Q.jb.Dc.stream);
  c.timestamp = Date.now();
  a && (a.Ha[b] = c);
  return c;
}, Yd:function(a) {
  if (a.Ha && a.Ha.subarray) {
    for (var b = [], c = 0; c < a.La; ++c) {
      b.push(a.Ha[c]);
    }
    return b;
  }
  return a.Ha;
}, Zd:function(a) {
  return a.Ha ? a.Ha.subarray ? a.Ha.subarray(0, a.La) : new Uint8Array(a.Ha) : new Uint8Array;
}, Jc:function(a, b) {
  var c = a.Ha ? a.Ha.length : 0;
  c >= b || (b = Math.max(b, c * (1048576 > c ? 2 : 1.125) | 0), 0 != c && (b = Math.max(b, 256)), c = a.Ha, a.Ha = new Uint8Array(b), 0 < a.La && a.Ha.set(c.subarray(0, a.La), 0));
}, Gd:function(a, b) {
  if (a.La != b) {
    if (0 == b) {
      a.Ha = null, a.La = 0;
    } else {
      if (!a.Ha || a.Ha.subarray) {
        var c = a.Ha;
        a.Ha = new Uint8Array(new ArrayBuffer(b));
        c && a.Ha.set(c.subarray(0, Math.min(b, a.La)));
      } else {
        if (a.Ha || (a.Ha = []), a.Ha.length > b) {
          a.Ha.length = b;
        } else {
          for (; a.Ha.length < b;) {
            a.Ha.push(0);
          }
        }
      }
      a.La = b;
    }
  }
}, Ja:{fb:function(a) {
  var b = {};
  b.dev = q.Cb(a.mode) ? a.id : 1;
  b.ino = a.id;
  b.mode = a.mode;
  b.nlink = 1;
  b.uid = 0;
  b.gid = 0;
  b.rdev = a.rdev;
  q.Qa(a.mode) ? b.size = 4096 : q.isFile(a.mode) ? b.size = a.La : q.ub(a.mode) ? b.size = a.link.length : b.size = 0;
  b.atime = new Date(a.timestamp);
  b.mtime = new Date(a.timestamp);
  b.ctime = new Date(a.timestamp);
  b.dd = 4096;
  b.blocks = Math.ceil(b.size / b.dd);
  return b;
}, Ta:function(a, b) {
  void 0 !== b.mode && (a.mode = b.mode);
  void 0 !== b.timestamp && (a.timestamp = b.timestamp);
  void 0 !== b.size && Q.Gd(a, b.size);
}, lookup:function() {
  throw q.kc[44];
}, kb:function(a, b, c, e) {
  return Q.createNode(a, b, c, e);
}, rename:function(a, b, c) {
  if (q.Qa(a.mode)) {
    try {
      var e = q.gb(b, c);
    } catch (g) {
    }
    if (e) {
      for (var f in e.Ha) {
        throw new q.Ga(55);
      }
    }
  }
  delete a.parent.Ha[a.name];
  a.name = c;
  b.Ha[c] = a;
  a.parent = b;
}, unlink:function(a, b) {
  delete a.Ha[b];
}, rmdir:function(a, b) {
  var c = q.gb(a, b), e;
  for (e in c.Ha) {
    throw new q.Ga(55);
  }
  delete a.Ha[b];
}, readdir:function(a) {
  var b = [".", ".."], c;
  for (c in a.Ha) {
    a.Ha.hasOwnProperty(c) && b.push(c);
  }
  return b;
}, symlink:function(a, b, c) {
  a = Q.createNode(a, b, 41471, 0);
  a.link = c;
  return a;
}, readlink:function(a) {
  if (!q.ub(a.mode)) {
    throw new q.Ga(28);
  }
  return a.link;
}}, Ia:{read:function(a, b, c, e, f) {
  var g = a.node.Ha;
  if (f >= a.node.La) {
    return 0;
  }
  a = Math.min(a.node.La - f, e);
  if (8 < a && g.subarray) {
    b.set(g.subarray(f, f + a), c);
  } else {
    for (e = 0; e < a; e++) {
      b[c + e] = g[f + e];
    }
  }
  return a;
}, write:function(a, b, c, e, f, g) {
  if (!e) {
    return 0;
  }
  a = a.node;
  a.timestamp = Date.now();
  if (b.subarray && (!a.Ha || a.Ha.subarray)) {
    if (g) {
      return a.Ha = b.subarray(c, c + e), a.La = e;
    }
    if (0 === a.La && 0 === f) {
      return a.Ha = new Uint8Array(b.subarray(c, c + e)), a.La = e;
    }
    if (f + e <= a.La) {
      return a.Ha.set(b.subarray(c, c + e), f), e;
    }
  }
  Q.Jc(a, f + e);
  if (a.Ha.subarray && b.subarray) {
    a.Ha.set(b.subarray(c, c + e), f);
  } else {
    for (g = 0; g < e; g++) {
      a.Ha[f + g] = b[c + g];
    }
  }
  a.La = Math.max(a.La, f + e);
  return e;
}, Ya:function(a, b, c) {
  1 === c ? b += a.position : 2 === c && q.isFile(a.node.mode) && (b += a.node.La);
  if (0 > b) {
    throw new q.Ga(28);
  }
  return b;
}, Ab:function(a, b, c) {
  Q.Jc(a.node, b + c);
  a.node.La = Math.max(a.node.La, b + c);
}, Fb:function(a, b, c, e, f, g, h) {
  if (!q.isFile(a.node.mode)) {
    throw new q.Ga(43);
  }
  c = a.node.Ha;
  if (h & 2 || c.buffer !== b && c.buffer !== b.buffer) {
    if (0 < f || f + e < a.node.La) {
      c.subarray ? c = c.subarray(f, f + e) : c = Array.prototype.slice.call(c, f, f + e);
    }
    a = !0;
    f = b.buffer == D.buffer;
    e = Da(e);
    if (!e) {
      throw new q.Ga(48);
    }
    (f ? D : b).set(c, e);
  } else {
    a = !1, e = c.byteOffset;
  }
  return {he:e, Rd:a};
}, Ib:function(a, b, c, e, f) {
  if (!q.isFile(a.node.mode)) {
    throw new q.Ga(43);
  }
  if (f & 2) {
    return 0;
  }
  Q.Ia.write(a, b, 0, e, c, !1);
  return 0;
}}}, q = {root:null, Hb:[], Hc:{}, streams:[], Ad:1, hb:null, Gc:"/", mc:!1, Rc:!0, Sa:{}, Xc:{Uc:{Zc:1, ad:2}}, Ga:null, kc:{}, qd:null, Zb:0, ae:function(a) {
  if (!(a instanceof q.Ga)) {
    a: {
      var b = Error();
      if (!b.stack) {
        try {
          throw Error(0);
        } catch (c) {
          b = c;
        }
        if (!b.stack) {
          b = "(no stack trace available)";
          break a;
        }
      }
      b = b.stack.toString();
    }
    l.extraStackTrace && (b += "\n" + l.extraStackTrace());
    b = mb(b);
    throw a + " : " + b;
  }
  return O(a.Ka);
}, Ma:function(a, b) {
  a = P(q.cwd(), a);
  b = b || {};
  if (!a) {
    return {path:"", node:null};
  }
  var c = {jc:!0, vc:0}, e;
  for (e in c) {
    void 0 === b[e] && (b[e] = c[e]);
  }
  if (8 < b.vc) {
    throw new q.Ga(32);
  }
  a = nb(a.split("/").filter(function(a) {
    return !!a;
  }), !1);
  var f = q.root;
  c = "/";
  for (e = 0; e < a.length; e++) {
    var g = e === a.length - 1;
    if (g && b.parent) {
      break;
    }
    f = q.gb(f, a[e]);
    c = N(c, a[e]);
    q.pb(f) && (!g || g && b.jc) && (f = f.Gb.root);
    if (!g || b.ab) {
      for (g = 0; q.ub(f.mode);) {
        if (f = q.readlink(c), c = P(pb(c), f), f = q.Ma(c, {vc:b.vc}).node, 40 < g++) {
          throw new q.Ga(32);
        }
      }
    }
  }
  return {path:c, node:f};
}, eb:function(a) {
  for (var b;;) {
    if (q.Ub(a)) {
      return a = a.Na.Tc, b ? "/" !== a[a.length - 1] ? a + "/" + b : a + b : a;
    }
    b = b ? a.name + "/" + b : a.name;
    a = a.parent;
  }
}, lc:function(a, b) {
  for (var c = 0, e = 0; e < b.length; e++) {
    c = (c << 5) - c + b.charCodeAt(e) | 0;
  }
  return (a + c >>> 0) % q.hb.length;
}, Pc:function(a) {
  var b = q.lc(a.parent.id, a.name);
  a.rb = q.hb[b];
  q.hb[b] = a;
}, Qc:function(a) {
  var b = q.lc(a.parent.id, a.name);
  if (q.hb[b] === a) {
    q.hb[b] = a.rb;
  } else {
    for (b = q.hb[b]; b;) {
      if (b.rb === a) {
        b.rb = a.rb;
        break;
      }
      b = b.rb;
    }
  }
}, gb:function(a, b) {
  var c = q.yd(a);
  if (c) {
    throw new q.Ga(c, a);
  }
  for (c = q.hb[q.lc(a.id, b)]; c; c = c.rb) {
    var e = c.name;
    if (c.parent.id === a.id && e === b) {
      return c;
    }
  }
  return q.lookup(a, b);
}, createNode:function(a, b, c, e) {
  q.Lb || (q.Lb = function(a, b, c, e) {
    a || (a = this);
    this.parent = a;
    this.Na = a.Na;
    this.Gb = null;
    this.id = q.Ad++;
    this.name = b;
    this.mode = c;
    this.Ja = {};
    this.Ia = {};
    this.rdev = e;
  }, q.Lb.prototype = {}, Object.defineProperties(q.Lb.prototype, {read:{get:function() {
    return 365 === (this.mode & 365);
  }, set:function(a) {
    a ? this.mode |= 365 : this.mode &= -366;
  }}, write:{get:function() {
    return 146 === (this.mode & 146);
  }, set:function(a) {
    a ? this.mode |= 146 : this.mode &= -147;
  }}, xd:{get:function() {
    return q.Qa(this.mode);
  }}, nc:{get:function() {
    return q.Cb(this.mode);
  }}}));
  a = new q.Lb(a, b, c, e);
  q.Pc(a);
  return a;
}, ic:function(a) {
  q.Qc(a);
}, Ub:function(a) {
  return a === a.parent;
}, pb:function(a) {
  return !!a.Gb;
}, isFile:function(a) {
  return 32768 === (a & 61440);
}, Qa:function(a) {
  return 16384 === (a & 61440);
}, ub:function(a) {
  return 40960 === (a & 61440);
}, Cb:function(a) {
  return 8192 === (a & 61440);
}, wd:function(a) {
  return 24576 === (a & 61440);
}, isFIFO:function(a) {
  return 4096 === (a & 61440);
}, isSocket:function(a) {
  return 49152 === (a & 49152);
}, rd:{r:0, rs:1052672, "r+":2, w:577, wx:705, xw:705, "w+":578, "wx+":706, "xw+":706, a:1089, ax:1217, xa:1217, "a+":1090, "ax+":1218, "xa+":1218}, Xb:function(a) {
  var b = q.rd[a];
  if ("undefined" === typeof b) {
    throw Error("Unknown file open mode: " + a);
  }
  return b;
}, Kc:function(a) {
  var b = ["r", "w", "rw"][a & 3];
  a & 512 && (b += "w");
  return b;
}, lb:function(a, b) {
  if (q.Rc) {
    return 0;
  }
  if (-1 === b.indexOf("r") || a.mode & 292) {
    if (-1 !== b.indexOf("w") && !(a.mode & 146) || -1 !== b.indexOf("x") && !(a.mode & 73)) {
      return 2;
    }
  } else {
    return 2;
  }
  return 0;
}, yd:function(a) {
  var b = q.lb(a, "x");
  return b ? b : a.Ja.lookup ? 0 : 2;
}, qc:function(a, b) {
  try {
    return q.gb(a, b), 20;
  } catch (c) {
  }
  return q.lb(a, "wx");
}, Vb:function(a, b, c) {
  try {
    var e = q.gb(a, b);
  } catch (f) {
    return f.Ka;
  }
  if (a = q.lb(a, "wx")) {
    return a;
  }
  if (c) {
    if (!q.Qa(e.mode)) {
      return 54;
    }
    if (q.Ub(e) || q.eb(e) === q.cwd()) {
      return 10;
    }
  } else {
    if (q.Qa(e.mode)) {
      return 31;
    }
  }
  return 0;
}, zd:function(a, b) {
  return a ? q.ub(a.mode) ? 32 : q.Qa(a.mode) && ("r" !== q.Kc(b) || b & 512) ? 31 : q.lb(a, q.Kc(b)) : 44;
}, Yc:4096, Bd:function(a, b) {
  b = b || q.Yc;
  for (a = a || 0; a <= b; a++) {
    if (!q.streams[a]) {
      return a;
    }
  }
  throw new q.Ga(33);
}, tb:function(a) {
  return q.streams[a];
}, Qb:function(a, b, c) {
  q.Mb || (q.Mb = function() {
  }, q.Mb.prototype = {}, Object.defineProperties(q.Mb.prototype, {object:{get:function() {
    return this.node;
  }, set:function(a) {
    this.node = a;
  }}}));
  var e = new q.Mb, f;
  for (f in a) {
    e[f] = a[f];
  }
  a = e;
  b = q.Bd(b, c);
  a.fd = b;
  return q.streams[b] = a;
}, hd:function(a) {
  q.streams[a] = null;
}, gd:{open:function(a) {
  a.Ia = q.td(a.node.rdev).Ia;
  a.Ia.open && a.Ia.open(a);
}, Ya:function() {
  throw new q.Ga(70);
}}, pc:function(a) {
  return a >> 8;
}, de:function(a) {
  return a & 255;
}, qb:function(a, b) {
  return a << 8 | b;
}, xc:function(a, b) {
  q.Hc[a] = {Ia:b};
}, td:function(a) {
  return q.Hc[a];
}, Mc:function(a) {
  var b = [];
  for (a = [a]; a.length;) {
    var c = a.pop();
    b.push(c);
    a.push.apply(a, c.Hb);
  }
  return b;
}, Wc:function(a, b) {
  function c(a) {
    q.Zb--;
    return b(a);
  }
  function e(a) {
    if (a) {
      if (!e.cc) {
        return e.cc = !0, c(a);
      }
    } else {
      ++g >= f.length && c(null);
    }
  }
  "function" === typeof a && (b = a, a = !1);
  q.Zb++;
  1 < q.Zb && console.log("warning: " + q.Zb + " FS.syncfs operations in flight at once, probably just doing extra work");
  var f = q.Mc(q.root.Na), g = 0;
  f.forEach(function(b) {
    if (!b.type.Wc) {
      return e(null);
    }
    b.type.Wc(b, a, e);
  });
}, Na:function(a, b, c) {
  var e = "/" === c, f = !c;
  if (e && q.root) {
    throw new q.Ga(10);
  }
  if (!e && !f) {
    var g = q.Ma(c, {jc:!1});
    c = g.path;
    g = g.node;
    if (q.pb(g)) {
      throw new q.Ga(10);
    }
    if (!q.Qa(g.mode)) {
      throw new q.Ga(54);
    }
  }
  b = {type:a, ge:b, Tc:c, Hb:[]};
  a = a.Na(b);
  a.Na = b;
  b.root = a;
  e ? q.root = a : g && (g.Gb = b, g.Na && g.Na.Hb.push(b));
  return a;
}, le:function(a) {
  a = q.Ma(a, {jc:!1});
  if (!q.pb(a.node)) {
    throw new q.Ga(28);
  }
  a = a.node;
  var b = a.Gb, c = q.Mc(b);
  Object.keys(q.hb).forEach(function(a) {
    for (a = q.hb[a]; a;) {
      var b = a.rb;
      -1 !== c.indexOf(a.Na) && q.ic(a);
      a = b;
    }
  });
  a.Gb = null;
  a.Na.Hb.splice(a.Na.Hb.indexOf(b), 1);
}, lookup:function(a, b) {
  return a.Ja.lookup(a, b);
}, kb:function(a, b, c) {
  var e = q.Ma(a, {parent:!0}).node;
  a = M(a);
  if (!a || "." === a || ".." === a) {
    throw new q.Ga(28);
  }
  var f = q.qc(e, a);
  if (f) {
    throw new q.Ga(f);
  }
  if (!e.Ja.kb) {
    throw new q.Ga(63);
  }
  return e.Ja.kb(e, a, b, c);
}, create:function(a, b) {
  return q.kb(a, (void 0 !== b ? b : 438) & 4095 | 32768, 0);
}, mkdir:function(a, b) {
  return q.kb(a, (void 0 !== b ? b : 511) & 1023 | 16384, 0);
}, ee:function(a, b) {
  a = a.split("/");
  for (var c = "", e = 0; e < a.length; ++e) {
    if (a[e]) {
      c += "/" + a[e];
      try {
        q.mkdir(c, b);
      } catch (f) {
        if (20 != f.Ka) {
          throw f;
        }
      }
    }
  }
}, Wb:function(a, b, c) {
  "undefined" === typeof c && (c = b, b = 438);
  return q.kb(a, b | 8192, c);
}, symlink:function(a, b) {
  if (!P(a)) {
    throw new q.Ga(44);
  }
  var c = q.Ma(b, {parent:!0}).node;
  if (!c) {
    throw new q.Ga(44);
  }
  b = M(b);
  var e = q.qc(c, b);
  if (e) {
    throw new q.Ga(e);
  }
  if (!c.Ja.symlink) {
    throw new q.Ga(63);
  }
  return c.Ja.symlink(c, b, a);
}, rename:function(a, b) {
  var c = pb(a), e = pb(b), f = M(a), g = M(b);
  try {
    var h = q.Ma(a, {parent:!0});
    var m = h.node;
    h = q.Ma(b, {parent:!0});
    var n = h.node;
  } catch (r) {
    throw new q.Ga(10);
  }
  if (!m || !n) {
    throw new q.Ga(44);
  }
  if (m.Na !== n.Na) {
    throw new q.Ga(75);
  }
  h = q.gb(m, f);
  e = rb(a, e);
  if ("." !== e.charAt(0)) {
    throw new q.Ga(28);
  }
  e = rb(b, c);
  if ("." !== e.charAt(0)) {
    throw new q.Ga(55);
  }
  try {
    var p = q.gb(n, g);
  } catch (r) {
  }
  if (h !== p) {
    c = q.Qa(h.mode);
    if (f = q.Vb(m, f, c)) {
      throw new q.Ga(f);
    }
    if (f = p ? q.Vb(n, g, c) : q.qc(n, g)) {
      throw new q.Ga(f);
    }
    if (!m.Ja.rename) {
      throw new q.Ga(63);
    }
    if (q.pb(h) || p && q.pb(p)) {
      throw new q.Ga(10);
    }
    if (n !== m && (f = q.lb(m, "w"))) {
      throw new q.Ga(f);
    }
    try {
      q.Sa.willMovePath && q.Sa.willMovePath(a, b);
    } catch (r) {
      console.log("FS.trackingDelegate['willMovePath']('" + a + "', '" + b + "') threw an exception: " + r.message);
    }
    q.Qc(h);
    try {
      m.Ja.rename(h, n, g);
    } catch (r) {
      throw r;
    } finally {
      q.Pc(h);
    }
    try {
      if (q.Sa.onMovePath) {
        q.Sa.onMovePath(a, b);
      }
    } catch (r) {
      console.log("FS.trackingDelegate['onMovePath']('" + a + "', '" + b + "') threw an exception: " + r.message);
    }
  }
}, rmdir:function(a) {
  var b = q.Ma(a, {parent:!0}).node, c = M(a), e = q.gb(b, c), f = q.Vb(b, c, !0);
  if (f) {
    throw new q.Ga(f);
  }
  if (!b.Ja.rmdir) {
    throw new q.Ga(63);
  }
  if (q.pb(e)) {
    throw new q.Ga(10);
  }
  try {
    q.Sa.willDeletePath && q.Sa.willDeletePath(a);
  } catch (g) {
    console.log("FS.trackingDelegate['willDeletePath']('" + a + "') threw an exception: " + g.message);
  }
  b.Ja.rmdir(b, c);
  q.ic(e);
  try {
    if (q.Sa.onDeletePath) {
      q.Sa.onDeletePath(a);
    }
  } catch (g) {
    console.log("FS.trackingDelegate['onDeletePath']('" + a + "') threw an exception: " + g.message);
  }
}, readdir:function(a) {
  a = q.Ma(a, {ab:!0}).node;
  if (!a.Ja.readdir) {
    throw new q.Ga(54);
  }
  return a.Ja.readdir(a);
}, unlink:function(a) {
  var b = q.Ma(a, {parent:!0}).node, c = M(a), e = q.gb(b, c), f = q.Vb(b, c, !1);
  if (f) {
    throw new q.Ga(f);
  }
  if (!b.Ja.unlink) {
    throw new q.Ga(63);
  }
  if (q.pb(e)) {
    throw new q.Ga(10);
  }
  try {
    q.Sa.willDeletePath && q.Sa.willDeletePath(a);
  } catch (g) {
    console.log("FS.trackingDelegate['willDeletePath']('" + a + "') threw an exception: " + g.message);
  }
  b.Ja.unlink(b, c);
  q.ic(e);
  try {
    if (q.Sa.onDeletePath) {
      q.Sa.onDeletePath(a);
    }
  } catch (g) {
    console.log("FS.trackingDelegate['onDeletePath']('" + a + "') threw an exception: " + g.message);
  }
}, readlink:function(a) {
  a = q.Ma(a).node;
  if (!a) {
    throw new q.Ga(44);
  }
  if (!a.Ja.readlink) {
    throw new q.Ga(28);
  }
  return P(q.eb(a.parent), a.Ja.readlink(a));
}, stat:function(a, b) {
  a = q.Ma(a, {ab:!b}).node;
  if (!a) {
    throw new q.Ga(44);
  }
  if (!a.Ja.fb) {
    throw new q.Ga(63);
  }
  return a.Ja.fb(a);
}, lstat:function(a) {
  return q.stat(a, !0);
}, chmod:function(a, b, c) {
  var e;
  "string" === typeof a ? e = q.Ma(a, {ab:!c}).node : e = a;
  if (!e.Ja.Ta) {
    throw new q.Ga(63);
  }
  e.Ja.Ta(e, {mode:b & 4095 | e.mode & -4096, timestamp:Date.now()});
}, lchmod:function(a, b) {
  q.chmod(a, b, !0);
}, fchmod:function(a, b) {
  a = q.tb(a);
  if (!a) {
    throw new q.Ga(8);
  }
  q.chmod(a.node, b);
}, chown:function(a, b, c, e) {
  var f;
  "string" === typeof a ? f = q.Ma(a, {ab:!e}).node : f = a;
  if (!f.Ja.Ta) {
    throw new q.Ga(63);
  }
  f.Ja.Ta(f, {timestamp:Date.now()});
}, lchown:function(a, b, c) {
  q.chown(a, b, c, !0);
}, fchown:function(a, b, c) {
  a = q.tb(a);
  if (!a) {
    throw new q.Ga(8);
  }
  q.chown(a.node, b, c);
}, truncate:function(a, b) {
  if (0 > b) {
    throw new q.Ga(28);
  }
  var c;
  "string" === typeof a ? c = q.Ma(a, {ab:!0}).node : c = a;
  if (!c.Ja.Ta) {
    throw new q.Ga(63);
  }
  if (q.Qa(c.mode)) {
    throw new q.Ga(31);
  }
  if (!q.isFile(c.mode)) {
    throw new q.Ga(28);
  }
  if (a = q.lb(c, "w")) {
    throw new q.Ga(a);
  }
  c.Ja.Ta(c, {size:b, timestamp:Date.now()});
}, Xd:function(a, b) {
  a = q.tb(a);
  if (!a) {
    throw new q.Ga(8);
  }
  if (0 === (a.flags & 2097155)) {
    throw new q.Ga(28);
  }
  q.truncate(a.node, b);
}, me:function(a, b, c) {
  a = q.Ma(a, {ab:!0}).node;
  a.Ja.Ta(a, {timestamp:Math.max(b, c)});
}, open:function(a, b, c, e, f) {
  if ("" === a) {
    throw new q.Ga(44);
  }
  b = "string" === typeof b ? q.Xb(b) : b;
  c = b & 64 ? ("undefined" === typeof c ? 438 : c) & 4095 | 32768 : 0;
  if ("object" === typeof a) {
    var g = a;
  } else {
    a = ob(a);
    try {
      g = q.Ma(a, {ab:!(b & 131072)}).node;
    } catch (m) {
    }
  }
  var h = !1;
  if (b & 64) {
    if (g) {
      if (b & 128) {
        throw new q.Ga(20);
      }
    } else {
      g = q.kb(a, c, 0), h = !0;
    }
  }
  if (!g) {
    throw new q.Ga(44);
  }
  q.Cb(g.mode) && (b &= -513);
  if (b & 65536 && !q.Qa(g.mode)) {
    throw new q.Ga(54);
  }
  if (!h && (c = q.zd(g, b))) {
    throw new q.Ga(c);
  }
  b & 512 && q.truncate(g, 0);
  b &= -641;
  e = q.Qb({node:g, path:q.eb(g), flags:b, seekable:!0, position:0, Ia:g.Ia, Od:[], error:!1}, e, f);
  e.Ia.open && e.Ia.open(e);
  !l.logReadFiles || b & 1 || (q.uc || (q.uc = {}), a in q.uc || (q.uc[a] = 1, console.log("FS.trackingDelegate error on read file: " + a)));
  try {
    q.Sa.onOpenFile && (f = 0, 1 !== (b & 2097155) && (f |= q.Xc.Uc.Zc), 0 !== (b & 2097155) && (f |= q.Xc.Uc.ad), q.Sa.onOpenFile(a, f));
  } catch (m) {
    console.log("FS.trackingDelegate['onOpenFile']('" + a + "', flags) threw an exception: " + m.message);
  }
  return e;
}, close:function(a) {
  if (q.Db(a)) {
    throw new q.Ga(8);
  }
  a.nb && (a.nb = null);
  try {
    a.Ia.close && a.Ia.close(a);
  } catch (b) {
    throw b;
  } finally {
    q.hd(a.fd);
  }
  a.fd = null;
}, Db:function(a) {
  return null === a.fd;
}, Ya:function(a, b, c) {
  if (q.Db(a)) {
    throw new q.Ga(8);
  }
  if (!a.seekable || !a.Ia.Ya) {
    throw new q.Ga(70);
  }
  if (0 != c && 1 != c && 2 != c) {
    throw new q.Ga(28);
  }
  a.position = a.Ia.Ya(a, b, c);
  a.Od = [];
  return a.position;
}, read:function(a, b, c, e, f) {
  if (0 > e || 0 > f) {
    throw new q.Ga(28);
  }
  if (q.Db(a)) {
    throw new q.Ga(8);
  }
  if (1 === (a.flags & 2097155)) {
    throw new q.Ga(8);
  }
  if (q.Qa(a.node.mode)) {
    throw new q.Ga(31);
  }
  if (!a.Ia.read) {
    throw new q.Ga(28);
  }
  var g = "undefined" !== typeof f;
  if (!g) {
    f = a.position;
  } else {
    if (!a.seekable) {
      throw new q.Ga(70);
    }
  }
  b = a.Ia.read(a, b, c, e, f);
  g || (a.position += b);
  return b;
}, write:function(a, b, c, e, f, g) {
  if (0 > e || 0 > f) {
    throw new q.Ga(28);
  }
  if (q.Db(a)) {
    throw new q.Ga(8);
  }
  if (0 === (a.flags & 2097155)) {
    throw new q.Ga(8);
  }
  if (q.Qa(a.node.mode)) {
    throw new q.Ga(31);
  }
  if (!a.Ia.write) {
    throw new q.Ga(28);
  }
  a.flags & 1024 && q.Ya(a, 0, 2);
  var h = "undefined" !== typeof f;
  if (!h) {
    f = a.position;
  } else {
    if (!a.seekable) {
      throw new q.Ga(70);
    }
  }
  b = a.Ia.write(a, b, c, e, f, g);
  h || (a.position += b);
  try {
    if (a.path && q.Sa.onWriteToFile) {
      q.Sa.onWriteToFile(a.path);
    }
  } catch (m) {
    console.log("FS.trackingDelegate['onWriteToFile']('" + a.path + "') threw an exception: " + m.message);
  }
  return b;
}, Ab:function(a, b, c) {
  if (q.Db(a)) {
    throw new q.Ga(8);
  }
  if (0 > b || 0 >= c) {
    throw new q.Ga(28);
  }
  if (0 === (a.flags & 2097155)) {
    throw new q.Ga(8);
  }
  if (!q.isFile(a.node.mode) && !q.Qa(a.node.mode)) {
    throw new q.Ga(43);
  }
  if (!a.Ia.Ab) {
    throw new q.Ga(138);
  }
  a.Ia.Ab(a, b, c);
}, Fb:function(a, b, c, e, f, g, h) {
  if (0 !== (g & 2) && 0 === (h & 2) && 2 !== (a.flags & 2097155)) {
    throw new q.Ga(2);
  }
  if (1 === (a.flags & 2097155)) {
    throw new q.Ga(2);
  }
  if (!a.Ia.Fb) {
    throw new q.Ga(43);
  }
  return a.Ia.Fb(a, b, c, e, f, g, h);
}, Ib:function(a, b, c, e, f) {
  return a && a.Ia.Ib ? a.Ia.Ib(a, b, c, e, f) : 0;
}, fe:function() {
  return 0;
}, ob:function(a, b, c) {
  if (!a.Ia.ob) {
    throw new q.Ga(59);
  }
  return a.Ia.ob(a, b, c);
}, readFile:function(a, b) {
  b = b || {};
  b.flags = b.flags || "r";
  b.encoding = b.encoding || "binary";
  if ("utf8" !== b.encoding && "binary" !== b.encoding) {
    throw Error('Invalid encoding type "' + b.encoding + '"');
  }
  var c, e = q.open(a, b.flags);
  a = q.stat(a).size;
  var f = new Uint8Array(a);
  q.read(e, f, 0, a, 0);
  "utf8" === b.encoding ? c = Fa(f, 0) : "binary" === b.encoding && (c = f);
  q.close(e);
  return c;
}, writeFile:function(a, b, c) {
  c = c || {};
  c.flags = c.flags || "w";
  a = q.open(a, c.flags, c.mode);
  if ("string" === typeof b) {
    var e = new Uint8Array(Ha(b) + 1);
    b = G(b, e, 0, e.length);
    q.write(a, e, 0, b, void 0, c.ed);
  } else {
    if (ArrayBuffer.isView(b)) {
      q.write(a, b, 0, b.byteLength, void 0, c.ed);
    } else {
      throw Error("Unsupported data type");
    }
  }
  q.close(a);
}, cwd:function() {
  return q.Gc;
}, chdir:function(a) {
  a = q.Ma(a, {ab:!0});
  if (null === a.node) {
    throw new q.Ga(44);
  }
  if (!q.Qa(a.node.mode)) {
    throw new q.Ga(54);
  }
  var b = q.lb(a.node, "x");
  if (b) {
    throw new q.Ga(b);
  }
  q.Gc = a.path;
}, kd:function() {
  q.mkdir("/tmp");
  q.mkdir("/home");
  q.mkdir("/home/web_user");
}, jd:function() {
  q.mkdir("/dev");
  q.xc(q.qb(1, 3), {read:function() {
    return 0;
  }, write:function(a, b, c, h) {
    return h;
  }});
  q.Wb("/dev/null", q.qb(1, 3));
  tb(q.qb(5, 0), wb);
  tb(q.qb(6, 0), xb);
  q.Wb("/dev/tty", q.qb(5, 0));
  q.Wb("/dev/tty1", q.qb(6, 0));
  if ("object" === typeof crypto && "function" === typeof crypto.getRandomValues) {
    var a = new Uint8Array(1);
    var b = function() {
      crypto.getRandomValues(a);
      return a[0];
    };
  } else {
    if (w) {
      try {
        var c = require("crypto");
        b = function() {
          return c.randomBytes(1)[0];
        };
      } catch (e) {
      }
    }
  }
  b || (b = function() {
    z("random_device");
  });
  q.cb("/dev", "random", b);
  q.cb("/dev", "urandom", b);
  q.mkdir("/dev/shm");
  q.mkdir("/dev/shm/tmp");
}, od:function() {
  q.mkdir("/proc");
  q.mkdir("/proc/self");
  q.mkdir("/proc/self/fd");
  q.Na({Na:function() {
    var a = q.createNode("/proc/self", "fd", 16895, 73);
    a.Ja = {lookup:function(a, c) {
      var b = q.tb(+c);
      if (!b) {
        throw new q.Ga(8);
      }
      a = {parent:null, Na:{Tc:"fake"}, Ja:{readlink:function() {
        return b.path;
      }}};
      return a.parent = a;
    }};
    return a;
  }}, {}, "/proc/self/fd");
}, pd:function() {
  l.stdin ? q.cb("/dev", "stdin", l.stdin) : q.symlink("/dev/tty", "/dev/stdin");
  l.stdout ? q.cb("/dev", "stdout", null, l.stdout) : q.symlink("/dev/tty", "/dev/stdout");
  l.stderr ? q.cb("/dev", "stderr", null, l.stderr) : q.symlink("/dev/tty1", "/dev/stderr");
  q.open("/dev/stdin", "r");
  q.open("/dev/stdout", "w");
  q.open("/dev/stderr", "w");
}, Ic:function() {
  q.Ga || (q.Ga = function(a, b) {
    this.node = b;
    this.Id = function(a) {
      this.Ka = a;
    };
    this.Id(a);
    this.message = "FS error";
  }, q.Ga.prototype = Error(), q.Ga.prototype.constructor = q.Ga, [44].forEach(function(a) {
    q.kc[a] = new q.Ga(a);
    q.kc[a].stack = "<generic error, no stack>";
  }));
}, Jd:function() {
  q.Ic();
  q.hb = Array(4096);
  q.Na(Q, {}, "/");
  q.kd();
  q.jd();
  q.od();
  q.qd = {MEMFS:Q};
}, Bb:function(a, b, c) {
  q.Bb.mc = !0;
  q.Ic();
  l.stdin = a || l.stdin;
  l.stdout = b || l.stdout;
  l.stderr = c || l.stderr;
  q.pd();
}, quit:function() {
  q.Bb.mc = !1;
  var a = l._fflush;
  a && a(0);
  for (a = 0; a < q.streams.length; a++) {
    var b = q.streams[a];
    b && q.close(b);
  }
}, Sb:function(a, b) {
  var c = 0;
  a && (c |= 365);
  b && (c |= 146);
  return c;
}, be:function(a, b) {
  a = qb.apply(null, a);
  b && "/" == a[0] && (a = a.substr(1));
  return a;
}, Qd:function(a, b) {
  return P(b, a);
}, je:function(a) {
  return ob(a);
}, Wd:function(a, b) {
  a = q.fc(a, b);
  if (a.exists) {
    return a.object;
  }
  O(a.error);
  return null;
}, fc:function(a, b) {
  try {
    var c = q.Ma(a, {ab:!b});
    a = c.path;
  } catch (f) {
  }
  var e = {Ub:!1, exists:!1, error:0, name:null, path:null, object:null, Cd:!1, Ed:null, Dd:null};
  try {
    c = q.Ma(a, {parent:!0}), e.Cd = !0, e.Ed = c.path, e.Dd = c.node, e.name = M(a), c = q.Ma(a, {ab:!b}), e.exists = !0, e.path = c.path, e.object = c.node, e.name = c.node.name, e.Ub = "/" === c.path;
  } catch (f) {
    e.error = f.Ka;
  }
  return e;
}, md:function(a, b, c, e) {
  a = N("string" === typeof a ? a : q.eb(a), b);
  return q.mkdir(a, q.Sb(c, e));
}, Fc:function(a, b) {
  a = "string" === typeof a ? a : q.eb(a);
  for (b = b.split("/").reverse(); b.length;) {
    var c = b.pop();
    if (c) {
      var e = N(a, c);
      try {
        q.mkdir(e);
      } catch (f) {
      }
      a = e;
    }
  }
  return e;
}, ld:function(a, b, c, e, f) {
  a = N("string" === typeof a ? a : q.eb(a), b);
  return q.create(a, q.Sb(e, f));
}, Ob:function(a, b, c, e, f, g) {
  a = b ? N("string" === typeof a ? a : q.eb(a), b) : a;
  e = q.Sb(e, f);
  f = q.create(a, e);
  if (c) {
    if ("string" === typeof c) {
      a = Array(c.length);
      b = 0;
      for (var h = c.length; b < h; ++b) {
        a[b] = c.charCodeAt(b);
      }
      c = a;
    }
    q.chmod(f, e | 146);
    a = q.open(f, "w");
    q.write(a, c, 0, c.length, 0, g);
    q.close(a);
    q.chmod(f, e);
  }
  return f;
}, cb:function(a, b, c, e) {
  a = N("string" === typeof a ? a : q.eb(a), b);
  b = q.Sb(!!c, !!e);
  q.cb.pc || (q.cb.pc = 64);
  var f = q.qb(q.cb.pc++, 0);
  q.xc(f, {open:function(a) {
    a.seekable = !1;
  }, close:function() {
    e && e.buffer && e.buffer.length && e(10);
  }, read:function(a, b, e, f) {
    for (var g = 0, h = 0; h < f; h++) {
      try {
        var m = c();
      } catch (F) {
        throw new q.Ga(29);
      }
      if (void 0 === m && 0 === g) {
        throw new q.Ga(6);
      }
      if (null === m || void 0 === m) {
        break;
      }
      g++;
      b[e + h] = m;
    }
    g && (a.node.timestamp = Date.now());
    return g;
  }, write:function(a, b, c, f) {
    for (var g = 0; g < f; g++) {
      try {
        e(b[c + g]);
      } catch (r) {
        throw new q.Ga(29);
      }
    }
    f && (a.node.timestamp = Date.now());
    return g;
  }});
  return q.Wb(a, b, f);
}, Ud:function(a, b, c) {
  a = N("string" === typeof a ? a : q.eb(a), b);
  return q.symlink(c, a);
}, Lc:function(a) {
  if (a.nc || a.xd || a.link || a.Ha) {
    return !0;
  }
  var b = !0;
  if ("undefined" !== typeof XMLHttpRequest) {
    throw Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
  }
  if (na) {
    try {
      a.Ha = vb(na(a.url), !0), a.La = a.Ha.length;
    } catch (c) {
      b = !1;
    }
  } else {
    throw Error("Cannot load without read() or XMLHttpRequest.");
  }
  b || O(29);
  return b;
}, Ec:function(a, b, c, e, f) {
  function g() {
    this.oc = !1;
    this.Nb = [];
  }
  g.prototype.get = function(a) {
    if (!(a > this.length - 1 || 0 > a)) {
      var b = a % this.chunkSize;
      return this.Oc(a / this.chunkSize | 0)[b];
    }
  };
  g.prototype.Hd = function(a) {
    this.Oc = a;
  };
  g.prototype.Cc = function() {
    var a = new XMLHttpRequest;
    a.open("HEAD", c, !1);
    a.send(null);
    if (!(200 <= a.status && 300 > a.status || 304 === a.status)) {
      throw Error("Couldn't load " + c + ". Status: " + a.status);
    }
    var b = Number(a.getResponseHeader("Content-length")), e, f = (e = a.getResponseHeader("Accept-Ranges")) && "bytes" === e;
    a = (e = a.getResponseHeader("Content-Encoding")) && "gzip" === e;
    var g = 1048576;
    f || (g = b);
    var h = this;
    h.Hd(function(a) {
      var e = a * g, f = (a + 1) * g - 1;
      f = Math.min(f, b - 1);
      if ("undefined" === typeof h.Nb[a]) {
        var V = h.Nb;
        if (e > f) {
          throw Error("invalid range (" + e + ", " + f + ") or no bytes requested!");
        }
        if (f > b - 1) {
          throw Error("only " + b + " bytes available! programmer error!");
        }
        var m = new XMLHttpRequest;
        m.open("GET", c, !1);
        b !== g && m.setRequestHeader("Range", "bytes=" + e + "-" + f);
        "undefined" != typeof Uint8Array && (m.responseType = "arraybuffer");
        m.overrideMimeType && m.overrideMimeType("text/plain; charset=x-user-defined");
        m.send(null);
        if (!(200 <= m.status && 300 > m.status || 304 === m.status)) {
          throw Error("Couldn't load " + c + ". Status: " + m.status);
        }
        e = void 0 !== m.response ? new Uint8Array(m.response || []) : vb(m.responseText || "", !0);
        V[a] = e;
      }
      if ("undefined" === typeof h.Nb[a]) {
        throw Error("doXHR failed!");
      }
      return h.Nb[a];
    });
    if (a || !b) {
      g = b = 1, g = b = this.Oc(0).length, console.log("LazyFiles on gzip forces download of the whole file when length is accessed");
    }
    this.cd = b;
    this.bd = g;
    this.oc = !0;
  };
  if ("undefined" !== typeof XMLHttpRequest) {
    if (!v) {
      throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
    }
    var h = new g;
    Object.defineProperties(h, {length:{get:function() {
      this.oc || this.Cc();
      return this.cd;
    }}, chunkSize:{get:function() {
      this.oc || this.Cc();
      return this.bd;
    }}});
    h = {nc:!1, Ha:h};
  } else {
    h = {nc:!1, url:c};
  }
  var m = q.ld(a, b, h, e, f);
  h.Ha ? m.Ha = h.Ha : h.url && (m.Ha = null, m.url = h.url);
  Object.defineProperties(m, {La:{get:function() {
    return this.Ha.length;
  }}});
  var n = {};
  Object.keys(m.Ia).forEach(function(a) {
    var b = m.Ia[a];
    n[a] = function() {
      if (!q.Lc(m)) {
        throw new q.Ga(29);
      }
      return b.apply(null, arguments);
    };
  });
  n.read = function(a, b, c, e, f) {
    if (!q.Lc(m)) {
      throw new q.Ga(29);
    }
    a = a.node.Ha;
    if (f >= a.length) {
      return 0;
    }
    e = Math.min(a.length - f, e);
    if (a.slice) {
      for (var g = 0; g < e; g++) {
        b[c + g] = a[f + g];
      }
    } else {
      for (g = 0; g < e; g++) {
        b[c + g] = a.get(f + g);
      }
    }
    return e;
  };
  m.Ia = n;
  return m;
}, Vd:function(a, b, c, e, f, g, h, m, n, p) {
  function r(c) {
    function V(c) {
      p && p();
      m || q.Ob(a, b, c, e, f, n);
      g && g();
      fb();
    }
    var r = !1;
    l.preloadPlugins.forEach(function(a) {
      !r && a.canHandle(x) && (a.handle(c, x, V, function() {
        h && h();
        fb();
      }), r = !0);
    });
    r || V(c);
  }
  (void 0).Bb();
  var x = b ? P(N(a, b)) : a;
  ab();
  "string" == typeof c ? (void 0).Sd(c, function(a) {
    r(a);
  }, h) : r(c);
}, indexedDB:function() {
  return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
}, zc:function() {
  return "EM_FS_" + window.location.pathname;
}, Ac:20, zb:"FILE_DATA", ie:function(a, b, c) {
  b = b || function() {
  };
  c = c || function() {
  };
  var e = q.indexedDB();
  try {
    var f = e.open(q.zc(), q.Ac);
  } catch (g) {
    return c(g);
  }
  f.onupgradeneeded = function() {
    console.log("creating db");
    f.result.createObjectStore(q.zb);
  };
  f.onsuccess = function() {
    var e = f.result.transaction([q.zb], "readwrite"), h = e.objectStore(q.zb), m = 0, n = 0, p = a.length;
    a.forEach(function(a) {
      a = h.put(q.fc(a).object.Ha, a);
      a.onsuccess = function() {
        m++;
        m + n == p && (0 == n ? b() : c());
      };
      a.onerror = function() {
        n++;
        m + n == p && (0 == n ? b() : c());
      };
    });
    e.onerror = c;
  };
  f.onerror = c;
}, ce:function(a, b, c) {
  b = b || function() {
  };
  c = c || function() {
  };
  var e = q.indexedDB();
  try {
    var f = e.open(q.zc(), q.Ac);
  } catch (g) {
    return c(g);
  }
  f.onupgradeneeded = c;
  f.onsuccess = function() {
    var e = f.result;
    try {
      var h = e.transaction([q.zb], "readonly");
    } catch (x) {
      c(x);
      return;
    }
    var m = h.objectStore(q.zb), n = 0, p = 0, r = a.length;
    a.forEach(function(a) {
      var e = m.get(a);
      e.onsuccess = function() {
        q.fc(a).exists && q.unlink(a);
        q.Ob(pb(a), M(a), e.result, !0, !0, !0);
        n++;
        n + p == r && (0 == p ? b() : c());
      };
      e.onerror = function() {
        p++;
        n + p == r && (0 == p ? b() : c());
      };
    });
    h.onerror = c;
  };
  f.onerror = c;
}};
function yb(a, b, c) {
  try {
    var e = a(b);
  } catch (f) {
    if (f && f.node && ob(b) !== ob(q.eb(f.node))) {
      return -54;
    }
    throw f;
  }
  C[c >> 2] = e.dev;
  C[c + 4 >> 2] = 0;
  C[c + 8 >> 2] = e.ino;
  C[c + 12 >> 2] = e.mode;
  C[c + 16 >> 2] = e.nlink;
  C[c + 20 >> 2] = e.uid;
  C[c + 24 >> 2] = e.gid;
  C[c + 28 >> 2] = e.rdev;
  C[c + 32 >> 2] = 0;
  L = [e.size >>> 0, (K = e.size, 1 <= +Ua(K) ? 0 < K ? (Xa(+Wa(K / 4294967296), 4294967295) | 0) >>> 0 : ~~+Va((K - +(~~K >>> 0)) / 4294967296) >>> 0 : 0)];
  C[c + 40 >> 2] = L[0];
  C[c + 44 >> 2] = L[1];
  C[c + 48 >> 2] = 4096;
  C[c + 52 >> 2] = e.blocks;
  C[c + 56 >> 2] = e.atime.getTime() / 1e3 | 0;
  C[c + 60 >> 2] = 0;
  C[c + 64 >> 2] = e.mtime.getTime() / 1e3 | 0;
  C[c + 68 >> 2] = 0;
  C[c + 72 >> 2] = e.ctime.getTime() / 1e3 | 0;
  C[c + 76 >> 2] = 0;
  L = [e.ino >>> 0, (K = e.ino, 1 <= +Ua(K) ? 0 < K ? (Xa(+Wa(K / 4294967296), 4294967295) | 0) >>> 0 : ~~+Va((K - +(~~K >>> 0)) / 4294967296) >>> 0 : 0)];
  C[c + 80 >> 2] = L[0];
  C[c + 84 >> 2] = L[1];
  return 0;
}
var R = 0;
function S() {
  R += 4;
  return C[R - 4 >> 2];
}
function T() {
  return Ga(S());
}
function U(a) {
  void 0 === a && (a = S());
  a = q.tb(a);
  if (!a) {
    throw new q.Ga(8);
  }
  return a;
}
d = {Na:function() {
  l.websocket = l.websocket && "object" === typeof l.websocket ? l.websocket : {};
  l.websocket.dc = {};
  l.websocket.on = function(a, b) {
    "function" === typeof b && (this.dc[a] = b);
    return this;
  };
  l.websocket.emit = function(a, b) {
    "function" === typeof this.dc[a] && this.dc[a].call(this, b);
  };
  return q.createNode(null, "/", 16895, 0);
}, createSocket:function(a, b, c) {
  c && assert(1 == b == (6 == c));
  a = {family:a, type:b, protocol:c, Ra:null, error:null, Jb:{}, rc:[], wb:[], Ua:d.Va};
  b = d.ib();
  c = q.createNode(d.root, b, 49152, 0);
  c.xb = a;
  b = q.Qb({path:b, node:c, flags:q.Xb("r+"), seekable:!1, Ia:d.Ia});
  a.stream = b;
  return a;
}, ud:function(a) {
  return (a = q.tb(a)) && q.isSocket(a.node.mode) ? a.node.xb : null;
}, Ia:{sc:function(a) {
  a = a.node.xb;
  return a.Ua.sc(a);
}, ob:function(a, b, c) {
  a = a.node.xb;
  return a.Ua.ob(a, b, c);
}, read:function(a, b, c, e) {
  a = a.node.xb;
  e = a.Ua.wc(a, e);
  if (!e) {
    return 0;
  }
  b.set(e.buffer, c);
  return e.buffer.length;
}, write:function(a, b, c, e) {
  a = a.node.xb;
  return a.Ua.yc(a, b, c, e);
}, close:function(a) {
  a = a.node.xb;
  a.Ua.close(a);
}}, ib:function() {
  d.ib.current || (d.ib.current = 0);
  return "socket[" + d.ib.current++ + "]";
}, Va:{Pb:function(a, b, c) {
  if ("object" === typeof b) {
    var e = b;
    c = b = null;
  }
  if (e) {
    if (e._socket) {
      b = e._socket.remoteAddress, c = e._socket.remotePort;
    } else {
      c = /ws[s]?:\/\/([^:]+):(\d+)/.exec(e.url);
      if (!c) {
        throw Error("WebSocket URL must be in the format ws(s)://address:port");
      }
      b = c[1];
      c = parseInt(c[2], 10);
    }
  } else {
    try {
      var f = l.websocket && "object" === typeof l.websocket, g = "ws:#".replace("#", "//");
      f && "string" === typeof l.websocket.url && (g = l.websocket.url);
      if ("ws://" === g || "wss://" === g) {
        var h = b.split("/");
        g = g + h[0] + ":" + c + "/" + h.slice(1).join("/");
      }
      h = "binary";
      f && "string" === typeof l.websocket.subprotocol && (h = l.websocket.subprotocol);
      var m = void 0;
      "null" !== h && (h = h.replace(/^ +| +$/g, "").split(/ *, */), m = w ? {protocol:h.toString()} : h);
      f && null === l.websocket.subprotocol && (m = void 0);
      var n;
      w ? n = require("ws") : u ? n = window.WebSocket : n = WebSocket;
      e = new n(g, m);
      e.binaryType = "arraybuffer";
    } catch (p) {
      throw new q.Ga(23);
    }
  }
  b = {Oa:b, port:c, socket:e, Rb:[]};
  d.Va.Bc(a, b);
  d.Va.vd(a, b);
  2 === a.type && "undefined" !== typeof a.sb && b.Rb.push(new Uint8Array([255, 255, 255, 255, 112, 111, 114, 116, (a.sb & 65280) >> 8, a.sb & 255]));
  return b;
}, Tb:function(a, b, c) {
  return a.Jb[b + ":" + c];
}, Bc:function(a, b) {
  a.Jb[b.Oa + ":" + b.port] = b;
}, Vc:function(a, b) {
  delete a.Jb[b.Oa + ":" + b.port];
}, vd:function(a, b) {
  function c() {
    l.websocket.emit("open", a.stream.fd);
    try {
      for (var c = b.Rb.shift(); c;) {
        b.socket.send(c), c = b.Rb.shift();
      }
    } catch (h) {
      b.socket.close();
    }
  }
  function e(c) {
    if ("string" === typeof c) {
      c = (new TextEncoder).encode(c);
    } else {
      assert(void 0 !== c.byteLength);
      if (0 == c.byteLength) {
        return;
      }
      c = new Uint8Array(c);
    }
    var e = f;
    f = !1;
    e && 10 === c.length && 255 === c[0] && 255 === c[1] && 255 === c[2] && 255 === c[3] && 112 === c[4] && 111 === c[5] && 114 === c[6] && 116 === c[7] ? (c = c[8] << 8 | c[9], d.Va.Vc(a, b), b.port = c, d.Va.Bc(a, b)) : (a.wb.push({Oa:b.Oa, port:b.port, data:c}), l.websocket.emit("message", a.stream.fd));
  }
  var f = !0;
  w ? (b.socket.on("open", c), b.socket.on("message", function(a, b) {
    b.Td && e((new Uint8Array(a)).buffer);
  }), b.socket.on("close", function() {
    l.websocket.emit("close", a.stream.fd);
  }), b.socket.on("error", function() {
    a.error = 14;
    l.websocket.emit("error", [a.stream.fd, a.error, "ECONNREFUSED: Connection refused"]);
  })) : (b.socket.onopen = c, b.socket.onclose = function() {
    l.websocket.emit("close", a.stream.fd);
  }, b.socket.onmessage = function(a) {
    e(a.data);
  }, b.socket.onerror = function() {
    a.error = 14;
    l.websocket.emit("error", [a.stream.fd, a.error, "ECONNREFUSED: Connection refused"]);
  });
}, sc:function(a) {
  if (1 === a.type && a.Ra) {
    return a.rc.length ? 65 : 0;
  }
  var b = 0, c = 1 === a.type ? d.Va.Tb(a, a.Xa, a.$a) : null;
  if (a.wb.length || !c || c && c.socket.readyState === c.socket.CLOSING || c && c.socket.readyState === c.socket.CLOSED) {
    b |= 65;
  }
  if (!c || c && c.socket.readyState === c.socket.OPEN) {
    b |= 4;
  }
  if (c && c.socket.readyState === c.socket.CLOSING || c && c.socket.readyState === c.socket.CLOSED) {
    b |= 16;
  }
  return b;
}, ob:function(a, b, c) {
  switch(b) {
    case 21531:
      return b = 0, a.wb.length && (b = a.wb[0].data.length), C[c >> 2] = b, 0;
    default:
      return 28;
  }
}, close:function(a) {
  if (a.Ra) {
    try {
      a.Ra.close();
    } catch (f) {
    }
    a.Ra = null;
  }
  for (var b = Object.keys(a.Jb), c = 0; c < b.length; c++) {
    var e = a.Jb[b[c]];
    try {
      e.socket.close();
    } catch (f) {
    }
    d.Va.Vc(a, e);
  }
  return 0;
}, bind:function(a, b, c) {
  if ("undefined" !== typeof a.Yb || "undefined" !== typeof a.sb) {
    throw new q.Ga(28);
  }
  a.Yb = b;
  a.sb = c;
  if (2 === a.type) {
    a.Ra && (a.Ra.close(), a.Ra = null);
    try {
      a.Ua.listen(a, 0);
    } catch (e) {
      if (!(e instanceof q.Ga)) {
        throw e;
      }
      if (138 !== e.Ka) {
        throw e;
      }
    }
  }
}, connect:function(a, b, c) {
  if (a.Ra) {
    throw new q.Ga(138);
  }
  if ("undefined" !== typeof a.Xa && "undefined" !== typeof a.$a) {
    var e = d.Va.Tb(a, a.Xa, a.$a);
    if (e) {
      if (e.socket.readyState === e.socket.CONNECTING) {
        throw new q.Ga(7);
      }
      throw new q.Ga(30);
    }
  }
  b = d.Va.Pb(a, b, c);
  a.Xa = b.Oa;
  a.$a = b.port;
  throw new q.Ga(26);
}, listen:function(a) {
  if (!w) {
    throw new q.Ga(138);
  }
  if (a.Ra) {
    throw new q.Ga(28);
  }
  var b = require("ws").Server;
  a.Ra = new b({host:a.Yb, port:a.sb});
  l.websocket.emit("listen", a.stream.fd);
  a.Ra.on("connection", function(b) {
    if (1 === a.type) {
      var c = d.createSocket(a.family, a.type, a.protocol);
      b = d.Va.Pb(c, b);
      c.Xa = b.Oa;
      c.$a = b.port;
      a.rc.push(c);
      l.websocket.emit("connection", c.stream.fd);
    } else {
      d.Va.Pb(a, b), l.websocket.emit("connection", a.stream.fd);
    }
  });
  a.Ra.on("closed", function() {
    l.websocket.emit("close", a.stream.fd);
    a.Ra = null;
  });
  a.Ra.on("error", function() {
    a.error = 23;
    l.websocket.emit("error", [a.stream.fd, a.error, "EHOSTUNREACH: Host is unreachable"]);
  });
}, accept:function(a) {
  if (!a.Ra) {
    throw new q.Ga(28);
  }
  var b = a.rc.shift();
  b.stream.flags = a.stream.flags;
  return b;
}, $d:function(a, b) {
  if (b) {
    if (void 0 === a.Xa || void 0 === a.$a) {
      throw new q.Ga(53);
    }
    b = a.Xa;
    a = a.$a;
  } else {
    b = a.Yb || 0, a = a.sb || 0;
  }
  return {Oa:b, port:a};
}, yc:function(a, b, c, e, f, g) {
  if (2 === a.type) {
    if (void 0 === f || void 0 === g) {
      f = a.Xa, g = a.$a;
    }
    if (void 0 === f || void 0 === g) {
      throw new q.Ga(17);
    }
  } else {
    f = a.Xa, g = a.$a;
  }
  var h = d.Va.Tb(a, f, g);
  if (1 === a.type) {
    if (!h || h.socket.readyState === h.socket.CLOSING || h.socket.readyState === h.socket.CLOSED) {
      throw new q.Ga(53);
    }
    if (h.socket.readyState === h.socket.CONNECTING) {
      throw new q.Ga(6);
    }
  }
  ArrayBuffer.isView(b) && (c += b.byteOffset, b = b.buffer);
  b = b.slice(c, c + e);
  if (2 === a.type && (!h || h.socket.readyState !== h.socket.OPEN)) {
    return h && h.socket.readyState !== h.socket.CLOSING && h.socket.readyState !== h.socket.CLOSED || (h = d.Va.Pb(a, f, g)), h.Rb.push(b), e;
  }
  try {
    return h.socket.send(b), e;
  } catch (m) {
    throw new q.Ga(28);
  }
}, wc:function(a, b) {
  if (1 === a.type && a.Ra) {
    throw new q.Ga(53);
  }
  var c = a.wb.shift();
  if (!c) {
    if (1 === a.type) {
      if (a = d.Va.Tb(a, a.Xa, a.$a)) {
        if (a.socket.readyState === a.socket.CLOSING || a.socket.readyState === a.socket.CLOSED) {
          return null;
        }
        throw new q.Ga(6);
      }
      throw new q.Ga(53);
    }
    throw new q.Ga(6);
  }
  var e = c.data.byteLength || c.data.length, f = c.data.byteOffset || 0, g = c.data.buffer || c.data;
  b = Math.min(b, e);
  var h = {buffer:new Uint8Array(g, f, b), Oa:c.Oa, port:c.port};
  1 === a.type && b < e && (c.data = new Uint8Array(g, f + b, e - b), a.wb.unshift(c));
  return h;
}}};
function zb(a) {
  a = a.split(".");
  for (var b = 0; 4 > b; b++) {
    var c = Number(a[b]);
    if (isNaN(c)) {
      return null;
    }
    a[b] = c;
  }
  return (a[0] | a[1] << 8 | a[2] << 16 | a[3] << 24) >>> 0;
}
function Ab(a) {
  var b, c, e = [];
  if (!/^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i.test(a)) {
    return null;
  }
  if ("::" === a) {
    return [0, 0, 0, 0, 0, 0, 0, 0];
  }
  a = 0 === a.indexOf("::") ? a.replace("::", "Z:") : a.replace("::", ":Z:");
  0 < a.indexOf(".") ? (a = a.replace(/[.]/g, ":"), a = a.split(":"), a[a.length - 4] = parseInt(a[a.length - 4]) + 256 * parseInt(a[a.length - 3]), a[a.length - 3] = parseInt(a[a.length - 2]) + 256 * parseInt(a[a.length - 1]), a = a.slice(0, a.length - 2)) : a = a.split(":");
  for (b = c = 0; b < a.length; b++) {
    if ("string" === typeof a[b]) {
      if ("Z" === a[b]) {
        for (c = 0; c < 8 - a.length + 1; c++) {
          e[b + c] = 0;
        }
        --c;
      } else {
        e[b + c] = Bb(parseInt(a[b], 16));
      }
    } else {
      e[b + c] = a[b];
    }
  }
  return [e[1] << 16 | e[0], e[3] << 16 | e[2], e[5] << 16 | e[4], e[7] << 16 | e[6]];
}
k = {mb:{id:1, ec:{}, names:{}}, Eb:function(a) {
  var b = zb(a);
  if (null !== b) {
    return a;
  }
  b = Ab(a);
  if (null !== b) {
    return a;
  }
  k.mb.ec[a] ? b = k.mb.ec[a] : (b = k.mb.id++, assert(65535 > b, "exceeded max address mappings of 65535"), b = "172.29." + (b & 255) + "." + (b & 65280), k.mb.names[b] = a, k.mb.ec[a] = b);
  return b;
}, Sc:function(a) {
  return k.mb.names[a] ? k.mb.names[a] : null;
}};
function Cb(a) {
  return (a & 255) + "." + (a >> 8 & 255) + "." + (a >> 16 & 255) + "." + (a >> 24 & 255);
}
function Db(a, b) {
  var c = Ka[a >> 1], e = Eb(La[a + 2 >> 1]);
  switch(c) {
    case 2:
      if (16 !== b) {
        return {Ka:28};
      }
      var f = C[a + 4 >> 2];
      f = Cb(f);
      break;
    case 10:
      if (28 !== b) {
        return {Ka:28};
      }
      f = [C[a + 8 >> 2], C[a + 12 >> 2], C[a + 16 >> 2], C[a + 20 >> 2]];
      a: {
        a = "";
        var g, h = b = 0, m = 0, n = 0;
        f = [f[0] & 65535, f[0] >> 16, f[1] & 65535, f[1] >> 16, f[2] & 65535, f[2] >> 16, f[3] & 65535, f[3] >> 16];
        var p = !0;
        for (g = 0; 5 > g; g++) {
          if (0 !== f[g]) {
            p = !1;
            break;
          }
        }
        if (p) {
          g = Cb(f[6] | f[7] << 16);
          if (-1 === f[5]) {
            f = "::ffff:" + g;
            break a;
          }
          if (0 === f[5]) {
            "0.0.0.0" === g && (g = "");
            "0.0.0.1" === g && (g = "1");
            f = "::" + g;
            break a;
          }
        }
        for (g = 0; 8 > g; g++) {
          0 === f[g] && (1 < g - h && (n = 0), h = g, n++), n > b && (b = n, m = g - b + 1);
        }
        for (g = 0; 8 > g; g++) {
          1 < b && 0 === f[g] && g >= m && g < m + b ? g === m && (a += ":", 0 === m && (a += ":")) : (a += Number(Eb(f[g] & 65535)).toString(16), a += 7 > g ? ":" : "");
        }
        f = a;
      }
      break;
    default:
      return {Ka:5};
  }
  return {family:c, Oa:f, port:e};
}
function Fb(a, b, c, e) {
  switch(b) {
    case 2:
      c = zb(c);
      Ka[a >> 1] = b;
      C[a + 4 >> 2] = c;
      Ka[a + 2 >> 1] = Bb(e);
      break;
    case 10:
      c = Ab(c), C[a >> 2] = b, C[a + 8 >> 2] = c[0], C[a + 12 >> 2] = c[1], C[a + 16 >> 2] = c[2], C[a + 20 >> 2] = c[3], Ka[a + 2 >> 1] = Bb(e), C[a + 4 >> 2] = 0, C[a + 24 >> 2] = 0;
  }
}
var W = {Za:8192, Na:function() {
  return q.createNode(null, "/", 16895, 0);
}, nd:function() {
  var a = {Pa:[]};
  a.Pa.push({buffer:new Uint8Array(W.Za), offset:0, bb:0});
  var b = W.ib(), c = W.ib(), e = q.createNode(W.root, b, 4096, 0), f = q.createNode(W.root, c, 4096, 0);
  e.pipe = a;
  f.pipe = a;
  a = q.Qb({path:b, node:e, flags:q.Xb("r"), seekable:!1, Ia:W.Ia});
  e.stream = a;
  c = q.Qb({path:c, node:f, flags:q.Xb("w"), seekable:!1, Ia:W.Ia});
  f.stream = c;
  return {Fd:a.fd, Pd:c.fd};
}, Ia:{sc:function(a) {
  var b = a.node.pipe;
  if (1 === (a.flags & 2097155)) {
    return 260;
  }
  if (0 < b.Pa.length) {
    for (a = 0; a < b.Pa.length; a++) {
      var c = b.Pa[a];
      if (0 < c.offset - c.bb) {
        return 65;
      }
    }
  }
  return 0;
}, ob:function() {
  return 28;
}, fsync:function() {
  return 28;
}, read:function(a, b, c, e) {
  a = a.node.pipe;
  for (var f = 0, g = 0; g < a.Pa.length; g++) {
    var h = a.Pa[g];
    f += h.offset - h.bb;
  }
  assert(b instanceof ArrayBuffer || ArrayBuffer.isView(b));
  b = b.subarray(c, c + e);
  if (0 >= e) {
    return 0;
  }
  if (0 == f) {
    throw new q.Ga(6);
  }
  c = e = Math.min(f, e);
  for (g = f = 0; g < a.Pa.length; g++) {
    h = a.Pa[g];
    var m = h.offset - h.bb;
    if (e <= m) {
      var n = h.buffer.subarray(h.bb, h.offset);
      e < m ? (n = n.subarray(0, e), h.bb += e) : f++;
      b.set(n);
      break;
    } else {
      n = h.buffer.subarray(h.bb, h.offset), b.set(n), b = b.subarray(n.byteLength), e -= n.byteLength, f++;
    }
  }
  f && f == a.Pa.length && (f--, a.Pa[f].offset = 0, a.Pa[f].bb = 0);
  a.Pa.splice(0, f);
  return c;
}, write:function(a, b, c, e) {
  a = a.node.pipe;
  assert(b instanceof ArrayBuffer || ArrayBuffer.isView(b));
  b = b.subarray(c, c + e);
  c = b.byteLength;
  if (0 >= c) {
    return 0;
  }
  0 == a.Pa.length ? (e = {buffer:new Uint8Array(W.Za), offset:0, bb:0}, a.Pa.push(e)) : e = a.Pa[a.Pa.length - 1];
  assert(e.offset <= W.Za);
  var f = W.Za - e.offset;
  if (f >= c) {
    return e.buffer.set(b, e.offset), e.offset += c, c;
  }
  0 < f && (e.buffer.set(b.subarray(0, f), e.offset), e.offset += f, b = b.subarray(f, b.byteLength));
  e = b.byteLength / W.Za | 0;
  f = b.byteLength % W.Za;
  for (var g = 0; g < e; g++) {
    var h = {buffer:new Uint8Array(W.Za), offset:W.Za, bb:0};
    a.Pa.push(h);
    h.buffer.set(b.subarray(0, W.Za));
    b = b.subarray(W.Za, b.byteLength);
  }
  0 < f && (h = {buffer:new Uint8Array(W.Za), offset:b.byteLength, bb:0}, a.Pa.push(h), h.buffer.set(b));
  return c;
}, close:function(a) {
  a.node.pipe.Pa = null;
}}, ib:function() {
  W.ib.current || (W.ib.current = 0);
  return "pipe[" + W.ib.current++ + "]";
}}, Gb = 0;
function Hb(a, b, c, e) {
  a |= 0;
  b |= 0;
  c |= 0;
  e |= 0;
  var f = 0;
  Gb = Gb + 1 | 0;
  for (C[a >> 2] = Gb; (f | 0) < (e | 0);) {
    if (0 == (C[c + (f << 3) >> 2] | 0)) {
      return C[c + (f << 3) >> 2] = Gb, C[c + ((f << 3) + 4) >> 2] = b, C[c + ((f << 3) + 8) >> 2] = 0, va = e | 0, c | 0;
    }
    f = f + 1 | 0;
  }
  e = 2 * e | 0;
  c = Ib(c | 0, 8 * (e + 1 | 0) | 0) | 0;
  c = Hb(a | 0, b | 0, c | 0, e | 0) | 0;
  va = e | 0;
  return c | 0;
}
var Kb = {};
function Lb() {
  if (!Mb) {
    var a = {USER:"web_user", LOGNAME:"web_user", PATH:"/", PWD:"/", HOME:"/home/web_user", LANG:("object" === typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", _:ia}, b;
    for (b in Kb) {
      a[b] = Kb[b];
    }
    var c = [];
    for (b in a) {
      c.push(b + "=" + a[b]);
    }
    Mb = c;
  }
  return Mb;
}
var Mb;
function Nb() {
  O(45);
  return -1;
}
G("GMT", E, 995696, 4);
function Ob() {
  function a(a) {
    return (a = a.toTimeString().match(/\(([A-Za-z ]+)\)$/)) ? a[1] : "GMT";
  }
  if (!Pb) {
    Pb = !0;
    C[Qb() >> 2] = 60 * (new Date).getTimezoneOffset();
    var b = (new Date).getFullYear(), c = new Date(b, 0, 1);
    b = new Date(b, 6, 1);
    C[Rb() >> 2] = Number(c.getTimezoneOffset() != b.getTimezoneOffset());
    var e = a(c), f = a(b);
    e = Ca(vb(e));
    f = Ca(vb(f));
    b.getTimezoneOffset() < c.getTimezoneOffset() ? (C[Sb() >> 2] = e, C[Sb() + 4 >> 2] = f) : (C[Sb() >> 2] = f, C[Sb() + 4 >> 2] = e);
  }
}
var Pb;
function Tb(a) {
  a /= 1e3;
  if ((u || v) && self.performance && self.performance.now) {
    for (var b = self.performance.now(); self.performance.now() - b < a;) {
    }
  } else {
    for (b = Date.now(); Date.now() - b < a;) {
    }
  }
  return 0;
}
l._usleep = Tb;
function Ub(a) {
  return 0 === a % 4 && (0 !== a % 100 || 0 === a % 400);
}
function Vb(a, b) {
  for (var c = 0, e = 0; e <= b; c += a[e++]) {
  }
  return c;
}
var Wb = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], Xb = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function Yb(a, b) {
  for (a = new Date(a.getTime()); 0 < b;) {
    var c = a.getMonth(), e = (Ub(a.getFullYear()) ? Wb : Xb)[c];
    if (b > e - a.getDate()) {
      b -= e - a.getDate() + 1, a.setDate(1), 11 > c ? a.setMonth(c + 1) : (a.setMonth(0), a.setFullYear(a.getFullYear() + 1));
    } else {
      a.setDate(a.getDate() + b);
      break;
    }
  }
  return a;
}
q.Jd();
var cc = !1;
function vb(a, b) {
  var c = Array(Ha(a) + 1);
  a = G(a, c, 0, c.length);
  b && (c.length = a);
  return c;
}
function ta(a) {
  for (var b = [], c = 0; c < a.length; c++) {
    var e = a[c];
    255 < e && (cc && assert(!1, "Character code " + e + " (" + String.fromCharCode(e) + ")  at offset " + c + " not in 0x00-0xFF."), e &= 255);
    b.push(String.fromCharCode(e));
  }
  return b.join("");
}
var dc = "function" === typeof atob ? atob : function(a) {
  var b = "", c = 0;
  a = a.replace(/[^A-Za-z0-9\+\/=]/g, "");
  do {
    var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(c++));
    var f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(c++));
    var g = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(c++));
    var h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(c++));
    e = e << 2 | f >> 4;
    f = (f & 15) << 4 | g >> 2;
    var m = (g & 3) << 6 | h;
    b += String.fromCharCode(e);
    64 !== g && (b += String.fromCharCode(f));
    64 !== h && (b += String.fromCharCode(m));
  } while (c < a.length);
  return b;
};
function ra(a) {
  if (hb(a)) {
    a = a.slice(gb.length);
    if ("boolean" === typeof w && w) {
      try {
        var b = Buffer.from(a, "base64");
      } catch (g) {
        b = new Buffer(a, "base64");
      }
      var c = new Uint8Array(b.buffer, b.byteOffset, b.byteLength);
    } else {
      try {
        var e = dc(a), f = new Uint8Array(e.length);
        for (b = 0; b < e.length; ++b) {
          f[b] = e.charCodeAt(b);
        }
        c = f;
      } catch (g) {
        throw Error("Converting base64 string to bytes failed.");
      }
    }
    return c;
  }
}
var rc = {a:function(a, b, c, e) {
  z("Assertion failed: " + Ga(a) + ", at: " + [b ? Ga(b) : "unknown filename", c, e ? Ga(e) : "unknown function"]);
}, T:function() {
}, R:function(a, b) {
  R = b;
  try {
    var c = T();
    q.unlink(c);
    return 0;
  } catch (e) {
    return "undefined" !== typeof q && e instanceof q.Ga || z(e), -e.Ka;
  }
}, u:function(a, b) {
  R = b;
  try {
    var c = S();
    R = S();
    a = function() {
      var a = d.ud(S());
      if (!a) {
        throw new q.Ga(8);
      }
      return a;
    };
    b = function(a) {
      var b = S(), c = S();
      if (a && 0 === b) {
        return null;
      }
      a = Db(b, c);
      if (a.Ka) {
        throw new q.Ga(a.Ka);
      }
      a.Oa = k.Sc(a.Oa) || a.Oa;
      return a;
    };
    switch(c) {
      case 1:
        var e = S(), f = S(), g = S(), h = d.createSocket(e, f, g);
        return h.stream.fd;
      case 2:
        h = a();
        var m = b();
        h.Ua.bind(h, m.Oa, m.port);
        return 0;
      case 3:
        return h = a(), m = b(), h.Ua.connect(h, m.Oa, m.port), 0;
      case 4:
        h = a();
        var n = S();
        h.Ua.listen(h, n);
        return 0;
      case 5:
        h = a();
        var p = S();
        S();
        var r = h.Ua.accept(h);
        p && Fb(p, r.family, k.Eb(r.Xa), r.$a);
        return r.stream.fd;
      case 6:
        return h = a(), p = S(), S(), Fb(p, h.family, k.Eb(h.Yb || "0.0.0.0"), h.sb), 0;
      case 7:
        h = a();
        p = S();
        S();
        if (!h.Xa) {
          return -53;
        }
        Fb(p, h.family, k.Eb(h.Xa), h.$a);
        return 0;
      case 11:
        h = a();
        var x = S(), F = S();
        S();
        var V = b(!0);
        return V ? h.Ua.yc(h, D, x, F, V.Oa, V.port) : q.write(h.stream, D, x, F);
      case 12:
        h = a();
        var ca = S(), Zb = S();
        S();
        p = S();
        S();
        var H = h.Ua.wc(h, Zb);
        if (!H) {
          return 0;
        }
        p && Fb(p, h.family, k.Eb(H.Oa), H.port);
        E.set(H.buffer, ca);
        return H.buffer.byteLength;
      case 14:
        return -50;
      case 15:
        h = a();
        var $b = S(), ac = S(), bc = S(), kc = S();
        return 1 === $b && 4 === ac ? (C[bc >> 2] = h.error, C[kc >> 2] = 4, h.error = null, 0) : -50;
      case 16:
        h = a();
        x = S();
        S();
        var da = C[x + 8 >> 2], Ba = C[x + 12 >> 2], Ma = C[x >> 2], lc = C[x + 4 >> 2];
        if (Ma) {
          m = Db(Ma, lc);
          if (m.Ka) {
            return -m.Ka;
          }
          var mc = m.port;
          p = k.Sc(m.Oa) || m.Oa;
        }
        for (var la = 0, B = 0; B < Ba; B++) {
          la += C[da + (8 * B + 4) >> 2];
        }
        var Jb = new Uint8Array(la);
        for (B = F = 0; B < Ba; B++) {
          var cb = C[da + 8 * B >> 2], db = C[da + (8 * B + 4) >> 2];
          for (ca = 0; ca < db; ca++) {
            Jb[F++] = D[cb + ca >> 0];
          }
        }
        return h.Ua.yc(h, Jb, 0, la, p, mc);
      case 17:
        h = a();
        x = S();
        S();
        da = C[x + 8 >> 2];
        Ba = C[x + 12 >> 2];
        for (B = la = 0; B < Ba; B++) {
          la += C[da + (8 * B + 4) >> 2];
        }
        H = h.Ua.wc(h, la);
        if (!H) {
          return 0;
        }
        (Ma = C[x >> 2]) && Fb(Ma, h.family, k.Eb(H.Oa), H.port);
        h = 0;
        var eb = H.buffer.byteLength;
        for (B = 0; 0 < eb && B < Ba; B++) {
          if (cb = C[da + 8 * B >> 2], db = C[da + (8 * B + 4) >> 2]) {
            F = Math.min(db, eb), ca = H.buffer.subarray(h, h + F), E.set(ca, cb + h), h += F, eb -= F;
          }
        }
        return h;
      default:
        z("unsupported socketcall syscall " + c);
    }
  } catch (bb) {
    return "undefined" !== typeof q && bb instanceof q.Ga || z(bb), -bb.Ka;
  }
}, S:function(a, b) {
  R = b;
  try {
    z("cannot wait on child processes");
  } catch (c) {
    return "undefined" !== typeof q && c instanceof q.Ga || z(c), -c.Ka;
  }
}, M:function(a, b) {
  R = b;
  try {
    var c = S(), e = S();
    if (0 === e) {
      return -28;
    }
    var f = q.cwd();
    if (e < Ha(f) + 1) {
      return -68;
    }
    G(f, E, c, e);
    return c;
  } catch (g) {
    return "undefined" !== typeof q && g instanceof q.Ga || z(g), -g.Ka;
  }
}, Y:function(a, b) {
  R = b;
  try {
    var c = T(), e = S();
    return yb(q.stat, c, e);
  } catch (f) {
    return "undefined" !== typeof q && f instanceof q.Ga || z(f), -f.Ka;
  }
}, Z:function(a, b) {
  R = b;
  try {
    var c = T(), e = S();
    return yb(q.lstat, c, e);
  } catch (f) {
    return "undefined" !== typeof q && f instanceof q.Ga || z(f), -f.Ka;
  }
}, K:function(a, b) {
  R = b;
  return 0;
}, L:function(a, b) {
  R = b;
  return 42;
}, _:function(a, b) {
  R = b;
  try {
    var c = U(), e = S(), f = S();
    c.nb || (c.nb = q.readdir(c.path));
    a = 0;
    for (var g = q.Ya(c, 0, 1), h = Math.floor(g / 280); h < c.nb.length && a + 280 <= f;) {
      var m = c.nb[h];
      if ("." === m[0]) {
        var n = 1;
        var p = 4;
      } else {
        var r = q.gb(c.node, m);
        n = r.id;
        p = q.Cb(r.mode) ? 2 : q.Qa(r.mode) ? 4 : q.ub(r.mode) ? 10 : 8;
      }
      L = [n >>> 0, (K = n, 1 <= +Ua(K) ? 0 < K ? (Xa(+Wa(K / 4294967296), 4294967295) | 0) >>> 0 : ~~+Va((K - +(~~K >>> 0)) / 4294967296) >>> 0 : 0)];
      C[e + a >> 2] = L[0];
      C[e + a + 4 >> 2] = L[1];
      L = [280 * (h + 1) >>> 0, (K = 280 * (h + 1), 1 <= +Ua(K) ? 0 < K ? (Xa(+Wa(K / 4294967296), 4294967295) | 0) >>> 0 : ~~+Va((K - +(~~K >>> 0)) / 4294967296) >>> 0 : 0)];
      C[e + a + 8 >> 2] = L[0];
      C[e + a + 12 >> 2] = L[1];
      Ka[e + a + 16 >> 1] = 280;
      D[e + a + 18 >> 0] = p;
      G(m, E, e + a + 19, 256);
      a += 280;
      h += 1;
    }
    q.Ya(c, 280 * h, 0);
    return a;
  } catch (x) {
    return "undefined" !== typeof q && x instanceof q.Ga || z(x), -x.Ka;
  }
}, p:function(a, b) {
  R = b;
  try {
    var c = U();
    switch(S()) {
      case 0:
        var e = S();
        return 0 > e ? -28 : q.open(c.path, c.flags, 0, e).fd;
      case 1:
      case 2:
        return 0;
      case 3:
        return c.flags;
      case 4:
        return e = S(), c.flags |= e, 0;
      case 12:
        return e = S(), Ka[e + 0 >> 1] = 2, 0;
      case 13:
      case 14:
        return 0;
      case 16:
      case 8:
        return -28;
      case 9:
        return O(28), -1;
      default:
        return -28;
    }
  } catch (f) {
    return "undefined" !== typeof q && f instanceof q.Ga || z(f), -f.Ka;
  }
}, I:function(a, b) {
  R = b;
  try {
    var c = U(), e = S(), f = S();
    return q.read(c, D, e, f);
  } catch (g) {
    return "undefined" !== typeof q && g instanceof q.Ga || z(g), -g.Ka;
  }
}, O:function(a, b) {
  R = b;
  try {
    var c = T();
    var e = S();
    if (e & -8) {
      var f = -28;
    } else {
      var g;
      (g = q.Ma(c, {ab:!0}).node) ? (a = "", e & 4 && (a += "r"), e & 2 && (a += "w"), e & 1 && (a += "x"), f = a && q.lb(g, a) ? -2 : 0) : f = -44;
    }
    return f;
  } catch (h) {
    return "undefined" !== typeof q && h instanceof q.Ga || z(h), -h.Ka;
  }
}, P:function(a, b) {
  R = b;
  try {
    var c = T(), e = T();
    q.rename(c, e);
    return 0;
  } catch (f) {
    return "undefined" !== typeof q && f instanceof q.Ga || z(f), -f.Ka;
  }
}, F:function(a, b) {
  R = b;
  try {
    var c = U(), e = S(), f = S();
    return q.write(c, D, e, f);
  } catch (g) {
    return "undefined" !== typeof q && g instanceof q.Ga || z(g), -g.Ka;
  }
}, Q:function(a, b) {
  R = b;
  try {
    var c = T();
    q.rmdir(c);
    return 0;
  } catch (e) {
    return "undefined" !== typeof q && e instanceof q.Ga || z(e), -e.Ka;
  }
}, N:function(a, b) {
  R = b;
  try {
    var c = U();
    return q.open(c.path, c.flags, 0).fd;
  } catch (e) {
    return "undefined" !== typeof q && e instanceof q.Ga || z(e), -e.Ka;
  }
}, J:function(a, b) {
  R = b;
  try {
    var c = S();
    if (0 == c) {
      throw new q.Ga(21);
    }
    var e = W.nd();
    C[c >> 2] = e.Fd;
    C[c + 4 >> 2] = e.Pd;
    return 0;
  } catch (f) {
    return "undefined" !== typeof q && f instanceof q.Ga || z(f), -f.Ka;
  }
}, v:function(a, b) {
  R = b;
  try {
    var c = T(), e = S(), f = S();
    return q.open(c, e, f).fd;
  } catch (g) {
    return "undefined" !== typeof q && g instanceof q.Ga || z(g), -g.Ka;
  }
}, W:function(a, b) {
  R = b;
  try {
    var c = U(), e = S();
    switch(e) {
      case 21509:
      case 21505:
        return c.tty ? 0 : -59;
      case 21510:
      case 21511:
      case 21512:
      case 21506:
      case 21507:
      case 21508:
        return c.tty ? 0 : -59;
      case 21519:
        if (!c.tty) {
          return -59;
        }
        var f = S();
        return C[f >> 2] = 0;
      case 21520:
        return c.tty ? -28 : -59;
      case 21531:
        return f = S(), q.ob(c, e, f);
      case 21523:
        return c.tty ? 0 : -59;
      case 21524:
        return c.tty ? 0 : -59;
      default:
        z("bad ioctl syscall " + e);
    }
  } catch (g) {
    return "undefined" !== typeof q && g instanceof q.Ga || z(g), -g.Ka;
  }
}, H:function(a, b) {
  R = b;
  try {
    var c = T(), e = S();
    var f = S();
    if (0 >= f) {
      var g = -28;
    } else {
      var h = q.readlink(c), m = Math.min(f, Ha(h)), n = D[e + m];
      G(h, E, e, f + 1);
      D[e + m] = n;
      g = m;
    }
    return g;
  } catch (p) {
    return "undefined" !== typeof q && p instanceof q.Ga || z(p), -p.Ka;
  }
}, o:function() {
}, X:function() {
}, ba:function(a) {
  ec(a);
}, j:function() {
  z();
}, f:function(a, b) {
  X(a, b || 1);
  throw "longjmp";
}, B:function(a, b, c) {
  E.set(E.subarray(b, b + c), a);
}, C:function() {
  z("OOM");
}, D:function(a, b) {
  var c = 0;
  Lb().forEach(function(e, f) {
    var g = b + c;
    f = C[a + 4 * f >> 2] = g;
    for (g = 0; g < e.length; ++g) {
      D[f++ >> 0] = e.charCodeAt(g);
    }
    D[f >> 0] = 0;
    c += e.length + 1;
  });
  return 0;
}, E:function(a, b) {
  var c = Lb();
  C[a >> 2] = c.length;
  var e = 0;
  c.forEach(function(a) {
    e += a.length + 1;
  });
  C[b >> 2] = e;
  return 0;
}, aa:function() {
  return Nb.apply(null, arguments);
}, c:function(a) {
  ec(a);
}, i:function(a) {
  try {
    var b = U(a);
    q.close(b);
    return 0;
  } catch (c) {
    return "undefined" !== typeof q && c instanceof q.Ga || z(c), c.Ka;
  }
}, U:function(a, b, c, e) {
  try {
    a: {
      for (var f = U(a), g = a = 0; g < c; g++) {
        var h = C[b + (8 * g + 4) >> 2], m = q.read(f, D, C[b + 8 * g >> 2], h, void 0);
        if (0 > m) {
          var n = -1;
          break a;
        }
        a += m;
        if (m < h) {
          break;
        }
      }
      n = a;
    }
    C[e >> 2] = n;
    return 0;
  } catch (p) {
    return "undefined" !== typeof q && p instanceof q.Ga || z(p), p.Ka;
  }
}, A:function(a, b, c, e, f) {
  try {
    var g = U(a);
    a = 4294967296 * c + (b >>> 0);
    if (-9007199254740992 >= a || 9007199254740992 <= a) {
      return -61;
    }
    q.Ya(g, a, e);
    L = [g.position >>> 0, (K = g.position, 1 <= +Ua(K) ? 0 < K ? (Xa(+Wa(K / 4294967296), 4294967295) | 0) >>> 0 : ~~+Va((K - +(~~K >>> 0)) / 4294967296) >>> 0 : 0)];
    C[f >> 2] = L[0];
    C[f + 4 >> 2] = L[1];
    g.nb && 0 === a && 0 === e && (g.nb = null);
    return 0;
  } catch (h) {
    return "undefined" !== typeof q && h instanceof q.Ga || z(h), h.Ka;
  }
}, V:function(a, b, c, e) {
  try {
    a: {
      for (var f = U(a), g = a = 0; g < c; g++) {
        var h = q.write(f, D, C[b + 8 * g >> 2], C[b + (8 * g + 4) >> 2], void 0);
        if (0 > h) {
          var m = -1;
          break a;
        }
        a += h;
      }
      m = a;
    }
    C[e >> 2] = m;
    return 0;
  } catch (n) {
    return "undefined" !== typeof q && n instanceof q.Ga || z(n), n.Ka;
  }
}, ca:function() {
  O(6);
  return -1;
}, b:function() {
  return va | 0;
}, q:function() {
  throw "getpwnam: TODO";
}, da:function() {
  return 0;
}, z:function(a) {
  var b = Date.now();
  C[a >> 2] = b / 1e3 | 0;
  C[a + 4 >> 2] = b % 1e3 * 1e3 | 0;
  return 0;
}, m:function(a) {
  a = new Date(1e3 * C[a >> 2]);
  C[248912] = a.getUTCSeconds();
  C[248913] = a.getUTCMinutes();
  C[248914] = a.getUTCHours();
  C[248915] = a.getUTCDate();
  C[248916] = a.getUTCMonth();
  C[248917] = a.getUTCFullYear() - 1900;
  C[248918] = a.getUTCDay();
  C[248921] = 0;
  C[248920] = 0;
  C[248919] = (a.getTime() - Date.UTC(a.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864E5 | 0;
  C[248922] = 995696;
  return 995648;
}, ea:fc, y:hc, fa:ic, g:jc, s:nc, ga:oc, h:pc, x:qc, t:function(a) {
  Ob();
  a = new Date(1e3 * C[a >> 2]);
  C[248912] = a.getSeconds();
  C[248913] = a.getMinutes();
  C[248914] = a.getHours();
  C[248915] = a.getDate();
  C[248916] = a.getMonth();
  C[248917] = a.getFullYear() - 1900;
  C[248918] = a.getDay();
  var b = new Date(a.getFullYear(), 0, 1);
  C[248919] = (a.getTime() - b.getTime()) / 864E5 | 0;
  C[248921] = -(60 * a.getTimezoneOffset());
  var c = (new Date(a.getFullYear(), 6, 1)).getTimezoneOffset();
  b = b.getTimezoneOffset();
  a = (c != b && a.getTimezoneOffset() == Math.min(b, c)) | 0;
  C[248920] = a;
  a = C[Sb() + (a ? 4 : 0) >> 2];
  C[248922] = a;
  return 995648;
}, memory:ya, G:function(a, b) {
  if (0 === a) {
    return O(28), -1;
  }
  var c = C[a >> 2];
  a = C[a + 4 >> 2];
  if (0 > a || 999999999 < a || 0 > c) {
    return O(28), -1;
  }
  0 !== b && (C[b >> 2] = 0, C[b + 4 >> 2] = 0);
  return Tb(1e6 * c + a / 1e3);
}, w:function() {
  A("missing function: popen");
  z(-1);
}, r:Hb, d:function(a) {
  va = a | 0;
}, l:function() {
  return 0;
}, ha:function(a, b, c, e) {
  function f(a, b, c) {
    for (a = "number" === typeof a ? a.toString() : a || ""; a.length < b;) {
      a = c[0] + a;
    }
    return a;
  }
  function g(a, b) {
    return f(a, b, "0");
  }
  function h(a, b) {
    function c(a) {
      return 0 > a ? -1 : 0 < a ? 1 : 0;
    }
    var e;
    0 === (e = c(a.getFullYear() - b.getFullYear())) && 0 === (e = c(a.getMonth() - b.getMonth())) && (e = c(a.getDate() - b.getDate()));
    return e;
  }
  function m(a) {
    switch(a.getDay()) {
      case 0:
        return new Date(a.getFullYear() - 1, 11, 29);
      case 1:
        return a;
      case 2:
        return new Date(a.getFullYear(), 0, 3);
      case 3:
        return new Date(a.getFullYear(), 0, 2);
      case 4:
        return new Date(a.getFullYear(), 0, 1);
      case 5:
        return new Date(a.getFullYear() - 1, 11, 31);
      case 6:
        return new Date(a.getFullYear() - 1, 11, 30);
    }
  }
  function n(a) {
    a = Yb(new Date(a.Wa + 1900, 0, 1), a.bc);
    var b = m(new Date(a.getFullYear() + 1, 0, 4));
    return 0 >= h(m(new Date(a.getFullYear(), 0, 4)), a) ? 0 >= h(b, a) ? a.getFullYear() + 1 : a.getFullYear() : a.getFullYear() - 1;
  }
  var p = C[e + 40 >> 2];
  e = {Md:C[e >> 2], Ld:C[e + 4 >> 2], $b:C[e + 8 >> 2], Kb:C[e + 12 >> 2], yb:C[e + 16 >> 2], Wa:C[e + 20 >> 2], ac:C[e + 24 >> 2], bc:C[e + 28 >> 2], ke:C[e + 32 >> 2], Kd:C[e + 36 >> 2], Nd:p ? Ga(p) : ""};
  c = Ga(c);
  p = {"%c":"%a %b %d %H:%M:%S %Y", "%D":"%m/%d/%y", "%F":"%Y-%m-%d", "%h":"%b", "%r":"%I:%M:%S %p", "%R":"%H:%M", "%T":"%H:%M:%S", "%x":"%m/%d/%y", "%X":"%H:%M:%S", "%Ec":"%c", "%EC":"%C", "%Ex":"%m/%d/%y", "%EX":"%H:%M:%S", "%Ey":"%y", "%EY":"%Y", "%Od":"%d", "%Oe":"%e", "%OH":"%H", "%OI":"%I", "%Om":"%m", "%OM":"%M", "%OS":"%S", "%Ou":"%u", "%OU":"%U", "%OV":"%V", "%Ow":"%w", "%OW":"%W", "%Oy":"%y"};
  for (var r in p) {
    c = c.replace(new RegExp(r, "g"), p[r]);
  }
  var x = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), F = "January February March April May June July August September October November December".split(" ");
  p = {"%a":function(a) {
    return x[a.ac].substring(0, 3);
  }, "%A":function(a) {
    return x[a.ac];
  }, "%b":function(a) {
    return F[a.yb].substring(0, 3);
  }, "%B":function(a) {
    return F[a.yb];
  }, "%C":function(a) {
    return g((a.Wa + 1900) / 100 | 0, 2);
  }, "%d":function(a) {
    return g(a.Kb, 2);
  }, "%e":function(a) {
    return f(a.Kb, 2, " ");
  }, "%g":function(a) {
    return n(a).toString().substring(2);
  }, "%G":function(a) {
    return n(a);
  }, "%H":function(a) {
    return g(a.$b, 2);
  }, "%I":function(a) {
    a = a.$b;
    0 == a ? a = 12 : 12 < a && (a -= 12);
    return g(a, 2);
  }, "%j":function(a) {
    return g(a.Kb + Vb(Ub(a.Wa + 1900) ? Wb : Xb, a.yb - 1), 3);
  }, "%m":function(a) {
    return g(a.yb + 1, 2);
  }, "%M":function(a) {
    return g(a.Ld, 2);
  }, "%n":function() {
    return "\n";
  }, "%p":function(a) {
    return 0 <= a.$b && 12 > a.$b ? "AM" : "PM";
  }, "%S":function(a) {
    return g(a.Md, 2);
  }, "%t":function() {
    return "\t";
  }, "%u":function(a) {
    return a.ac || 7;
  }, "%U":function(a) {
    var b = new Date(a.Wa + 1900, 0, 1), c = 0 === b.getDay() ? b : Yb(b, 7 - b.getDay());
    a = new Date(a.Wa + 1900, a.yb, a.Kb);
    return 0 > h(c, a) ? g(Math.ceil((31 - c.getDate() + (Vb(Ub(a.getFullYear()) ? Wb : Xb, a.getMonth() - 1) - 31) + a.getDate()) / 7), 2) : 0 === h(c, b) ? "01" : "00";
  }, "%V":function(a) {
    var b = m(new Date(a.Wa + 1900, 0, 4)), c = m(new Date(a.Wa + 1901, 0, 4)), e = Yb(new Date(a.Wa + 1900, 0, 1), a.bc);
    return 0 > h(e, b) ? "53" : 0 >= h(c, e) ? "01" : g(Math.ceil((b.getFullYear() < a.Wa + 1900 ? a.bc + 32 - b.getDate() : a.bc + 1 - b.getDate()) / 7), 2);
  }, "%w":function(a) {
    return a.ac;
  }, "%W":function(a) {
    var b = new Date(a.Wa, 0, 1), c = 1 === b.getDay() ? b : Yb(b, 0 === b.getDay() ? 1 : 7 - b.getDay() + 1);
    a = new Date(a.Wa + 1900, a.yb, a.Kb);
    return 0 > h(c, a) ? g(Math.ceil((31 - c.getDate() + (Vb(Ub(a.getFullYear()) ? Wb : Xb, a.getMonth() - 1) - 31) + a.getDate()) / 7), 2) : 0 === h(c, b) ? "01" : "00";
  }, "%y":function(a) {
    return (a.Wa + 1900).toString().substring(2);
  }, "%Y":function(a) {
    return a.Wa + 1900;
  }, "%z":function(a) {
    a = a.Kd;
    var b = 0 <= a;
    a = Math.abs(a) / 60;
    return (b ? "+" : "-") + String("0000" + (a / 60 * 100 + a % 60)).slice(-4);
  }, "%Z":function(a) {
    return a.Nd;
  }, "%%":function() {
    return "%";
  }};
  for (r in p) {
    0 <= c.indexOf(r) && (c = c.replace(new RegExp(r, "g"), p[r](e)));
  }
  r = vb(c, !1);
  if (r.length > b) {
    return 0;
  }
  D.set(r, a);
  return r.length - 1;
}, k:function() {
  O(6);
  return -1;
}, table:za, e:function(a, b, c) {
  a |= 0;
  b |= 0;
  c |= 0;
  for (var e = 0, f; (e | 0) < (c | 0);) {
    f = C[b + (e << 3) >> 2] | 0;
    if (0 == (f | 0)) {
      break;
    }
    if ((f | 0) == (a | 0)) {
      return C[b + ((e << 3) + 4) >> 2] | 0;
    }
    e = e + 1 | 0;
  }
  return 0;
}, n:function(a) {
  var b = Date.now() / 1e3 | 0;
  a && (C[a >> 2] = b);
  return b;
}, $:function() {
  O(12);
  return -1;
}}, sc = function() {
  function a(a) {
    l.asm = a.exports;
    fb();
  }
  function b(b) {
    a(b.instance);
  }
  function c(a) {
    return kb().then(function(a) {
      return WebAssembly.instantiate(a, e);
    }).then(a, function(a) {
      A("failed to asynchronously prepare wasm: " + a);
      z(a);
    });
  }
  var e = {env:rc, wasi_unstable:rc};
  ab();
  if (l.instantiateWasm) {
    try {
      return l.instantiateWasm(e, a);
    } catch (f) {
      return A("Module.instantiateWasm callback failed with error: " + f), !1;
    }
  }
  (function() {
    if (wa || "function" !== typeof WebAssembly.instantiateStreaming || hb(J) || "function" !== typeof fetch) {
      return c(b);
    }
    fetch(J, {credentials:"same-origin"}).then(function(a) {
      return WebAssembly.instantiateStreaming(a, e).then(b, function(a) {
        A("wasm streaming compile failed: " + a);
        A("falling back to ArrayBuffer instantiation");
        c(b);
      });
    });
  })();
  return {};
}();
l.asm = sc;
var lb = l.___wasm_call_ctors = function() {
  return l.asm.ia.apply(null, arguments);
};
l._main = function() {
  return l.asm.ja.apply(null, arguments);
};
l.___errno_location = function() {
  return l.asm.ka.apply(null, arguments);
};
var Da = l._malloc = function() {
  return l.asm.la.apply(null, arguments);
}, Ib = l._realloc = function() {
  return l.asm.ma.apply(null, arguments);
}, Bb = l._htons = function() {
  return l.asm.na.apply(null, arguments);
}, Eb = l._ntohs = function() {
  return l.asm.oa.apply(null, arguments);
}, Sb = l.__get_tzname = function() {
  return l.asm.pa.apply(null, arguments);
}, Rb = l.__get_daylight = function() {
  return l.asm.qa.apply(null, arguments);
}, Qb = l.__get_timezone = function() {
  return l.asm.ra.apply(null, arguments);
}, X = l._setThrew = function() {
  return l.asm.sa.apply(null, arguments);
}, tc = l.dynCall_i = function() {
  return l.asm.ta.apply(null, arguments);
}, uc = l.dynCall_id = function() {
  return l.asm.ua.apply(null, arguments);
}, vc = l.dynCall_ii = function() {
  return l.asm.va.apply(null, arguments);
}, wc = l.dynCall_iii = function() {
  return l.asm.wa.apply(null, arguments);
}, xc = l.dynCall_iiii = function() {
  return l.asm.xa.apply(null, arguments);
}, yc = l.dynCall_iiiii = function() {
  return l.asm.ya.apply(null, arguments);
}, zc = l.dynCall_vii = function() {
  return l.asm.za.apply(null, arguments);
}, Ac = l.dynCall_viiii = function() {
  return l.asm.Aa.apply(null, arguments);
}, Y = l.stackSave = function() {
  return l.asm.Ba.apply(null, arguments);
}, Ja = l.stackAlloc = function() {
  return l.asm.Ca.apply(null, arguments);
}, Z = l.stackRestore = function() {
  return l.asm.Da.apply(null, arguments);
};
l.dynCall_vi = function() {
  return l.asm.Ea.apply(null, arguments);
};
l.dynCall_v = function() {
  return l.asm.Fa.apply(null, arguments);
};
function jc(a, b, c) {
  var e = Y();
  try {
    return wc(a, b, c);
  } catch (f) {
    Z(e);
    if (f !== f + 0 && "longjmp" !== f) {
      throw f;
    }
    X(1, 0);
  }
}
function oc(a, b, c, e, f) {
  var g = Y();
  try {
    return yc(a, b, c, e, f);
  } catch (h) {
    Z(g);
    if (h !== h + 0 && "longjmp" !== h) {
      throw h;
    }
    X(1, 0);
  }
}
function pc(a, b, c) {
  var e = Y();
  try {
    zc(a, b, c);
  } catch (f) {
    Z(e);
    if (f !== f + 0 && "longjmp" !== f) {
      throw f;
    }
    X(1, 0);
  }
}
function ic(a, b) {
  var c = Y();
  try {
    return vc(a, b);
  } catch (e) {
    Z(c);
    if (e !== e + 0 && "longjmp" !== e) {
      throw e;
    }
    X(1, 0);
  }
}
function nc(a, b, c, e) {
  var f = Y();
  try {
    return xc(a, b, c, e);
  } catch (g) {
    Z(f);
    if (g !== g + 0 && "longjmp" !== g) {
      throw g;
    }
    X(1, 0);
  }
}
function hc(a, b) {
  var c = Y();
  try {
    return uc(a, b);
  } catch (e) {
    Z(c);
    if (e !== e + 0 && "longjmp" !== e) {
      throw e;
    }
    X(1, 0);
  }
}
function fc(a) {
  var b = Y();
  try {
    return tc(a);
  } catch (c) {
    Z(b);
    if (c !== c + 0 && "longjmp" !== c) {
      throw c;
    }
    X(1, 0);
  }
}
function qc(a, b, c, e, f) {
  var g = Y();
  try {
    Ac(a, b, c, e, f);
  } catch (h) {
    Z(g);
    if (h !== h + 0 && "longjmp" !== h) {
      throw h;
    }
    X(1, 0);
  }
}
l.asm = sc;
var Bc;
function sa(a) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + a + ")";
  this.status = a;
}
$a = function Cc() {
  Bc || Dc();
  Bc || ($a = Cc);
};
function Dc(a) {
  function b() {
    if (!Bc && (Bc = !0, !Aa)) {
      l.noFSInit || q.Bb.mc || q.Bb();
      d.root = q.Na(d, {}, null);
      W.root = q.Na(W, {}, null);
      Oa(Qa);
      q.Rc = !1;
      Oa(Ra);
      if (l.onRuntimeInitialized) {
        l.onRuntimeInitialized();
      }
      if (ea) {
        var b = a, e = l._main;
        b = b || [];
        var f = b.length + 1, g = Ja(4 * (f + 1));
        C[g >> 2] = Ia(ia);
        for (var h = 1; h < f; h++) {
          C[(g >> 2) + h] = Ia(b[h - 1]);
        }
        C[(g >> 2) + f] = 0;
        try {
          var m = e(f, g);
          ec(m, !0);
        } catch (n) {
          n instanceof sa || ("SimulateInfiniteLoop" == n ? xa = !0 : ((b = n) && "object" === typeof n && n.stack && (b = [n, n.stack]), A("exception thrown: " + b), ja(1, n)));
        } finally {
        }
      }
      if (l.postRun) {
        for ("function" == typeof l.postRun && (l.postRun = [l.postRun]); l.postRun.length;) {
          b = l.postRun.shift(), Sa.unshift(b);
        }
      }
      Oa(Sa);
    }
  }
  a = a || ha;
  if (!(0 < Ya)) {
    if (l.preRun) {
      for ("function" == typeof l.preRun && (l.preRun = [l.preRun]); l.preRun.length;) {
        Ta();
      }
    }
    Oa(Pa);
    0 < Ya || (l.setStatus ? (l.setStatus("Running..."), setTimeout(function() {
      setTimeout(function() {
        l.setStatus("");
      }, 1);
      b();
    }, 1)) : b());
  }
}
l.run = Dc;
function ec(a, b) {
  if (!b || !xa || 0 !== a) {
    if (!xa && (Aa = !0, l.onExit)) {
      l.onExit(a);
    }
    ja(a, new sa(a));
  }
}
if (l.preInit) {
  for ("function" == typeof l.preInit && (l.preInit = [l.preInit]); 0 < l.preInit.length;) {
    l.preInit.pop()();
  }
}
var ea = !1;
l.noInitialRun && (ea = !1);
xa = !0;
Dc();
self.postMessage(JSON.stringify({command:"ready"}));
