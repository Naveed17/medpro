import {Button} from "@mui/material";
import React, {useEffect, useState} from "react";
import PageStyled from "@features/page/components/overrides/pageStyled";

function Doc({...props}) {
    const {data, setData, state: undefined, eventHandler, selected, setSelected} = props;
    const [pageChunks, setPageChunks] = useState<any[]>([]);

    const CONTENT_WIDTH = 400;
    const CONTENT_HEIGHT = 300
    const htmlContent="<table><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>ZF</td></tr></table>"


    /*function generateRandomContent() {
        var alph = "abcdefghijklmnopqrstuvwxyz";
        var content = "";
        // we will generate 100 random elements displaying their index to keep track of what's happening
        /!*for (var i = 0; i < 100; i++) {
            var type = parseInt(String(Math.random() * 2), 10);
            switch (type) {
                case 0: // text, generates and random p block
                    content = content + "<p>" + i + " ";
                    var numWords = 10 + parseInt(String(Math.random() * 50), 10);
                    for (var j = 0; j < numWords; j++) {
                        var numLetters = 2 + parseInt(String(Math.random() * 15), 10);
                        if (j > 0) {
                            content = content + " ";
                        }
                        for (var k = 0; k < numLetters; k++) {
                            // @ts-ignore
                            content = content + alph[parseInt(Math.random() * 26, 10)];
                        }

                    }
                    content = content + "</p>";
                    break;
                case 1: // colored div, generates a div of random size and color
                    var width = 30 + parseInt(Math.random() * 20, 10) * 10;
                    var height = 30 + parseInt(Math.random() * 20, 10) * 10;
                    var color = "rgb(" + parseInt(Math.random() * 255, 10) + ", " + parseInt(Math.random() * 255, 10) + ", " + parseInt(Math.random() * 255, 10) + ")";
                    content = content + '<div style="width: ' + width + 'px; height: ' + height + 'px; background-color: ' + color + '">' + i + '</div>';
                    break;
            }
        }*!/
       // console.log(content)
        content="<table><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>Z</td></tr><tr><td>X</td><td>Y</td><td>ZF</td></tr></table>"
        return content;
    }

    function getNodeChunks(htmlDocument) {
        var offscreenDiv = document.createElement('div');
        offscreenDiv.className = 'x';
        offscreenDiv.style.width = `${CONTENT_WIDTH}px`
        offscreenDiv.style.height = `${CONTENT_HEIGHT}px`
        offscreenDiv.style.position = 'absolute';
        offscreenDiv.style.top = '-3000px';
        offscreenDiv.innerHTML = htmlDocument;
        offscreenDiv.display = 'flex';
        offscreenDiv.flexWrap = 'wrap';
        document.body.appendChild(offscreenDiv);
        let offscreenRect = offscreenDiv.getBoundingClientRect();
        // console.log('offscreenRect:', offscreenRect);
        var chunks = [];
        var currentChunk = []
        for (var i = 0; i < offscreenDiv.children.length; i++) {
            var current = offscreenDiv.children[i];
            var currentRect = current.getBoundingClientRect();
            currentChunk.push(current);
            if (currentRect.bottom > (offscreenRect.bottom)) {
                // current element is overflowing offscreenDiv, remove it from current chunk
                currentChunk.pop();
                // remove all elements in currentChunk from offscreenDiv
                currentChunk.forEach(elem => elem.remove());
                // since children were removed from offscreenDiv, adjust i to start back at current eleme on next iteration
                i -= currentChunk.length;
                // push current completed chunk to the resulting chunklist
                chunks.push(currentChunk);
                // initialise new current chunk
                currentChunk = [current];
                offscreenRect = offscreenDiv.getBoundingClientRect();
            }
        }
        // currentChunk may not be empty but we need the last elements
        if (currentChunk.length > 0) {
            currentChunk.forEach(elem => elem.remove());
            chunks.push(currentChunk);
        }
        // offscreenDiv is not needed anymore
        offscreenDiv.remove();
        return chunks;
    }

    function appendChunksToPages(chunks) {
        var container = document.getElementsByClassName('root_container')[0];
        if (container) {
            chunks.forEach((chunk, index) => {
                // ex of a page header
                var header = document.createElement('div');
                header.innerHTML = '<h4 style="margin: 5px">Page ' + (index + 1) + '</h4>';
                container.appendChild(header);
                var page = document.createElement('div');
                page.className = 'x';
                page.style.width = `${CONTENT_WIDTH}px`
                page.style.height = `${CONTENT_HEIGHT}px`
                chunk.forEach(elem => page.appendChild(elem));
                container.appendChild(page);
            });
        }

    }
*/
    const s = () =>{
        var container = document.getElementById('container');
        var items = container.children;
        var divWidth = 200; // Largeur fixe de chaque div
        var divHeight = 100; // Hauteur fixe de chaque div

        // Calculez le nombre de divs nécessaires en fonction de la largeur et de la hauteur spécifiées
        var numCols = Math.floor(container.offsetWidth / divWidth);
        var numRows = Math.ceil(items.length / numCols);

        // Créez et ajoutez les divs
        for (var i = 0; i < numRows; i++) {
            for (var j = 0; j < numCols; j++) {
                var index = i * numCols + j;
                if (index < items.length) {
                    var newDiv = document.createElement('div');
                    newDiv.className = 'item';
                    newDiv.innerHTML = items[index].outerHTML;
                    container.appendChild(newDiv);
                }
            }
        }
    }

    return (
        <PageStyled>
            <div onClick={s} className="container" id="container">
                <p>Your paragraph here...</p>
                <table>
                    <tr>
                        <td>Table content</td>
                        <td>More content</td>
                    </tr>
                </table>
            </div>
        </PageStyled>
    )
}

export default Doc
