import './App.css';
import useCompileLaTex from './use-compile-latex';
import useShowPdf from './use-show-pdf';
import {useEffect, useRef, useState} from "react";

const latex_code = '\n' +
    '\\documentclass[12pt]{article}\n' +
    '\\usepackage{amsmath}\n' +
    '\\usepackage{graphicx}\n' +
    '\n' +
    '\\title{\\TeX live.js}\n' +
    '\\author{Created by Manuel Sch\\"olling}\n' +
    '\\date{\\today}\n' +
    '\\begin{document}\n' +
    '  \\maketitle\n' +
    '  \\TeX{}live.js is a compiler for the \\TeX{}\n' +
    '  typesetting program created using Mozilla\'s Emscripten\n' +
    '  Compiler. It offers programmable desktop\n' +
    '  publishing features and extensive facilities for\n' +
    '  automating most aspects of typesetting and desktop\n' +
    '  publishing, including numbering and cross-referencing,\n' +
    '  tables and figures, page layout, bibliographies, and\n' +
    '  much more. It supports \\LaTeX{} which was originally written \n' +
    '  in 1984 by Leslie Lamport and has become the dominant method for\n' +
    '  using \\TeX;\n' +
    ' \n' +
    '  % This is a comment, not shown in final output.\n' +
    '  % The following shows typesetting power of LaTeX:\n' +
    '  \\begin{align}\n' +
    '    E_0 &= mc^2                              \\\\\n' +
    '    E &= \\frac{mc^2}{\\sqrt{1-\\frac{v^2}{c^2}}}\n' +
    '  \\end{align}\n' +
    '\n' +
    '\\end{document} \n' +
    '  \n' +
    '  \n' +
    '  '

function App() {
  const [compileError, setCompileError] = useState(false);
  const pdfRef = useRef(null);
  const compileLaTex = useCompileLaTex(setCompileError)
  const showPdf = useShowPdf(pdfRef)
  console.log(compileError)
  useEffect(() => {
    window.addEventListener('message', ({ data }) => {
      if (data.type === 'latex-compile'){
      console.log('i got some data!', data);
      }
    });
  },[])

  useEffect( () => {
    const compile = async () => {
      const pdf = await compileLaTex(latex_code)
      showPdf(pdf)
    }
    compile()
  }, [showPdf,compileLaTex])


  return (
    <div className="App">
      <div>
        TODO Header
      </div>
        <div>Loading View</div>
        <div ref={pdfRef} id="viewerContainer">
            <div id="viewer" className="pdfViewer" />
        </div>
    </div>
  );
}

export default App;
