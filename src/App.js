import './App.css';
import useCompileLaTex from './use-compile-latex';
import useShowPdf from './use-show-pdf';
import { useEffect, useRef, useState } from "react";
import LoadingDocumentIcon from "./loadingDocument";
import LaTexIcon from "./LaTexIcon";
import ErrorIcon from "./errorIcon";

export const dispatch = (command) => {
  window.parent.postMessage({type: 'texlive', ...command}, '*')
}

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
  const [latexSource, setLatexSource] = useState(latex_code);
  const [compileError, setCompileError] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  const pdfRef = useRef(null);
  const compileLaTex = useCompileLaTex(setCompileError)
  const {showPdf, setCurrentScale, downloadDocument} = useShowPdf(pdfRef, setCompileError, setIsCompiling)

  useEffect(() => {
    if (compileError){
      setIsCompiling(false);
    }
  }, [compileError])

  useEffect(() => {
    const commandDispatcher = ({ data }) => {
      if (data.type !== 'texlive'){
        return
      }

      switch (data.command){
        case 'compile': setLatexSource(data.latexCode); break;
        case 'zoom-in': setCurrentScale('in'); break;
        case 'zoom-out': setCurrentScale('out'); break;
        case 'download': downloadDocument(); break;
        default: return;
      }
    };

    window.addEventListener('message', commandDispatcher);

    return () => window.removeEventListener('message', commandDispatcher)
  },[setLatexSource, setCurrentScale, downloadDocument])

  useEffect(() => {
    dispatch({command: 'compile', state: 'ready'})
  },[])

  useEffect(() => {
    if (!isCompiling || compileError){
      dispatch({command: 'compile', state: 'done'})
    } else {
      dispatch({command: 'compile', state: 'processing'})
    }
  },[isCompiling,compileError])

  useEffect( () => {
    if (!latexSource){
      return
    }

    const compile = async () => {
      setCompileError(false)
      setIsCompiling(true)
      const pdf = await compileLaTex(latexSource)
      showPdf(pdf)
    }

    compile().then(() => '')
  }, [showPdf, compileLaTex, latexSource, setIsCompiling, setCompileError])


  if (!latexSource){
    return <div className="App">
      <div className={'empty-latex-container'}>
      <div className={'latex-icon'}>
          <LaTexIcon/>
      </div>
          <strong>There is no latex code to compile it to pdf</strong>
      </div>
    </div>
  }

  return (
    <div className="App">
      {!compileError &&
      <div ref={pdfRef} id="viewerContainer">
           <div id="viewer" className="pdfViewer" />
      </div>
      }
      {compileError &&
      <div className={'error-container'}>
        {/* TODO:: add more info */}
        <div className={'error-icon'}>
          <ErrorIcon/>
        </div>
        Unable to compile your latex code
      </div>
      }
      {isCompiling && <div className={'loading-container'}><LoadingDocumentIcon/></div>}
    </div>
  );
}

export default App;
