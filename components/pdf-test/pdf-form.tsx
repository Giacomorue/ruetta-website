// /components/PDFForm.js
'use client'; // Indica che questo componente è client-side

import React, { useEffect, useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import MyPDFDocument from './pdf-preventivo-format';
import { Textarea } from '../ui/textarea';

const PDFForm = () => {
  const [text, setText] = useState('');
  const [client, setClient] = useState(false);

  const handleChange = (e: any) => {
    setText(e.target.value);
  };    

  useEffect(() => {
    setClient(true); 
  }, [])

  if(!client) return;

  return (
    <div>
      <form>
        <div>
          <label htmlFor="pdfText">Testo Centrale del PDF:</label>
          <Textarea
            id="pdfText"
            value={text}
            onChange={handleChange}
            rows={5}
          />
        </div>
      </form>
    </div>
  );
};

export default PDFForm;
