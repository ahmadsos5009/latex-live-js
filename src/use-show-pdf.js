import {useCallback, useEffect} from "react";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import { EventBus, PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
import * as pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import 'pdfjs-dist/web/pdf_viewer.css';

export default (pdfRef,setCompilingError) => {

    useEffect(() => {
        GlobalWorkerOptions.workerSrc = pdfjsWorker;
    },[])

    return useCallback((pdf) => {
        if (!pdfRef.current || !pdf) {
            return;
        }

        const container = pdfRef.current;
        const eventBus = new EventBus();

        // @ts-ignore
        const pdfViewer = new PDFViewer({
            // @ts-ignore
            container,
            eventBus,
        });
        const loadingTask = getDocument({
            data: pdf,
            withCredentials: true,
            scale: 1.5,
        });

        loadingTask.promise
            .then(
                (pdfDocument) => {
                    // eslint-disable-next-line no-underscore-dangle
                    pdfViewer._setScale(0.95);
                    pdfViewer.setDocument(pdfDocument);
                    return true;
                },
                () => setCompilingError(true),
            )
            .catch(() => setCompilingError(true));
    }, [])
}
