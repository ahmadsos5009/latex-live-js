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

function App() {
  const [latexSource, setLatexSource] = useState( undefined);
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
