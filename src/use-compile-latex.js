import { useCallback } from 'react';

import { TeXLive } from './lib/pdftex';
import { config } from "./config";
/**
 * compile latex source to a pdf, using latex-live.js
 */
function useCompileLaTex(setCompileError){
    return useCallback(async (latex) => {
        const texlive = new TeXLive(setCompileError);
        const { pdftex } = texlive;

        pdftex.on_stdout = pdfLoggerInfo;
        pdftex.on_stderr = pdfLoggerError;

        const startTime = new Date().getTime();

        // TODO:: set files when using \input & \include
        // TODO:: pdfTexPreload.set_TOTAL_MEMORY(config.MAX_TEXLIVE_MEMORY_USE);
        const pdfDataUrl = await pdftex.compile(latex);
        const endTime = new Date().getTime();

        pdfLoggerInfo(`Execution time: ${(endTime - startTime) / 1000} sec`);
        texlive.terminate();

        return !pdfDataUrl ? undefined : convertDataURIToBinary(pdfDataUrl);
    }, []);
}

const pdfLoggerInfo = (message) => {
    if (config.IS_DEVELOPMENT) {
        console.info('Tex-Live: ', message);
    }
};

const pdfLoggerError = (message) => {
    if (config.IS_DEVELOPMENT) {
        console.error('Tex-Live: ', message);
    }
};

const convertDataURIToBinary = (dataURI) => {
    const BASE64_MARKER = ';base64,';
    const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    const base64 = dataURI.substring(base64Index);
    const raw = window.atob(base64);
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    return array;
};

export default useCompileLaTex
