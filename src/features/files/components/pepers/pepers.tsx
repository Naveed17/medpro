import React, { useRef, useEffect, useState } from 'react';
import PaperStyles from "@features/files/components/pepers/peperStyles";

// @ts-ignore
const BookPage = ({ htmlContent, pageNumber,refp }) => {
    const pageRef = refp;
    const [pageChunks, setPageChunks] = useState<any[]>([]);

    useEffect(() => {
        // @ts-ignore
        const splitContent = (content, chunkSize) => {
            console.log(content.length)
            const chunks = [];
            for (let i = 0; i < content.length; i += chunkSize) {
                chunks.push(content.slice(i, i + chunkSize));
            }
            return chunks;
        };

        const handlePageBreak = () => {
            const maxHeight = 800; // Set your maximum height for a page
            const chunkSize = 500; // Set the character limit for each chunk

            const chunks = splitContent(htmlContent, chunkSize);
            const currentChunks:any[] = [];
            let currentChunk = '';

            // Iterate through chunks until the height limit is reached
            for (const chunk of chunks) {
                if (currentChunk.length + chunk.length > maxHeight) {
                    currentChunks.push(currentChunk);
                    currentChunk = chunk;
                } else {
                    currentChunk += chunk;
                }
            }

            currentChunks.push(currentChunk);
            setPageChunks(currentChunks);
        };

        handlePageBreak();
        window.addEventListener('resize', handlePageBreak);

        return () => {
            window.removeEventListener('resize', handlePageBreak);
        };
    }, [htmlContent]);

    return (
        <PaperStyles ref={pageRef} >
            {pageChunks.map((chunk, index) => (
                <div className={"page"}  key={index} dangerouslySetInnerHTML={{ __html: chunk }} />
            ))}
            <p className={"pageNumber"}>Page {pageNumber}</p>
        </PaperStyles>
    );
};

export default BookPage;
