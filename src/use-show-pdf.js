import {useCallback, useEffect, useState} from "react";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import { EventBus, DownloadManager, PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
import * as pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import {dispatch} from "./App";

const DEFAULT_SCALE = 0.7;
const MAX_SCALE = 2;
const MIN_SCALE = 0.5;
const DELTA = 0.1;

const toFixed = (scale) => Number(parseFloat(scale).toFixed(2))

function useShowPdf(pdfRef,setCompilingError,setLoading){
    const [pdfViewer, setPdfViewer] = useState()
    const [scale, setScale] = useState(DEFAULT_SCALE);

    useEffect(() => {
        GlobalWorkerOptions.workerSrc = pdfjsWorker;
    },[])

    const showPdf = useCallback((pdf) => {
        if (!pdfRef.current || !pdf) {
            return;
        }

        const container = pdfRef.current;
        const eventBus = new EventBus();
        const downloadManager = new DownloadManager()

        eventBus.on('pagesloaded',() => {
            setLoading(false);
        })

        const pdfViewer = new PDFViewer({container, eventBus, downloadManager});
        const loadingTask = getDocument({
            data: pdf,
            withCredentials: true,
        });

        loadingTask.promise
            .then(
                (pdfDocument) => {
                    pdfViewer._setScale(DEFAULT_SCALE);
                    pdfViewer.setDocument(pdfDocument);
                    setPdfViewer(pdfViewer);
                    setCompilingError(false);
                    pdfRef.current.style.width = '100%';
                    pdfRef.current.style.height= '100%';
                    return true;
                },
                () => setCompilingError(true),
            )
            .catch(() => setCompilingError(true));
    }, [setCompilingError, pdfRef, setLoading])

    const setCurrentScale = useCallback((operation) => {
        if (operation === 'in' && scale < MAX_SCALE){
            setScale(toFixed(scale + DELTA));
        }

        if (operation === 'out' && scale > MIN_SCALE){
            setScale(toFixed(scale - DELTA));
        }
    },[pdfViewer,scale])

    useEffect(() => {
        if (pdfViewer){
           pdfViewer.currentScaleValue = Number(scale);
        }
    },[scale, pdfViewer])

    const downloadDocument = useCallback(async () => {
        const pdfDocument = pdfViewer?.pdfDocument
        if (pdfDocument){
            const data = await pdfDocument.getData();
            pdfViewer.downloadManager.downloadData(data, 'untitled.pdf');
            dispatch({ command: 'download', state: 'done' })
        }
    }, [pdfViewer])

    return {
        showPdf,
        setCurrentScale,
        downloadDocument
    }
}

export default useShowPdf
